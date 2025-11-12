import React, { useState, useEffect } from "react";
import { useProjectStore } from "../state/projectStore";
import { Gender, AgeLevel, Sport, Official } from "../types/event";

/**
 * EventDetails component provides a form interface for viewing and editing
 * event metadata including date, teams, officials, and other relevant information.
 */
const EventDetails: React.FC = () => {
  const projectStore = useProjectStore();

  // Local state for form fields
  const [date, setDate] = useState<string>("");
  const [gender, setGender] = useState<Gender>(Gender.Boys);
  const [ageLevel, setAgeLevel] = useState<AgeLevel>(AgeLevel.Varsity);
  const [sport, setSport] = useState<Sport>(Sport.Basketball);
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [officiatingCrew, setOfficiatingCrew] = useState<Official[]>([{ name: "", position: "" }]);
  const [videoLink, setVideoLink] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load event data from store when it changes
  useEffect(() => {
    const event = projectStore.event;
    if (event) {
      setDate(event.date instanceof Date ? event.date.toISOString().split("T")[0] : "");
      setGender(event.gender);
      setAgeLevel(event.ageLevel);
      setSport(event.sport);
      setEventName(event.eventName || "");
      setLocation(event.location || "");
      setHomeTeam(event.homeTeam || "");
      setAwayTeam(event.awayTeam || "");
      setOfficiatingCrew(event.officiatingCrew.length > 0 ? event.officiatingCrew : [{ name: "", position: "" }]);
      setVideoLink(event.videoLink || "");
      setNotes(event.notes || "");
    }
  }, [projectStore.event]);

  /**
   * Validate the form data before saving.
   * Returns an array of error messages, or empty array if valid.
   */
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Required: Date
    if (!date) {
      errors.push("Date is required");
    }

    // Required: At least one official with a name
    const validOfficials = officiatingCrew.filter((o) => o.name.trim() !== "");
    if (validOfficials.length === 0) {
      errors.push("At least one official with a name is required");
    }

    // Optional: If both teams provided, they should be different
    if (homeTeam.trim() && awayTeam.trim() && homeTeam.trim() === awayTeam.trim()) {
      errors.push("Home team and away team must be different");
    }

    // Optional: Video link must be valid URL if provided
    if (videoLink.trim()) {
      try {
        new URL(videoLink);
      } catch {
        errors.push("Video link must be a valid URL");
      }
    }

    return errors;
  };

  /**
   * Handle adding a new official to the crew.
   */
  const handleAddOfficial = () => {
    setOfficiatingCrew([...officiatingCrew, { name: "", position: "" }]);
  };

  /**
   * Handle removing an official from the crew.
   */
  const handleRemoveOfficial = (index: number) => {
    if (officiatingCrew.length > 1) {
      setOfficiatingCrew(officiatingCrew.filter((_, i) => i !== index));
    }
  };

  /**
   * Handle updating an official's information.
   */
  const handleUpdateOfficial = (index: number, field: keyof Official, value: string) => {
    const updated = [...officiatingCrew];
    updated[index] = { ...updated[index], [field]: value };
    setOfficiatingCrew(updated);
  };

  /**
   * Handle saving the event data to the store.
   */
  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    // Filter out empty officials
    const validOfficials = officiatingCrew.filter((o) => o.name.trim() !== "");

    // Create event object
    const eventData = {
      date: new Date(date),
      gender,
      ageLevel,
      sport,
      eventName: eventName.trim() || undefined,
      location: location.trim() || undefined,
      homeTeam: homeTeam.trim() || undefined,
      awayTeam: awayTeam.trim() || undefined,
      officiatingCrew: validOfficials,
      videoLink: videoLink.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    projectStore.updateEvent(eventData);
  };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Event Details</h2>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#991b1b" }}>
            Please fix the following errors:
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#991b1b" }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Date (Required) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Date <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Gender (Required) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Gender <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            <option value={Gender.Boys}>Boys</option>
            <option value={Gender.Girls}>Girls</option>
            <option value={Gender.Coed}>Coed</option>
          </select>
        </div>

        {/* Age Level (Required) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Age Level <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            value={ageLevel}
            onChange={(e) => setAgeLevel(e.target.value as AgeLevel)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            <option value={AgeLevel.JV}>JV</option>
            <option value={AgeLevel.Varsity}>Varsity</option>
            <option value={AgeLevel.NCAADiv3}>NCAA Div 3</option>
          </select>
        </div>

        {/* Sport (Required) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Sport <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            <option value={Sport.Basketball}>Basketball</option>
            <option value={Sport.Football}>Football</option>
            <option value={Sport.Volleyball}>Volleyball</option>
          </select>
        </div>

        {/* Event Name (Optional) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Regional Championship"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Location (Optional) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Central High School Gymnasium"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Home Team (Optional) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Home Team</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="e.g., Central Eagles"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Away Team (Optional) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Away Team</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder="e.g., North Wildcats"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* Officiating Crew (Required - at least one) */}
      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Officiating Crew <span style={{ color: "#dc2626" }}>*</span>
        </label>
        {officiatingCrew.map((official, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={official.name}
              onChange={(e) => handleUpdateOfficial(index, "name", e.target.value)}
              placeholder="Official Name"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              value={official.position || ""}
              onChange={(e) => handleUpdateOfficial(index, "position", e.target.value)}
              placeholder="Position (optional)"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={() => handleRemoveOfficial(index)}
              disabled={officiatingCrew.length === 1}
              style={{
                padding: "8px 12px",
                backgroundColor: officiatingCrew.length === 1 ? "#e5e7eb" : "#ef4444",
                color: officiatingCrew.length === 1 ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: officiatingCrew.length === 1 ? "not-allowed" : "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddOfficial}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Official
        </button>
      </div>

      {/* Video Link (Optional) */}
      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Video Link</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="e.g., https://example.com/video/game123"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Notes (Optional) */}
      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes or comments about the event..."
          rows={3}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      {/* Timestamps Display (Read-only) */}
      {projectStore.event && (
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#6b7280" }}>
          <div>Created: {projectStore.event.createdOn.toLocaleString()}</div>
          <div>Modified: {projectStore.event.modifiedOn.toLocaleString()}</div>
        </div>
      )}

      {/* Save Button */}
      <div style={{ marginTop: "16px" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Save Event Details
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
