import React, { useState } from "react";
import { useProjectStore } from "../state/projectStore";

/**
 * Displays the list of clips that have been added. Each clip shows its
 * name, in/out times, and duration. A checkbox allows selecting multiple
 * clips for export. Clips can be renamed or deleted.
 */
const ClipList: React.FC = () => {
  const projectStore = useProjectStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const handleSelect = (id: string) => {
    projectStore.toggleClipSelection(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this clip?")) {
      projectStore.deleteClip(id);
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      projectStore.updateClip(id, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
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
              <th className="border px-2 py-1">Actions</th>
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
                <td className="border px-2 py-1">
                  {editingId === clip.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(clip.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      onBlur={() => saveEdit(clip.id)}
                      className="w-full px-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() => startEditing(clip.id, clip.name)}
                      className="cursor-pointer"
                      title="Double-click to edit"
                    >
                      {clip.name}
                    </span>
                  )}
                </td>
                <td className="border px-2 py-1">{clip.inSeconds.toFixed(2)}</td>
                <td className="border px-2 py-1">{clip.outSeconds.toFixed(2)}</td>
                <td className="border px-2 py-1">{(clip.outSeconds - clip.inSeconds).toFixed(2)}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => startEditing(clip.id, clip.name)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-xs hover:bg-blue-600"
                    title="Edit name"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(clip.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    title="Delete clip"
                  >
                    🗑️
                  </button>
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
