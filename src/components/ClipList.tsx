import React from "react";
import { useProjectStore } from "../state/projectStore";
import { formatTimestamp } from "../utils/timeFormat";

/**
 * Displays the list of clips that have been added. Each clip shows its
 * name, in/out times, and duration. A checkbox allows selecting multiple
 * clips for export. Clips can be edited or deleted.
 */
const ClipList: React.FC = () => {
  const projectStore = useProjectStore();

  const handleSelect = (id: string) => {
    projectStore.toggleClipSelection(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this clip?")) {
      projectStore.deleteClip(id);
    }
  };

  const handleEdit = (id: string) => {
    const clip = projectStore.clips.find((c) => c.id === id);
    if (clip) {
      projectStore.openClipDialog(clip);
    }
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
                  <span>{clip.name}</span>
                </td>
                <td style={tableCellStyle}>{formatTimestamp(clip.inSeconds)}</td>
                <td style={tableCellStyle}>{formatTimestamp(clip.outSeconds)}</td>
                <td style={tableCellStyle}>{formatTimestamp(clip.outSeconds - clip.inSeconds)}</td>
                <td style={{ ...tableCellStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => handleEdit(clip.id)}
                    style={{ ...buttonStyle, backgroundColor: "#3b82f6", marginRight: "4px" }}
                    title="Edit clip"
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
