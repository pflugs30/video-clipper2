import React from "react";
import { useProjectStore } from "../state/projectStore";

/**
 * Simple transport control buttons for marking in/out and adding a clip.
 * These functions mirror the keyboard shortcuts handled in the VideoPlayer.
 * Displays current mark in/out times when set.
 */
const TransportControls: React.FC = () => {
  const projectStore = useProjectStore();

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, "0")}`;
  };

  return (
    <div className="my-4">
      <div className="flex items-center space-x-2 mb-2">
        <button className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300" onClick={() => projectStore.markIn()}>
          Mark In (i)
        </button>
        <button className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300" onClick={() => projectStore.markOut()}>
          Mark Out (o)
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          onClick={() => projectStore.addClipFromMarks()}
          disabled={projectStore.markInTime === null || projectStore.markOutTime === null}
        >
          Add Clip (a)
        </button>
        <button
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          onClick={() => projectStore.clearMarks()}
          disabled={projectStore.markInTime === null && projectStore.markOutTime === null}
        >
          Clear Marks
        </button>
      </div>
      <div className="text-sm space-y-1">
        <div>
          <span className="font-semibold">In:</span> {formatTime(projectStore.markInTime)}
        </div>
        <div>
          <span className="font-semibold">Out:</span> {formatTime(projectStore.markOutTime)}
        </div>
        {projectStore.markInTime !== null && projectStore.markOutTime !== null && (
          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {(projectStore.markOutTime - projectStore.markInTime).toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportControls;
