import * as vscode from 'vscode';
import { Tracker } from '../tracker/tracker';
import {
  getInvalidTrackerConfig,
  isTrackerConfig,
  TrackerConfig,
} from './tracker-config';

export class ExtensionConfigError extends Error {}

/**
 * Class that abstracts away the extension config.
 */
export class ExtensionConfig {
  /**
   * Throttle time for logging changes.
   * In ms, defaults to 1 second.
   *
   * All trackers must follow this global throttle.
   */
  readonly throttle: number;

  /**
   * The list of trackers that align with the configuration.
   */
  readonly trackerConfigs: TrackerConfig[];

  constructor() {
    this.throttle = this.timeShiftConfig.get('throttle') ?? 1000;
    this.trackerConfigs = this.getTrackerConfigs();

    // TODO: create actual trackers
  }

  private get timeShiftConfig() {
    return vscode.workspace.getConfiguration('time-shift');
  }

  /**
   * Returns the list of tracker configs from the global configuration.
   *
   * TODO: verify if throwing here is valid
   */
  private getTrackerConfigs(): TrackerConfig[] {
    const trackerConfigs = this.timeShiftConfig.get('trackers');
    if (!Array.isArray(trackerConfigs)) {
      throw new ExtensionConfigError('.trackers is not an array');
    }
    const invalidTrackerConfigs = trackerConfigs.filter(
      (trackerConfig) => !isTrackerConfig(trackerConfig)
    );
    if (invalidTrackerConfigs.length > 0) {
      throw new ExtensionConfigError(
        `.trackers contains invalid tracker configs: ${JSON.stringify(
          invalidTrackerConfigs.map(getInvalidTrackerConfig)
        )}`
      );
    }

    return trackerConfigs;
  }
}
