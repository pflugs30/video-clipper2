import React, { useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ClipList from './components/ClipList';
import TransportControls from './components/TransportControls';
import { useProjectStore } from './state/projectStore';

/**
 * The top‑level React component for the application. It handles opening a video,
 * displaying the video player and clip list, and triggering exports of selected clips.
 */
const App: React.FC = () => {
  const projectStore = useProjectStore();
  const [sourcePath, setSourcePath] = useState<string | null>(null);

  /**
   * Open a video using the native dialog exposed by the preload script. On success,
   * store the file path and reset the project (if needed).
   */
  const handleOpenVideo = async () => {
    const filePath = await (window as any).electronAPI.openVideo();
    if (filePath) {
      setSourcePath(filePath);
      // In a more complete app you might reset the project store here
      // or associate clips with this particular source.
    }
  };

  /**
   * Export all currently selected clips via the main process IPC. Each clip is
   * exported independently. The stub in the main process logs the intended command.
   */
  const handleExportSelected = async () => {
    if (!sourcePath) return;
    for (const clip of projectStore.selectedClips) {
      await (window as any).electronAPI.exportClip(sourcePath, clip);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Video Clipper v0.1</h1>
      {!sourcePath ? (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenVideo}
        >
          Open Video
        </button>
      ) : (
        <>
          <VideoPlayer source={sourcePath} />
          <TransportControls />
          <ClipList />
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleExportSelected}
          >
            Export Selected Clips
          </button>
        </>
      )}
    </div>
  );
};

export default App;