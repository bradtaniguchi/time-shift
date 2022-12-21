/* eslint-disable @typescript-eslint/naming-convention */

/**
 * List of tracker locations.
 */
export const TRACKER_LOCATIONS = ['memory', 'global', 'workspace'] as const;

/**
 * The tracker locations data can be saved.
 *
 * - memory - in memory is essentially "session" level tracking
 * - global - global level tracking, saved at the user level
 * - workspace - saved at the workspace level
 */
export type TrackerLocation = typeof TRACKER_LOCATIONS[number];

/**
 * Type-guard to check if a value is a TrackerLocation.
 *
 * @param value the value to check
 */
export const isTrackerLocation = (value: unknown): value is TrackerLocation =>
  TRACKER_LOCATIONS.includes(value as TrackerLocation);
