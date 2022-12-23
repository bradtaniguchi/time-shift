import * as vscode from 'vscode';
import { ExtensionConfig } from '../config/extension-config';
import { TrackerConfig } from '../config/tracker-config';
import { SegmentationType } from './segmentation-type';

/**
 * Interface that represents a class that can track file usage.
 *
 * This is the base interface that all trackers must implement.
 */
export interface Tracker extends TrackerConfig {
  /**
   * Method that is called when a file is opened. This
   * should be used to update values for a given file.
   * @param textDoc the text document that was opened
   */
  onOpen(textDoc: vscode.TextDocument): void;

  /**
   * Method that is called when a file is closed.
   * This should be used to finalize updates for a given file.
   * @param textDoc the text document that was closed
   */
  onClosed(textDoc: vscode.TextDocument): void;

  /**
   * Method that is called when the extension is disabled.
   *
   * This should cleanup any pre-existing state, and is called
   * before this tracker is deleted from being watched.
   */
  onDisable(): void;

  /**
   * Method that is called when the configuration changes.
   *
   * This internally will run migration logic if the configuration
   * for this tracker changed.
   */
  onConfigurationChanged(newConfig?: TrackerConfig): void;
  // TODO: add on-delete and on-create files, as these might be required to
  // cleanup tracking events

  /**
   * Method that is called on each "tick". All trackers need to follow
   * the same "tick", usually its on a second basis.
   *
   * Each tracker will then be responsible to update their
   * data async when possible.
   */
  onTick(): void;
}

/**
 * Specific version of a tracker, except only tracks seconds for the
 * files that match the given glob.
 */
export interface SecondsTracker extends Tracker {
  seg: 'seconds';
}

/**
 * Type-guard for the SecondsTracker type.
 */
export const isSecondsTracker = (tracker: Tracker): tracker is SecondsTracker =>
  tracker.seg === 'seconds';

/**
 * Specific version of a tracker, except the data is saved in chunks
 * for a given time-frame.
 */
export interface SegmentationTracker extends Tracker {
  seg: 'chunked';
  /**
   * The type of segmentation that the tracker will use. Changing
   * this will change the rate in which segmentation entries are created.
   */
  segType: SegmentationType;
}

/**
 * Type-guard for the SegmentationTracker type.
 */
export const isSegmentationTracker = (
  tracker: Tracker
): tracker is SegmentationTracker => tracker.seg === 'chunked';
