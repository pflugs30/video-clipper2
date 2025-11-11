/**
 * Type definitions for officiating calls and decisions.
 * Represents calls, violations, and other decisions made during sporting events.
 */

/**
 * Category classification for calls made during an event.
 */
export enum CallCategory {
  /** Foul calls (personal fouls, technical fouls, etc.) */
  Foul = "Foul",
  /** Violation calls (traveling, double dribble, etc.) */
  Violation = "Violation",
  /** Miscellaneous calls and decisions */
  Miscellaneous = "Miscellaneous",
}

/**
 * Represents an official's call or decision during an event.
 */
export interface Call {
  /**
   * Unique identifier for the call.
   * AutoNumber from Access database.
   * @example 1
   * @example 42
   */
  id: number;

  /**
   * The name of the call.
   * @example "Traveling"
   * @example "Blocking Foul"
   * @example "Lane Violation"
   */
  callName: string;

  /**
   * Links this call to a call category.
   * @see {@link CallCategory}
   * @example CallCategory.Foul
   * @example CallCategory.Violation
   */
  callCategoryId: CallCategory;
}

/**
 * Type guard to check if an unknown object is a valid Call.
 * @param {unknown} obj - The object to validate.
 * @returns {boolean} True if the object is a valid Call, false otherwise.
 */
export function isValidCall(obj: unknown): obj is Call {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const call = obj as Record<string, unknown>;

  // Validate id is a number
  if (typeof call.id !== "number") {
    return false;
  }

  // Validate callName is a non-empty string
  if (typeof call.callName !== "string" || call.callName.trim() === "") {
    return false;
  }

  // Validate callCategoryId is a valid CallCategory enum value
  if (!Object.values(CallCategory).includes(call.callCategoryId as CallCategory)) {
    return false;
  }

  return true;
}
