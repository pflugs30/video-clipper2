/**
 * Type definitions for video clip segments.
 * Represents portions of video footage marked for review, export, or analysis.
 */

import { Call, isValidCall } from "./call";

/**
 * Represents a video clip segment with defined start and end times.
 * Each clip represents a specific portion of the source video that has been marked
 * for review, export, or further analysis.
 */
export interface Clip {
  /**
   * Unique identifier for the clip.
   * Should be unique within the project/event.
   * @example "clip_abc123"
   * @example "lqz8k9p5a2b"
   */
  id: string;

  /**
   * Descriptive name for the clip.
   * Should be meaningful and help identify the content or purpose of the clip.
   * Must not be an empty string.
   * @example "Questionable Travel Call - Q3 4:32"
   * @example "Three-point shot attempt"
   * @example "Opening Tip-off"
   */
  name: string;

  /**
   * Start time of the clip in seconds from the beginning of the video.
   * Must be non-negative and less than outSeconds.
   * @example 125.8
   * @example 0
   */
  inSeconds: number;

  /**
   * End time of the clip in seconds from the beginning of the video.
   * Must be greater than inSeconds and non-negative.
   * @example 132.4
   * @example 5.3
   */
  outSeconds: number;

  /**
   * A clip's index number within an Event.
   * Helps with sorting and organizing clips chronologically within an event.
   * @example 1
   * @example 23
   */
  clipIndexNumber?: number;

  /**
   * The event period during which the clip takes place.
   * For basketball: "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter", "OT"
   * For football: "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"
   * @example "3rd Quarter"
   * @example "2nd Half"
   */
  period?: string;

  /**
   * The time on the game clock when the clip takes place.
   * Typically formatted as MM:SS or M:SS.
   * @example "4:32"
   * @example "12:00"
   * @example "0:45"
   */
  clockTime?: string;

  /**
   * The official's call or decision.
   * Contains the call information including name and category.
   * @see {@link Call}
   * @example { id: 1, callName: "Traveling", callCategoryId: CallCategory.Violation }
   */
  call?: Call;

  /**
   * The position where the official was when the call was made (or should have been made).
   * Helps analyze official positioning and mechanics.
   * @example "Lead"
   * @example "Trail"
   * @example "Center"
   */
  officialPosition?: string;

  /**
   * The name of the official who made (or should have made) the call.
   * @example "John Smith"
   * @example "Referee #42"
   */
  officialName?: string;

  /**
   * Indicates whether this was a call or a non-call situation.
   * @example "Call"
   * @example "Non-Call"
   * @example "Missed Call"
   */
  callType?: string;

  /**
   * Indicates whether this was a shooting situation.
   * Relevant for determining free throw implications.
   * @example true
   * @example false
   */
  wasShooting?: boolean;

  /**
   * Indicates whether multiple officials sounded their whistle.
   * Important for analyzing crew communication and coordination.
   * @example true
   * @example false
   */
  wasMultipleWhistles?: boolean;

  /**
   * Indicates whether the official(s) made the correct decision.
   * Used for performance evaluation and training.
   * @example "Yes"
   * @example "No"
   * @example "Debatable"
   */
  wasCorrectDecision?: string;

  /**
   * Indicates whether the official who made the call was in the correct or best position.
   * Used for mechanics and positioning evaluation.
   * @example "Yes"
   * @example "No"
   * @example "Acceptable"
   */
  wasCorrectOfficialPosition?: string;

  /**
   * Indicates whether the officiating crew should review this call.
   * Flags clips that warrant discussion or further analysis.
   * @example true
   * @example false
   */
  shouldReview?: boolean;

  /**
   * A detailed summary of the clip.
   * Provides context, analysis, or additional information about the play.
   * @example "Player drove to basket, defender established position, contact occurred"
   */
  description?: string;

  /**
   * A series of tags annotating the clip.
   * Space-separated or comma-separated tags for categorization and searching.
   * @example "block-charge, end-of-game, controversial"
   * @example "three-point defensive-foul"
   */
  tags?: string;

  /**
   * User-provided comments about the clip.
   * Additional notes, observations, or feedback.
   * @example "Need to discuss positioning with crew at halftime"
   */
  comments?: string;

  /**
   * Timestamp when the clip was created.
   * Automatically set when the clip is first created.
   * @example new Date("2025-11-11T10:30:00Z")
   */
  createdOn: Date;

  /**
   * Timestamp when the clip was last modified.
   * Should be updated whenever any field is changed.
   * Must be greater than or equal to createdOn.
   * @example new Date("2025-11-11T14:45:00Z")
   */
  modifiedOn: Date;
}

/**
 * Type guard to check if an unknown object is a valid Clip.
 * Performs comprehensive validation of all required fields and their constraints.
 * @param {unknown} obj - The object to validate.
 * @returns {boolean} True if the object is a valid Clip, false otherwise.
 * @example
 * const data = JSON.parse(jsonString);
 * if (isValidClip(data)) {
 *   // Safe to use as Clip
 *   console.log(data.name);
 * }
 */
