/**
 * Formats a time in seconds to hh:mm:ss.00 format (centiseconds).
 * @param seconds - The time in seconds (can be null)
 * @param placeholder - The string to return when seconds is null
 * @returns Formatted time string
 *
 * @example
 * formatTimestamp(6.9) // "00:00:06.90"
 * formatTimestamp(37.51) // "00:00:37.51"
 * formatTimestamp(6108.35) // "01:41:48.35"
 * formatTimestamp(null, "--:--:--") // "--:--:--"
 */
export function formatTimestamp(seconds: number | null, placeholder: string = "--:--:--"): string {
  if (seconds === null) return placeholder;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Format with leading zeros: hh:mm:ss.cs (cs = centiseconds, 2 decimal places)
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = Math.floor(secs).toString().padStart(2, "0");
  const cs = (secs % 1).toFixed(2).substring(2); // Get 2 decimal places as centiseconds

  return `${hh}:${mm}:${ss}.${cs}`;
}
