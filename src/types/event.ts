/**
 * Type definitions for Event data model.
 * Represents real-world sporting events (games, matches, contests) with associated metadata.
 */

/**
 * Gender classification for event participants.
 */
export enum Gender {
  /** Male participants */
  Boys = "boys",
  /** Female participants */
  Girls = "girls",
  /** Mixed/coeducational participants */
  Coed = "coed",
}

/**
 * Age or competition level classification for events.
 */
export enum AgeLevel {
  /** Junior Varsity level */
  JV = "JV",
  /** Varsity level */
  Varsity = "Varsity",
  /** NCAA Division 3 level */
  NCAADiv3 = "NCAA Div 3",
  // Additional levels can be added as needed
}

/**
 * Sport type classification.
 */
export enum Sport {
  /** Basketball (default sport) */
  Basketball = "basketball",
  /** Football */
  Football = "football",
  /** Volleyball */
  Volleyball = "volleyball",
  // Additional sports can be added as needed
}

/**
 * Represents an official (referee, umpire, etc.) working an event.
 */
export interface Official {
  /**
   * Full name of the official.
   * @example "John Smith"
   */
  name: string;

  /**
   * Position or role of the official (e.g., "Referee", "Umpire", "R1", "R2").
   * This field is optional and can be used to specify the official's specific role.
   * @example "Referee"
   * @example "Umpire 1"
   */
  position?: string;
}

/**
 * Represents a sporting event with all associated metadata.
 * Each project in the video clipper application corresponds to an Event.
 */
export interface Event {
  /**
   * The date when the event occurred.
   * @example new Date("2025-11-15")
   */
  date: Date;

  /**
   * Gender classification of the event participants.
   * @see {@link Gender}
   */
  gender: Gender;

  /**
   * Age or competition level classification of the event.
   * @see {@link AgeLevel}
   */
  ageLevel: AgeLevel;

  /**
   * Type of sport being played.
   * Defaults to basketball if not specified.
   * @see {@link Sport}
   * @example Sport.Basketball
   */
  sport: Sport;

  /**
   * Descriptive name for the event.
   * Should be meaningful and help identify the specific event.
   * Optional field that can be populated as event details become available.
   * @example "Regional Championship"
   * @example "State Semifinals - Game 2"
   */
  eventName?: string;

  /**
   * Physical location or venue of the event.
   * Optional field that can be populated as event details become available.
   * @example "Central High School Gymnasium"
   * @example "Memorial Stadium"
   */
  location?: string;

  /**
   * Name of the home team.
   * Optional field that can be populated as event details become available.
   * @example "Central Eagles"
   */
  homeTeam?: string;

  /**
   * Name of the away team.
   * Should be different from homeTeam when both are provided.
   * Optional field that can be populated as event details become available.
   * @example "North Wildcats"
   */
  awayTeam?: string;

  /**
   * Array of officials working the event.
   * Should contain at least one official.
   * @see {@link Official}
   * @example [{ name: "John Smith", position: "Referee" }]
   */
  officiatingCrew: Official[];

  /**
   * URL or hyperlink to the video recording of the event.
   * Optional field that can be populated when video is available.
   * Must be a valid URL format when provided.
   * @example "https://example.com/video/game123"
   * @example "file:///C:/Videos/game.mp4"
   */
  videoLink?: string;

  /**
   * Additional notes or comments about the event.
   * Optional field for any relevant information about the event.
   * @example "Overtime game with controversial call in final minute"
   */
  notes?: string;

  /**
   * Timestamp when the event record was created.
   * Automatically set when the event is first created.
   */
  createdOn: Date;

  /**
   * Timestamp of the last modification to the event record.
   * Should be updated whenever any field is changed.
   * Must be greater than or equal to createdOn.
   */
  modifiedOn: Date;
}

/**
 * Type guard to check if an unknown object is a valid Official.
 * @param {unknown} obj - The object to validate.
 * @returns {boolean} True if the object is a valid Official, false otherwise.
 */
export function isValidOfficial(obj: unknown): obj is Official {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const official = obj as Record<string, unknown>;

  // name is required and must be a string
  if (typeof official.name !== "string" || official.name.trim() === "") {
    return false;
  }

  // position is optional but must be a string if present
  if (official.position !== undefined && typeof official.position !== "string") {
    return false;
  }

  return true;
}

/**
 * Type guard to check if an unknown object is a valid Event.
 * Performs comprehensive validation of all required fields and their types.
 * @param {unknown} obj - The object to validate.
 * @returns {boolean} True if the object is a valid Event, false otherwise.
 */
export function isValidEvent(obj: unknown): obj is Event {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const event = obj as Record<string, unknown>;

  // Validate date
  if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
    return false;
  }

  // Validate gender enum
  if (!Object.values(Gender).includes(event.gender as Gender)) {
    return false;
  }

  // Validate ageLevel enum
  if (!Object.values(AgeLevel).includes(event.ageLevel as AgeLevel)) {
    return false;
  }

  // Validate sport enum
  if (!Object.values(Sport).includes(event.sport as Sport)) {
    return false;
  }

  // Validate optional string fields (must be strings if present)
  if (
    (event.eventName !== undefined && (typeof event.eventName !== "string" || event.eventName.trim() === "")) ||
    (event.location !== undefined && (typeof event.location !== "string" || event.location.trim() === "")) ||
    (event.homeTeam !== undefined && (typeof event.homeTeam !== "string" || event.homeTeam.trim() === "")) ||
    (event.awayTeam !== undefined && (typeof event.awayTeam !== "string" || event.awayTeam.trim() === "")) ||
    (event.videoLink !== undefined && (typeof event.videoLink !== "string" || event.videoLink.trim() === ""))
  ) {
    return false;
  }

  // Validate teams are different (only if both are provided)
  if (event.homeTeam && event.awayTeam && event.homeTeam === event.awayTeam) {
    return false;
  }

  // Validate officiatingCrew is an array with at least one valid official
  if (
    !Array.isArray(event.officiatingCrew) ||
    event.officiatingCrew.length === 0 ||
    !event.officiatingCrew.every(isValidOfficial)
  ) {
    return false;
  }

  // Validate notes is optional string
  if (event.notes !== undefined && typeof event.notes !== "string") {
    return false;
  }

  // Validate timestamps
  if (
    !(event.createdOn instanceof Date) ||
    isNaN(event.createdOn.getTime()) ||
    !(event.modifiedOn instanceof Date) ||
    isNaN(event.modifiedOn.getTime())
  ) {
    return false;
  }

  // Validate modifiedOn >= createdOn
  if (event.modifiedOn < event.createdOn) {
    return false;
  }

  return true;
}

/**
 * Creates a default Event object with minimal required fields.
 * Useful for initializing new event records.
 * @returns {Event} A new Event object with default values.
 * @example
 * const newEvent = createDefaultEvent();
 * newEvent.eventName = "Championship Game";
 * newEvent.homeTeam = "Eagles";
 */
export function createDefaultEvent(): Event {
  const now = new Date();
  return {
    date: now,
    gender: Gender.Boys,
    ageLevel: AgeLevel.Varsity,
    sport: Sport.Basketball,
    eventName: "",
    location: "",
    homeTeam: "",
    awayTeam: "",
    officiatingCrew: [],
    videoLink: "",
    notes: "",
    createdOn: now,
    modifiedOn: now,
  };
}
