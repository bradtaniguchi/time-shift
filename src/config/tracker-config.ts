import {
  isSegmentationType,
  SegmentationType,
} from '../tracker/segmentation-type';
import { TrackerLocation } from '../tracker/tracker-location';
import { TrackerSegmentation } from '../tracker/tracker-segmentation';

/**
 * Interface representing the data for a single tracker configuration data.
 *
 * This should be the actual data within the configuration for
 * the extension's config.
 */
export interface TrackerConfig {
  /**
   * The id of the tracker, used for identification, logging
   * and debugging.
   *
   * This can't be changed per tracker instance, a new one
   * must be created via configuration changes.
   */
  id: string;

  /**
   * The location that this tracker will save data to.
   *
   * This can't be changed per tracker instance, a new one
   * must be created via configuration changes.
   */
  location: TrackerLocation;

  /**
   * String representing the glob of files that this tracker
   * will keep tracking of changes for. Anything that falls under
   * this glob will be "tracked" according to the tracking logic.
   */
  glob: string;

  /**
   * The segmentation method we will use for this tracker.
   */
  seg: TrackerSegmentation;
}

/**
 * Returns invalid tracker configuration data.
 *
 * Useful for debugging and logging.
 */
export const getInvalidTrackerConfig = (
  config: TrackerConfig
): Array<[keyof TrackerConfig, unknown]> => {
  const invalidTrackerConfigData: Array<[keyof TrackerConfig, unknown]> = [];
  if (typeof config.id !== 'string') {
    invalidTrackerConfigData.push(['id', config.id]);
  }
  if (typeof config.location !== 'string') {
    invalidTrackerConfigData.push(['location', config.location]);
  }
  if (typeof config.glob !== 'string') {
    invalidTrackerConfigData.push(['glob', config.glob]);
  }
  if (typeof config.seg !== 'string') {
    invalidTrackerConfigData.push(['seg', config.seg]);
  }

  return invalidTrackerConfigData;
};

/**
 * Type-guard for the TrackerConfig type.
 */
export const isTrackerConfig = (value: unknown): value is TrackerConfig =>
  typeof value === 'object' &&
  getInvalidTrackerConfig(value as TrackerConfig).length === 0;

export interface SegmentationTrackerConfig extends TrackerConfig {
  seg: 'chunked';
  /**
   * The type of segmentation that the tracker will use. Changing
   * this will change the rate in which segmentation entries are created.
   *
   * Defaults to "day"
   */
  segType?: SegmentationType;
}

/**
 * Type-guard for the SegmentationTrackerConfig type.
 */
export const isSegmentationTrackerConfig = (
  value: unknown
): value is SegmentationTrackerConfig =>
  isTrackerConfig(value) &&
  value.seg === 'chunked' &&
  (value as SegmentationTrackerConfig).segType
    ? isSegmentationType((value as SegmentationTrackerConfig).segType)
    : true;
