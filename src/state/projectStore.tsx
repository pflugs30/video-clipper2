import React, { createContext, useContext, useState } from "react";
import { ProjectData, isValidProjectData, isSupportedVersion, PROJECT_FILE_VERSION } from "../types/project";

// Definition of a clip. Each clip has an ID, a name, and in/out times in seconds.
export interface Clip {
  id: string;
  name: string;
  inSeconds: number;
  outSeconds: number;
}

// The shape of the state and methods provided by the project store.
interface ProjectState {
  clips: Clip[];
  selectedClipIds: Set<string>;
  markInTime: number | null;
  markOutTime: number | null;
  currentTime: number;
  playbackSpeed: number;
  videoSourcePath: string | null;
  currentProjectPath: string | null;
  isDirty: boolean;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  markIn: (time?: number) => void;
  markOut: (time?: number) => void;
  addClipFromMarks: () => void;
  clearMarks: () => void;
  toggleClipSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  selectedClips: Clip[];
  deleteClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  addSource: (path: string) => void;
  saveProject: () => Promise<void>;
  loadProject: () => Promise<string | null>;
}

// Create a context for the project store. It will be defined at runtime in the provider.
const ProjectContext = createContext<ProjectState | undefined>(undefined);

/**
 * Generate a unique ID for clips without relying on external dependencies. Uses
 * the current time and a random component for uniqueness.
 */
const uniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
};

