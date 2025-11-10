import React, { createContext, useContext, useState } from 'react';

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
  markIn: (time?: number) => void;
  markOut: (time?: number) => void;
  addClipFromMarks: () => void;
  toggleClipSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  selectedClips: Clip[];
  addSource: (path: string) => void;
}

// Create a context for the project store. It will be defined at runtime in the provider.
const ProjectContext = createContext<ProjectState | undefined>(undefined);

/**
 * Generate a unique ID for clips without relying on external dependencies. Uses
 * the current time and a random component for uniqueness.
 */
const uniqueId = (): string => {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
  );
};

/**
 * The provider component for the project store. This component holds the clip
 * state and exposes functions to update it. Wrap your application in this
 * provider to access the store via `useProjectStore()`.
 */
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // List of all clips added in the current session.
  const [clips, setClips] = useState<Clip[]>([]);
  // IDs of clips currently selected for export.
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(
    new Set()
  );
  // Temporary storage for the next clip’s in and out times.
  const [markInTime, setMarkInTime] = useState<number | null>(null);
  const [markOutTime, setMarkOutTime] = useState<number | null>(null);

  /**
   * Mark the starting time of a clip. If provided a time, that value is used;
   * otherwise the call is ignored.
   */
  const markIn = (time?: number) => {
    if (typeof time === 'number') {
      setMarkInTime(time);
    }
  };

  /**
   * Mark the ending time of a clip. Only sets the value if a number is provided.
   */
  const markOut = (time?: number) => {
    if (typeof time === 'number') {
      setMarkOutTime(time);
    }
  };

  /**
   * Add a new clip based on the current mark in/out times. If the times are not
   * set or the out time is before the in time, nothing happens. After adding
   * the clip the marks are reset.
   */
  const addClipFromMarks = () => {
    if (
      markInTime === null ||
      markOutTime === null ||
      markOutTime <= markInTime
    ) {
      return;
    }
    const newClip: Clip = {
      id: uniqueId(),
      name: `Clip ${clips.length + 1}`,
      inSeconds: markInTime,
      outSeconds: markOutTime,
    };
    setClips([...clips, newClip]);
    // Reset the markers for the next clip.
    setMarkInTime(null);
    setMarkOutTime(null);
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
  const addSource = (_path: string) => {
    // Not implemented in this skeleton.
  };

  return (
    <ProjectContext.Provider
      value={{
        clips,
        selectedClipIds,
        markInTime,
        markOutTime,
        markIn,
        markOut,
        addClipFromMarks,
        toggleClipSelection,
        isSelected,
        selectedClips,
        addSource,
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
    throw new Error('useProjectStore must be used within a ProjectProvider');
  }
  return context;
};