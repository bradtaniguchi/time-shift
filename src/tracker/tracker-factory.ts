import { ExtensionConfig } from '../config/extension-config';
import { TrackerConfig } from '../config/tracker-config';
import { Tracker } from './tracker';

/**
 * Class that can be used to create the list of trackers
 * based on the configuration.
 *
 * Auto creates the trackers on creation.
 */
export class TrackerFactory {
  constructor(public config: ExtensionConfig) {}

  /**
   * Creates a tracker for a given tracker config
   */
  public create(config: TrackerConfig): Tracker {
    return {} as any;
  }
}