/**
 * The provider component for the project store. This component holds the clip
 * state and exposes functions to update it. Wrap your application in this
 * provider to access the store via `useProjectStore()`.
 */
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // List of all clips added in the current session.
  const [clips, setClips] = useState<Clip[]>([]);
  // IDs of clips currently selected for export.
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(new Set());
  // Temporary storage for the next clip's in and out times.
  const [markInTime, setMarkInTime] = useState<number | null>(null);
  const [markOutTime, setMarkOutTime] = useState<number | null>(null);
  // Current playback time from the video player.
  const [currentTime, setCurrentTime] = useState<number>(0);
  // Current playback speed (1.0 = normal speed).
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  // Path to the currently loaded video source.
  const [videoSourcePath, setVideoSourcePath] = useState<string | null>(null);
  // Path to the currently open project file (null if never saved).
  const [currentProjectPath, setCurrentProjectPath] = useState<string | null>(null);
  // Track if the project has unsaved changes.
  const [isDirty, setIsDirty] = useState<boolean>(false);

  /**
   * Mark the starting time of a clip. If provided a time, that value is used;
   * otherwise uses the current time from the player.
   * If the new In time is after the current Out time, the Out time is adjusted to match.
   */
  const markIn = (time?: number) => {
    const timeToUse = typeof time === "number" ? time : currentTime;
    setMarkInTime(timeToUse);

    // Validate: if Out time exists and is before the new In time, adjust Out to match In
    if (markOutTime !== null && timeToUse > markOutTime) {
      setMarkOutTime(timeToUse);
    }
  };

  /**
   * Mark the ending time of a clip. If provided a time, that value is used;
   * otherwise uses the current time from the player.
   * If the new Out time is before the current In time, the In time is adjusted to match.
   */
  const markOut = (time?: number) => {
    const timeToUse = typeof time === "number" ? time : currentTime;
    setMarkOutTime(timeToUse);

    // Validate: if In time exists and is after the new Out time, adjust In to match Out
    if (markInTime !== null && timeToUse < markInTime) {
      setMarkInTime(timeToUse);
    }
  };

  /**
   * Add a new clip based on the current mark in/out times. If the times are not
   * set or the out time is before the in time, nothing happens. After adding
   * the clip the marks are reset.
   */
  const addClipFromMarks = () => {
    if (markInTime === null || markOutTime === null || markOutTime <= markInTime) {
      return;
    }
    const newClip: Clip = {
      id: uniqueId(),
      name: `Clip ${clips.length + 1}`,
      inSeconds: markInTime,
      outSeconds: markOutTime,
    };
    setClips([...clips, newClip]);
    setIsDirty(true);
    // Reset the markers for the next clip.
    setMarkInTime(null);
    setMarkOutTime(null);
  };

  /**
   * Clear the current mark in/out times without adding a clip.
   */
  const clearMarks = () => {
    setMarkInTime(null);
    setMarkOutTime(null);
  };

  /**
   * Delete a clip by its ID.
   */
  const deleteClip = (id: string) => {
    setClips(clips.filter((clip) => clip.id !== id));
    setIsDirty(true);
    // Also remove from selection if it was selected
    const next = new Set(selectedClipIds);
    next.delete(id);
    setSelectedClipIds(next);
  };

  /**
   * Update a clip's properties. Accepts partial updates.
   */
  const updateClip = (id: string, updates: Partial<Clip>) => {
    setClips(clips.map((clip) => (clip.id === id ? { ...clip, ...updates } : clip)));
    setIsDirty(true);
  };

  /**
   * Toggle the selection of a clip for export. If the clip is already selected,
   * it is unselected; otherwise it is selected.
   */
  const toggleClipSelection = (id: string) => {
    const next = new Set(selectedClipIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedClipIds(next);
  };

  /**
   * Check whether a given clip ID is selected.
   */
  const isSelected = (id: string) => {
    return selectedClipIds.has(id);
  };

  /**
   * Get the full clip objects for all selected clip IDs.
   */
  const selectedClips = clips.filter((clip) => selectedClipIds.has(clip.id));

  /**
   * Placeholder for associating a source file with the project. In a future
   * iteration you could store and persist project metadata here.
   */
  const addSource = (path: string) => {
    setVideoSourcePath(path);
    setIsDirty(true);
  };

  /**
   * Save the current project to a JSON file. If the project has never been saved,
   * prompts the user to choose a save location. Otherwise, saves to the current path.
   */
  const saveProject = async () => {
    try {
      // If no video source, nothing to save
      if (!videoSourcePath) {
        alert("No video source loaded. Please open a video first.");
        return;
      }

      // Determine save path
      let savePath = currentProjectPath;
      if (!savePath) {
        // First time saving - prompt for location
        savePath = await window.electronAPI.saveProject();
        if (!savePath) {
          return; // User canceled
        }
        setCurrentProjectPath(savePath);
      }

      // Build project data
      const projectData: ProjectData = {
        version: PROJECT_FILE_VERSION,
        appVersion: "1.0.0", // TODO: Get from package.json
        created: currentProjectPath ? new Date().toISOString() : new Date().toISOString(),
        modified: new Date().toISOString(),
        videoSource: {
          path: videoSourcePath,
        },
        clips: clips,
      };

      // Write to file
      const result = await window.electronAPI.writeProject(savePath, JSON.stringify(projectData, null, 2));

      if (result.success) {
        setIsDirty(false);
        console.log("Project saved successfully to:", savePath);
      } else {
        alert(`Failed to save project: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert(`Failed to save project: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  /**
   * Load a project from a JSON file. Prompts the user to select a file,
   * validates the data, and replaces the current project state.
   * Returns the video source path on success, null otherwise.
   */
  const loadProject = async (): Promise<string | null> => {
    try {
      // Prompt user to select a project file
      const filePath = await window.electronAPI.openProject();
      if (!filePath) {
        return null; // User canceled
      }

      // Read the file
      const result = await window.electronAPI.readProject(filePath);
      if (!result.success || !result.content) {
        alert(`Failed to read project file: ${result.error}`);
        return null;
      }

      // Parse JSON
      let data: unknown;
      try {
        data = JSON.parse(result.content);
      } catch (parseError) {
        alert("Invalid JSON file. The file may be corrupted.");
        return null;
      }

      // Validate structure
      if (!isValidProjectData(data)) {
        alert("Invalid project file structure. This does not appear to be a valid Video Clipper project.");
        return null;
      }

      // Check version compatibility
      if (!isSupportedVersion(data.version)) {
        alert(
          `Unsupported project version: ${data.version}. This application supports version ${PROJECT_FILE_VERSION}.`
        );
        // TODO: Implement version migration logic
        return null;
      }

      // Check if video source file exists
      const videoExists = await window.electronAPI.fileExists(data.videoSource.path);
      if (!videoExists) {
        alert(
          `The video file could not be found at: ${data.videoSource.path}\n\nTODO: Implement file relocation feature.`
        );
        // TODO: Prompt user to relocate the video file
        return null;
      }

      // Load the data into state
      setClips(data.clips);
      setVideoSourcePath(data.videoSource.path);
      setCurrentProjectPath(filePath);
      setSelectedClipIds(new Set());
      setMarkInTime(null);
      setMarkOutTime(null);
      setIsDirty(false);

      console.log("Project loaded successfully from:", filePath);

      // Return the video source path so App can load the video
      return data.videoSource.path;
    } catch (error) {
      console.error("Error loading project:", error);
      alert(`Failed to load project: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        clips,
        selectedClipIds,
        markInTime,
        markOutTime,
        currentTime,
        playbackSpeed,
        videoSourcePath,
        currentProjectPath,
        isDirty,
        setCurrentTime,
        setPlaybackSpeed,
        markIn,
        markOut,
        addClipFromMarks,
        clearMarks,
        toggleClipSelection,
        isSelected,
        selectedClips,
        deleteClip,
        updateClip,
        addSource,
        saveProject,
        loadProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

/**
 * Hook to access the project store. Must be used within a ProjectProvider.
 */
export const useProjectStore = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectStore must be used within a ProjectProvider");
  }
  return context;
};
