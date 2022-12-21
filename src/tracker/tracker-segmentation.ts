/**
 * List of tracker data types.
 */
export const TRACKER_SEGMENTATION = ['seconds', 'chunked'] as const;

/**
 * The type of segmentation we are tracking/saving for the tracker.
 * - seconds - the base type, and just keeps track of how much time
 *   is spent in the file(s) that match the glob. This is the easiest to use and
 *  track
 * - chunked - keeps track of how much time is spent in files that match the glob
 *   by the specified chunk time. This essentially "wraps" the "seconds" option, but splits up
 *   results by a given time-frame.
 */
export type TrackerSegmentation = typeof TRACKER_SEGMENTATION[number];

/**
 * Type-guard for the TrackerSegmentation type.
 */
export const isTrackerSegmentation = (
  value: string
): value is TrackerSegmentation =>
  TRACKER_SEGMENTATION.includes(value as TrackerSegmentation);
