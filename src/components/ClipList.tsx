import React, { useState } from "react";
import { useProjectStore } from "../state/projectStore";
import { formatTimestamp } from "../utils/timeFormat";

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

  const tableCellStyle = {
    border: "1px solid #d1d5db",
    padding: "4px 8px",
  };

  const buttonStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "white",
  };

  return (
    <div>
      {projectStore.clips.length === 0 ? (
        <p style={{ margin: 0 }}>No clips added yet. Use Mark In/Out (i/o) and press `a` to add one.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr>
              <th style={tableCellStyle}>Select</th>
              <th style={tableCellStyle}>Name</th>
              <th style={tableCellStyle}>In</th>
              <th style={tableCellStyle}>Out</th>
              <th style={tableCellStyle}>Duration</th>
              <th style={tableCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectStore.clips.map((clip) => (
              <tr key={clip.id} style={{ backgroundColor: "white" }}>
                <td style={{ ...tableCellStyle, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={projectStore.isSelected(clip.id)}
                    onChange={() => handleSelect(clip.id)}
                  />
                </td>
                <td style={tableCellStyle}>
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
                      style={{ width: "100%", padding: "2px 4px", border: "1px solid #d1d5db", borderRadius: "2px" }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() => startEditing(clip.id, clip.name)}
                      style={{ cursor: "pointer" }}
                      title="Double-click to edit"
                    >
                      {clip.name}
                    </span>
                  )}
                </td>
                <td style={tableCellStyle}>{formatTimestamp(clip.inSeconds)}</td>
                <td style={tableCellStyle}>{formatTimestamp(clip.outSeconds)}</td>
                <td style={tableCellStyle}>{formatTimestamp(clip.outSeconds - clip.inSeconds)}</td>
                <td style={{ ...tableCellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => startEditing(clip.id, clip.name)}
                    style={{ ...buttonStyle, backgroundColor: "#3b82f6", marginRight: "4px" }}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(clip.id)}
                    style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
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
