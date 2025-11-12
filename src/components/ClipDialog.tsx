/**
 * Modal dialog for adding or editing video clips.
 * Provides a comprehensive form for entering all clip metadata.
 */

import React, { useState, useEffect, useRef } from "react";
import { Clip } from "../types/clip";
import { Call } from "../types/call";
import { CALLS } from "../data/calls";

interface ClipDialogProps {
  /** Whether the dialog is currently open */
  isOpen: boolean;
  /** The clip being edited, or null for a new clip */
  clip: Clip | null;
  /** Callback when the dialog is closed without saving */
  onCancel: () => void;
  /** Callback when the clip is saved */
  onSave: (clip: Clip) => void;
  /** Current video time to use as default for new clips */
  currentTime: number;
  /** Mark In time from transport controls */
  markInTime: number | null;
  /** Mark Out time from transport controls */
  markOutTime: number | null;
}

/**
 * ClipDialog component - a modal form for creating and editing clips.
 */
const ClipDialog: React.FC<ClipDialogProps> = ({
  isOpen,
  clip,
  onCancel,
  onSave,
  currentTime,
  markInTime,
  markOutTime,
}) => {
  const [formData, setFormData] = useState<Partial<Clip>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (clip) {
        // Editing existing clip
        setFormData({ ...clip });
      } else {
        // Creating new clip - use mark in/out times if available, otherwise current time
        const inTime = markInTime !== null ? markInTime : currentTime;
        const outTime = markOutTime !== null ? markOutTime : currentTime;
        setFormData({
          id: generateClipId(),
          name: "",
          inSeconds: inTime,
          outSeconds: outTime,
          createdOn: new Date(),
          modifiedOn: new Date(),
        });
      }
      setErrors({});
      // Focus the name input when dialog opens
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [isOpen, clip, currentTime, markInTime, markOutTime]);

  // Handle Escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  const generateClipId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };

  const handleChange = (field: keyof Clip, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.outSeconds !== undefined && formData.inSeconds !== undefined) {
      if (formData.outSeconds <= formData.inSeconds) {
        newErrors.outSeconds = "Out time must be greater than In time";
      }
    }

    if (formData.inSeconds !== undefined && formData.inSeconds < 0) {
      newErrors.inSeconds = "In time cannot be negative";
    }

    if (formData.outSeconds !== undefined && formData.outSeconds < 0) {
      newErrors.outSeconds = "Out time cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const now = new Date();
    const savedClip: Clip = {
      id: formData.id || generateClipId(),
      name: formData.name!,
      inSeconds: formData.inSeconds!,
      outSeconds: formData.outSeconds!,
      clipIndexNumber: formData.clipIndexNumber,
      period: formData.period,
      clockTime: formData.clockTime,
      call: formData.call,
      officialPosition: formData.officialPosition,
      officialName: formData.officialName,
      callType: formData.callType,
      wasShooting: formData.wasShooting,
      wasMultipleWhistles: formData.wasMultipleWhistles,
      wasCorrectDecision: formData.wasCorrectDecision,
      wasCorrectOfficialPosition: formData.wasCorrectOfficialPosition,
      shouldReview: formData.shouldReview,
      description: formData.description,
      tags: formData.tags,
      comments: formData.comments,
      createdOn: formData.createdOn || now,
      modifiedOn: now,
    };

    onSave(savedClip);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(":");
    if (parts.length !== 2) return 0;
    const mins = parseInt(parts[0]) || 0;
    const secParts = parts[1].split(".");
    const secs = parseInt(secParts[0]) || 0;
    const ms = secParts.length > 1 ? parseInt(secParts[1].padEnd(2, "0")) : 0;
    return mins * 60 + secs + ms / 100;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={dialogRef}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "600px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>{clip ? "Edit Clip" : "Add New Clip"}</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div
            style={{
              padding: "20px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {/* Basic Information Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                Basic Information
              </h3>

              {/* Name */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${errors.name ? "#ef4444" : "#d1d5db"}`,
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  placeholder="Enter clip name"
                />
                {errors.name && (
                  <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.name}</div>
                )}
              </div>

              {/* In/Out Times */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    In Time <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inSeconds !== undefined ? formatTime(formData.inSeconds) : ""}
                    onChange={(e) => handleChange("inSeconds", parseTime(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: `1px solid ${errors.inSeconds ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    placeholder="0:00.00"
                  />
                  {errors.inSeconds && (
                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.inSeconds}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Out Time <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.outSeconds !== undefined ? formatTime(formData.outSeconds) : ""}
                    onChange={(e) => handleChange("outSeconds", parseTime(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: `1px solid ${errors.outSeconds ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    placeholder="0:00.00"
                  />
                  {errors.outSeconds && (
                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.outSeconds}</div>
                  )}
                </div>
              </div>

              {/* Period and Clock Time */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Period
                  </label>
                  <input
                    type="text"
                    value={formData.period || ""}
                    onChange={(e) => handleChange("period", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    placeholder="e.g., Q1, 2nd Half"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Clock Time
                  </label>
                  <input
                    type="text"
                    value={formData.clockTime || ""}
                    onChange={(e) => handleChange("clockTime", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    placeholder="e.g., 4:32"
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                  placeholder="Detailed summary of the clip"
                />
              </div>
            </div>

            {/* Call Details Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                Call Details
              </h3>

              {/* Call */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Call
                </label>
                <select
                  value={formData.call?.id || ""}
                  onChange={(e) => {
                    const callId = parseInt(e.target.value);
                    const selectedCall = CALLS.find((c) => c.id === callId);
                    handleChange("call", selectedCall || undefined);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select a call...</option>
                  <optgroup label="Fouls">
                    {CALLS.filter((c) => c.callCategoryId === "Foul").map((call) => (
                      <option key={call.id} value={call.id}>
                        {call.callName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Violations">
                    {CALLS.filter((c) => c.callCategoryId === "Violation").map((call) => (
                      <option key={call.id} value={call.id}>
                        {call.callName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Miscellaneous">
                    {CALLS.filter((c) => c.callCategoryId === "Miscellaneous").map((call) => (
                      <option key={call.id} value={call.id}>
                        {call.callName}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Call Type */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Call Type
                </label>
                <select
                  value={formData.callType || ""}
                  onChange={(e) => handleChange("callType", e.target.value || undefined)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select...</option>
                  <option value="Call">Call</option>
                  <option value="Non-Call">Non-Call</option>
                </select>
              </div>

              {/* Official Name and Position */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Official Name
                  </label>
                  <input
                    type="text"
                    value={formData.officialName || ""}
                    onChange={(e) => handleChange("officialName", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                    placeholder="Official's name"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Official Position
                  </label>
                  <select
                    value={formData.officialPosition || ""}
                    onChange={(e) => handleChange("officialPosition", e.target.value || undefined)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Lead">Lead</option>
                    <option value="Trail">Trail</option>
                    <option value="Center">Center</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Evaluation Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                Evaluation
              </h3>

              {/* Checkboxes */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", marginBottom: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.wasShooting || false}
                    onChange={(e) => handleChange("wasShooting", e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>Shooting situation</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", marginBottom: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.wasMultipleWhistles || false}
                    onChange={(e) => handleChange("wasMultipleWhistles", e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>Multiple whistles</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.shouldReview || false}
                    onChange={(e) => handleChange("shouldReview", e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>Should review with crew</span>
                </label>
              </div>

              {/* Correct Decision */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Correct Decision?
                </label>
                <select
                  value={formData.wasCorrectDecision || ""}
                  onChange={(e) => handleChange("wasCorrectDecision", e.target.value || undefined)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              {/* Correct Position */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Correct Official Position?
                </label>
                <select
                  value={formData.wasCorrectOfficialPosition || ""}
                  onChange={(e) => handleChange("wasCorrectOfficialPosition", e.target.value || undefined)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>
            </div>

            {/* Additional Information Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                Additional Information
              </h3>

              {/* Tags */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags || ""}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  placeholder="Comma-separated tags"
                />
              </div>

              {/* Comments */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Comments
                </label>
                <textarea
                  value={formData.comments || ""}
                  onChange={(e) => handleChange("comments", e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                  placeholder="Additional comments or notes"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {clip ? "Update Clip" : "Add Clip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClipDialog;
