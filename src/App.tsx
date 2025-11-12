import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import ClipList from "./components/ClipList";
import TransportControls from "./components/TransportControls";
import EventDetails from "./components/EventDetails";
import { useProjectStore } from "./state/projectStore";

/**
 * The top‑level React component for the application. It handles opening a video,
 * displaying the video player and clip list, and triggering exports of selected clips.
 */
const App: React.FC = () => {
  const projectStore = useProjectStore();
  const [sourcePath, setSourcePath] = useState<string | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"clips" | "event">("clips");

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
    <div style={{ padding: "16px", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexShrink: 0,
        }}
      >
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
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
          {/* Tab Navigation */}
          <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", marginBottom: "16px", flexShrink: 0 }}>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === "clips" ? "3px solid #2563eb" : "3px solid transparent",
                color: activeTab === "clips" ? "#2563eb" : "#6b7280",
                fontWeight: activeTab === "clips" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "-2px",
              }}
              onClick={() => setActiveTab("clips")}
            >
              Clips
            </button>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === "event" ? "3px solid #2563eb" : "3px solid transparent",
                color: activeTab === "event" ? "#2563eb" : "#6b7280",
                fontWeight: activeTab === "event" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "-2px",
              }}
              onClick={() => setActiveTab("event")}
            >
              Event Details
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "clips" ? (
            <div style={{ display: "flex", flex: 1, gap: "16px", overflow: "hidden", minHeight: 0 }}>
              {/* Left side: Video Player and Controls */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  minHeight: 0,
                  maxHeight: "100%",
                  overflow: "hidden",
                }}
              >
                <div style={{ flex: "0 1 auto", minHeight: 0, maxHeight: "calc(100% - 200px)", overflow: "hidden" }}>
                  <VideoPlayer source={videoURL} />
                </div>
                <div style={{ flexShrink: 0 }}>
                  <TransportControls />
                </div>
                <button
                  style={{
                    marginTop: "16px",
                    backgroundColor: projectStore.selectedClips.length === 0 ? "#9ca3af" : "#16a34a",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: projectStore.selectedClips.length === 0 ? "not-allowed" : "pointer",
                    flexShrink: 0,
                  }}
                  onClick={handleExportSelected}
                  disabled={projectStore.selectedClips.length === 0}
                >
                  Export Selected Clips ({projectStore.selectedClips.length})
                </button>
              </div>

              {/* Right side: Clips List */}
              <div style={{ width: "450px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", marginTop: 0, flexShrink: 0 }}>
                  Clips
                </h2>
                <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                  <ClipList />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              <EventDetails />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
