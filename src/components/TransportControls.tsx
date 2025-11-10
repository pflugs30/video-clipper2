import React from 'react';
import { useProjectStore } from '../state/projectStore';

/**
 * Simple transport control buttons for marking in/out and adding a clip.
 * These functions mirror the keyboard shortcuts handled in the VideoPlayer.
 */
const TransportControls: React.FC = () => {
  const projectStore = useProjectStore();

  return (
    <div className="flex items-center space-x-2 my-2">
      <button
        className="bg-gray-200 px-2 py-1 rounded"
        onClick={() => projectStore.markIn()}
      >
        Mark In (i)
      </button>
      <button
        className="bg-gray-200 px-2 py-1 rounded"
        onClick={() => projectStore.markOut()}
      >
        Mark Out (o)
      </button>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded"
        onClick={() => projectStore.addClipFromMarks()}
      >
        Add Clip (a)
      </button>
    </div>
  );
};

export default TransportControls;