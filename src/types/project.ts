/**
 * Type definitions for project file format.
 * Used for saving and loading video clipper projects.
 */

import { Clip } from "../state/projectStore";
import { Event } from "./event";

/**
 * Current version of the project file format.
 * Increment this when making breaking changes to the structure.
 */
export const PROJECT_FILE_VERSION = "2.0.0";

/**
 * Metadata about the source video file.
 */
export interface VideoSource {
  /** Absolute path to the video file */
  path: string;
  /** Duration of the video in seconds (optional, for validation) */
  duration?: number;
}

/**
 * Complete project data structure for save/load operations.
 * Each project represents a real-world sporting event with associated clips.
 */
export interface ProjectData {
  /** Version of the project file format */
  version: string;
  /** Application version that created this file */
  appVersion: string;
  /** ISO timestamp when the project was created */
  created: string;
  /** ISO timestamp when the project was last modified */
  modified: string;
  /** Information about the source video */
  videoSource: VideoSource;
  /**
   * Event metadata for this project.
   * Contains all relevant information about the sporting event.
   * @see {@link Event}
   */
  event?: Event;
  /** Array of clips defined in this project */
  clips: Clip[];
}

/**
 * Validate that an unknown object matches the ProjectData structure.
 * Returns true if valid, false otherwise.
 *
 * TODO: Add more comprehensive validation (e.g., check clip time ranges)
 * TODO: Consider using a schema validation library like Zod
 */
export function isValidProjectData(data: unknown): data is ProjectData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check required top-level fields
  if (
    typeof obj.version !== "string" ||
    typeof obj.appVersion !== "string" ||
    typeof obj.created !== "string" ||
    typeof obj.modified !== "string"
  ) {
    return false;
  }

  // Check videoSource
  if (
    typeof obj.videoSource !== "object" ||
    obj.videoSource === null ||
    typeof (obj.videoSource as Record<string, unknown>).path !== "string"
  ) {
    return false;
  }

  // Check clips array
  if (!Array.isArray(obj.clips)) {
    return false;
  }

  // Validate each clip has required fields
  for (const clip of obj.clips) {
    if (
      typeof clip !== "object" ||
      clip === null ||
      typeof (clip as Record<string, unknown>).id !== "string" ||
      typeof (clip as Record<string, unknown>).name !== "string" ||
      typeof (clip as Record<string, unknown>).inSeconds !== "number" ||
      typeof (clip as Record<string, unknown>).outSeconds !== "number"
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a project file version is supported by this application.
 *
 * TODO: Implement version migration logic for older file formats
 */
export function isSupportedVersion(version: string): boolean {
  // For now, only support exact match
  // In the future, you might support multiple versions with migration
  return version === PROJECT_FILE_VERSION;
}