export function isValidClip(obj: unknown): obj is Clip {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const clip = obj as Record<string, unknown>;

  // Validate id is a non-empty string
  if (typeof clip.id !== "string" || clip.id.trim() === "") {
    return false;
  }

  // Validate name is a non-empty string
  if (typeof clip.name !== "string" || clip.name.trim() === "") {
    return false;
  }

  // Validate inSeconds is a number and non-negative
  if (typeof clip.inSeconds !== "number" || clip.inSeconds < 0) {
    return false;
  }

  // Validate outSeconds is a number and non-negative
  if (typeof clip.outSeconds !== "number" || clip.outSeconds < 0) {
    return false;
  }

  // Validate time range: inSeconds must be less than outSeconds
  if (clip.inSeconds >= clip.outSeconds) {
    return false;
  }

  // Validate optional fields if present
  if (clip.clipIndexNumber !== undefined && typeof clip.clipIndexNumber !== "number") {
    return false;
  }

  if (clip.period !== undefined && (typeof clip.period !== "string" || clip.period.trim() === "")) {
    return false;
  }

  if (clip.clockTime !== undefined && (typeof clip.clockTime !== "string" || clip.clockTime.trim() === "")) {
    return false;
  }

  if (clip.call !== undefined && !isValidCall(clip.call)) {
    return false;
  }

  if (
    clip.officialPosition !== undefined &&
    (typeof clip.officialPosition !== "string" || clip.officialPosition.trim() === "")
  ) {
    return false;
  }

  if (clip.officialName !== undefined && (typeof clip.officialName !== "string" || clip.officialName.trim() === "")) {
    return false;
  }

  if (clip.callType !== undefined && (typeof clip.callType !== "string" || clip.callType.trim() === "")) {
    return false;
  }

  if (clip.wasShooting !== undefined && typeof clip.wasShooting !== "boolean") {
    return false;
  }

  if (clip.wasMultipleWhistles !== undefined && typeof clip.wasMultipleWhistles !== "boolean") {
    return false;
  }

  if (
    clip.wasCorrectDecision !== undefined &&
    (typeof clip.wasCorrectDecision !== "string" || clip.wasCorrectDecision.trim() === "")
  ) {
    return false;
  }

  if (
    clip.wasCorrectOfficialPosition !== undefined &&
    (typeof clip.wasCorrectOfficialPosition !== "string" || clip.wasCorrectOfficialPosition.trim() === "")
  ) {
    return false;
  }

  if (clip.shouldReview !== undefined && typeof clip.shouldReview !== "boolean") {
    return false;
  }

  if (clip.description !== undefined && typeof clip.description !== "string") {
    return false;
  }

  if (clip.tags !== undefined && typeof clip.tags !== "string") {
    return false;
  }

  if (clip.comments !== undefined && typeof clip.comments !== "string") {
    return false;
  }

  // Validate required timestamps
  if (
    !(clip.createdOn instanceof Date) ||
    isNaN(clip.createdOn.getTime()) ||
    !(clip.modifiedOn instanceof Date) ||
    isNaN(clip.modifiedOn.getTime())
  ) {
    return false;
  }

  // Validate modifiedOn >= createdOn
  if (clip.modifiedOn < clip.createdOn) {
    return false;
  }

  return true;
}

/**
 * Calculate the duration of a clip in seconds.
 * @param {Clip} clip - The clip to calculate duration for.
 * @returns {number} The duration in seconds.
 * @example
 * const clip = { id: "1", name: "Test", inSeconds: 10.5, outSeconds: 15.8 };
 * const duration = getClipDuration(clip); // Returns 5.3
 */
export function getClipDuration(clip: Clip): number {
  return clip.outSeconds - clip.inSeconds;
}

/**
 * Format clip time range as a readable string.
 * @param {Clip} clip - The clip to format.
 * @param {number} [precision=1] - Number of decimal places for seconds (default 1).
 * @returns {string} Formatted time range string.
 * @example
 * const clip = { id: "1", name: "Test", inSeconds: 65.5, outSeconds: 72.3 };
 * formatClipTimeRange(clip); // Returns "65.5s - 72.3s"
 */
export function formatClipTimeRange(clip: Clip, precision: number = 1): string {
  return `${clip.inSeconds.toFixed(precision)}s - ${clip.outSeconds.toFixed(precision)}s`;
}

/**
 * Create a default Clip object with placeholder values.
 * Useful for initializing new clip records before user input.
 * Note: The ID should be replaced with a proper unique identifier.
 * @returns {Clip} A new Clip object with default values.
 * @example
 * const newClip = createDefaultClip();
 * newClip.id = generateUniqueId();
 * newClip.name = "User-defined name";
 */
export function createDefaultClip(): Clip {
  const now = new Date();
  return {
    id: "",
    name: "",
    inSeconds: 0,
    outSeconds: 0,
    createdOn: now,
    modifiedOn: now,
  };
}

/**
 * Check if two clips overlap in time.
 * @param {Clip} clip1 - The first clip.
 * @param {Clip} clip2 - The second clip.
 * @returns {boolean} True if the clips overlap, false otherwise.
 * @example
 * const clip1 = { id: "1", name: "A", inSeconds: 10, outSeconds: 20 };
 * const clip2 = { id: "2", name: "B", inSeconds: 15, outSeconds: 25 };
 * clipsOverlap(clip1, clip2); // Returns true
 */
export function clipsOverlap(clip1: Clip, clip2: Clip): boolean {
  return clip1.inSeconds < clip2.outSeconds && clip2.inSeconds < clip1.outSeconds;
}

/**
 * Sort an array of clips by their start time (inSeconds).
 * @param {Clip[]} clips - Array of clips to sort.
 * @returns {Clip[]} A new sorted array of clips.
 * @example
 * const clips = [
 *   { id: "1", name: "B", inSeconds: 50, outSeconds: 60 },
 *   { id: "2", name: "A", inSeconds: 10, outSeconds: 20 }
 * ];
 * const sorted = sortClipsByTime(clips);
 * // sorted[0].name === "A"
 */
export function sortClipsByTime(clips: Clip[]): Clip[] {
  return [...clips].sort((a, b) => a.inSeconds - b.inSeconds);
}
