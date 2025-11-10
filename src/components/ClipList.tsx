import React from 'react';
import { useProjectStore } from '../state/projectStore';

/**
 * Displays the list of clips that have been added. Each clip shows its
 * name, in/out times, and duration. A checkbox allows selecting multiple
 * clips for export.
 */
const ClipList: React.FC = () => {
  const projectStore = useProjectStore();

  const handleSelect = (id: string) => {
    projectStore.toggleClipSelection(id);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Clips</h2>
      {projectStore.clips.length === 0 ? (
        <p>No clips added yet. Use Mark In/Out (i/o) and press `a` to add one.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Select</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">In (s)</th>
              <th className="border px-2 py-1">Out (s)</th>
              <th className="border px-2 py-1">Duration (s)</th>
            </tr>
          </thead>
          <tbody>
            {projectStore.clips.map((clip) => (
              <tr key={clip.id} className="hover:bg-gray-100">
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={projectStore.isSelected(clip.id)}
                    onChange={() => handleSelect(clip.id)}
                  />
                </td>
                <td className="border px-2 py-1">{clip.name}</td>
                <td className="border px-2 py-1">{clip.inSeconds.toFixed(2)}</td>
                <td className="border px-2 py-1">{clip.outSeconds.toFixed(2)}</td>
                <td className="border px-2 py-1">
                  {(clip.outSeconds - clip.inSeconds).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClipList;