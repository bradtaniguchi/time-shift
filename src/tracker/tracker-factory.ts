import { ExtensionConfig } from '../config/extension-config';
import { TrackerConfig } from '../config/tracker-config';
import { Tracker } from './tracker';
import { SecondsMemoryTracker } from './trackers/seconds-memory-tracker';

export class TrackerFactoryError extends Error {}
/**
 * Class that can be used to create the list of trackers
 * based on the configuration.
 *
 * Auto creates the trackers on creation.
 */
export class TrackerFactory {
  /**
   * Creates a tracker for a given tracker config.
   *
   * Trackers are implemented based primarily on their segmentation
   * and location.
   */
  public create(config: TrackerConfig): Tracker {
    const { seg, location } = config;

    if (seg === 'seconds') {
      if (location === 'memory') {
        return new SecondsMemoryTracker(config);
      }
    }
    throw new TrackerFactoryError('seg+location combo not supported yet');
  }
}
