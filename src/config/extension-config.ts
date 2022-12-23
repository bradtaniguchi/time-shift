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

  /**
   * Lookup map of all the tracker configs by id.
   */
  readonly trackerConfigsMap: Map<TrackerConfig['id'], TrackerConfig>;

  constructor() {
    this.throttle = this.timeShiftConfig.get('throttle') ?? 1000;
    const { trackerConfigs, trackerConfigsMap } = this.parseTrackerConfigs();
    this.trackerConfigs = trackerConfigs;
    this.trackerConfigsMap = trackerConfigsMap;
  }

  private get timeShiftConfig() {
    return vscode.workspace.getConfiguration('time-shift');
  }

  /**
   * Returns the list of tracker configs from the global configuration.
   *
   * TODO: verify if throwing here is valid
   */
  private parseTrackerConfigs(): {
    trackerConfigs: TrackerConfig[];
    trackerConfigsMap: Map<TrackerConfig['id'], TrackerConfig>;
  } {
    const trackerConfigs = this.timeShiftConfig.get('trackers');
    const trackerConfigsMap = new Map<TrackerConfig['id'], TrackerConfig>();
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
    for (const trackerConfig of trackerConfigs) {
      if (trackerConfigsMap.has(trackerConfig.id)) {
        throw new ExtensionConfigError(
          `Duplicate tracker id found: ${trackerConfig.id}`
        );
      }
      trackerConfigsMap.set(trackerConfig.id, trackerConfig);
    }

    return { trackerConfigs, trackerConfigsMap };
  }
}
