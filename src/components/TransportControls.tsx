import React from "react";
import { useProjectStore } from "../state/projectStore";
import { formatTimestamp } from "../utils/timeFormat";

/**
 * Simple transport control buttons for marking in/out and adding a clip.
 * These functions mirror the keyboard shortcuts handled in the VideoPlayer.
 * Displays current mark in/out times when set.
 */
const TransportControls: React.FC = () => {
  const projectStore = useProjectStore();

  const buttonStyle = {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <button style={{ ...buttonStyle, backgroundColor: "#e5e7eb" }} onClick={() => projectStore.markIn()}>
          Mark In (i)
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#e5e7eb" }} onClick={() => projectStore.markOut()}>
          Mark Out (o)
        </button>
        <button
          style={
            projectStore.markInTime === null || projectStore.markOutTime === null
              ? { ...disabledButtonStyle, backgroundColor: "#93c5fd", color: "white" }
              : { ...buttonStyle, backgroundColor: "#3b82f6", color: "white" }
          }
          onClick={() => projectStore.addClipFromMarks()}
          disabled={projectStore.markInTime === null || projectStore.markOutTime === null}
        >
          Add Clip (a)
        </button>
        <button
          style={
            projectStore.markInTime === null && projectStore.markOutTime === null
              ? { ...disabledButtonStyle, backgroundColor: "#fca5a5", color: "white" }
              : { ...buttonStyle, backgroundColor: "#ef4444", color: "white" }
          }
          onClick={() => projectStore.clearMarks()}
          disabled={projectStore.markInTime === null && projectStore.markOutTime === null}
        >
          Clear Marks (c)
        </button>
        <span style={{ fontSize: "14px", marginLeft: "8px" }}>
          <span style={{ fontWeight: 600 }}>In:</span> {formatTimestamp(projectStore.markInTime)}
          <span style={{ marginLeft: "16px", fontWeight: 600 }}>Out:</span> {formatTimestamp(projectStore.markOutTime)}
          {projectStore.markInTime !== null && projectStore.markOutTime !== null && (
            <>
              <span style={{ marginLeft: "16px", fontWeight: 600 }}>Duration:</span>{" "}
              {formatTimestamp(projectStore.markOutTime - projectStore.markInTime)}
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default TransportControls;
