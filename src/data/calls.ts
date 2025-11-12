/**
 * Predefined list of basketball officiating calls.
 * This data represents the standard calls that can be made during a basketball game.
 */

import { Call, CallCategory } from "../types/call";

/**
 * Complete list of available calls for basketball officiating.
 * IDs match the original Access database structure.
 */
export const CALLS: Call[] = [
  // Fouls (IDs 1-10)
  { id: 1, callName: "Block", callCategoryId: CallCategory.Foul },
  { id: 2, callName: "Charge/Player Control", callCategoryId: CallCategory.Foul },
  { id: 3, callName: "Double Foul", callCategoryId: CallCategory.Foul },
  { id: 4, callName: "Hand Check", callCategoryId: CallCategory.Foul },
  { id: 5, callName: "Hit", callCategoryId: CallCategory.Foul },
  { id: 6, callName: "Hold", callCategoryId: CallCategory.Foul },
  { id: 7, callName: "Illegal Screen", callCategoryId: CallCategory.Foul },
  { id: 8, callName: "Intentional Foul", callCategoryId: CallCategory.Foul },
  { id: 9, callName: "Push", callCategoryId: CallCategory.Foul },
  { id: 10, callName: "Technical Foul", callCategoryId: CallCategory.Foul },

  // Miscellaneous (IDs 11-12)
  { id: 11, callName: "Held Ball", callCategoryId: CallCategory.Miscellaneous },
  { id: 12, callName: "Note", callCategoryId: CallCategory.Miscellaneous },

  // Violations (IDs 13-28)
  { id: 13, callName: "Backcourt", callCategoryId: CallCategory.Violation },
  { id: 14, callName: "Basket Interference", callCategoryId: CallCategory.Violation },
  { id: 15, callName: "Double Dribble", callCategoryId: CallCategory.Violation },
  { id: 16, callName: "Elbows", callCategoryId: CallCategory.Violation },
  { id: 17, callName: "Five Seconds", callCategoryId: CallCategory.Violation },
  { id: 18, callName: "Free Throw Violation", callCategoryId: CallCategory.Violation },
  { id: 19, callName: "Goaltending", callCategoryId: CallCategory.Violation },
  { id: 20, callName: "Jump Ball Violation", callCategoryId: CallCategory.Violation },
  { id: 21, callName: "Kicking", callCategoryId: CallCategory.Violation },
  { id: 22, callName: "Out of Bounds", callCategoryId: CallCategory.Violation },
  { id: 23, callName: "Palming", callCategoryId: CallCategory.Violation },
  { id: 24, callName: "Ten Seconds", callCategoryId: CallCategory.Violation },
  { id: 25, callName: "Three Seconds", callCategoryId: CallCategory.Violation },
  { id: 26, callName: "Throw-in Violation", callCategoryId: CallCategory.Violation },
  { id: 27, callName: "Travel", callCategoryId: CallCategory.Violation },
  { id: 28, callName: "Shot Clock Violation", callCategoryId: CallCategory.Violation },
];

/**
 * Get a call by its ID.
 * @param id - The ID of the call to retrieve.
 * @returns The call object if found, undefined otherwise.
 */
export function getCallById(id: number): Call | undefined {
  return CALLS.find((call) => call.id === id);
}

/**
 * Get all calls in a specific category.
 * @param category - The category to filter by.
 * @returns Array of calls in the specified category.
 */
export function getCallsByCategory(category: CallCategory): Call[] {
  return CALLS.filter((call) => call.callCategoryId === category);
}
