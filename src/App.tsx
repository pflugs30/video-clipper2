import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import ClipList from "./components/ClipList";
import TransportControls from "./components/TransportControls";
import { useProjectStore } from "./state/projectStore";

/**
 * The top‑level React component for the application. It handles opening a video,
 * displaying the video player and clip list, and triggering exports of selected clips.
 */
const App: React.FC = () => {
  const projectStore = useProjectStore();
  const [sourcePath, setSourcePath] = useState<string | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  /**
   * Open a video using the native dialog exposed by the preload script. On success,
   * store the file path and convert it to a URL that can be loaded in the renderer.
   */
  const handleOpenVideo = async () => {
    const filePath = await window.electronAPI.openVideo();
    if (filePath) {
      setSourcePath(filePath);
      const url = await window.electronAPI.getVideoURL(filePath);
      setVideoURL(url);
      projectStore.addSource(filePath);
    }
  };

  /**
   * Export all currently selected clips via the main process IPC. Each clip is
   * exported independently. The stub in the main process logs the intended command.
   */
  const handleExportSelected = async () => {
    if (!sourcePath) return;
    for (const clip of projectStore.selectedClips) {
      await window.electronAPI.exportClip(sourcePath, clip);
    }
  };

  /**
   * Save the current project to a JSON file.
   */
  const handleSaveProject = async () => {
    await projectStore.saveProject();
  };

  /**
   * Load a project from a JSON file.
   */
  const handleLoadProject = async () => {
    const videoPath = await projectStore.loadProject();
    // After loading, update the video source if one was loaded
    if (videoPath) {
      setSourcePath(videoPath);
      const url = await window.electronAPI.getVideoURL(videoPath);
      setVideoURL(url);
    }
  };

  return (
    <div style={{ padding: "16px", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Video Clipper</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              backgroundColor: "#0891b2",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLoadProject}
          >
            Load Project
          </button>
          <button
            style={{
              backgroundColor: !videoURL ? "#9ca3af" : "#0891b2",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: !videoURL ? "not-allowed" : "pointer",
            }}
            onClick={handleSaveProject}
            disabled={!videoURL}
          >
            Save Project
          </button>
        </div>
      </div>
      {!videoURL ? (
        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleOpenVideo}
        >
          Open Video
        </button>
      ) : (
        <div style={{ display: "flex", flex: 1, gap: "16px", overflow: "hidden" }}>
          {/* Left side: Video Player and Controls */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <VideoPlayer source={videoURL} />
            <TransportControls />
            <button
              style={{
                marginTop: "16px",
                backgroundColor: projectStore.selectedClips.length === 0 ? "#9ca3af" : "#16a34a",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: projectStore.selectedClips.length === 0 ? "not-allowed" : "pointer",
              }}
              onClick={handleExportSelected}
              disabled={projectStore.selectedClips.length === 0}
            >
              Export Selected Clips ({projectStore.selectedClips.length})
            </button>
          </div>

          {/* Right side: Clips List */}
          <div style={{ width: "384px", flexShrink: 0, overflowY: "auto" }}>
            <ClipList />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
