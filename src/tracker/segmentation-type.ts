/**
 * The types of segmentation that are available.
 */
export const SEGMENTATION_TYPES = ['hour', 'day', 'week', 'month', 'year'];

/**
 * The type of segmentation we are using for a tracker that uses segmentation
 */
export type SegmentationType = typeof SEGMENTATION_TYPES[number];

/**
 * Type-guard for the SegmentationType type.
 */
export const isSegmentationType = (value: unknown): value is SegmentationType =>
  SEGMENTATION_TYPES.includes(value as SegmentationType);
