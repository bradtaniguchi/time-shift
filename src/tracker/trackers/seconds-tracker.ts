import { TextDocument } from 'vscode';
import { TrackerConfig } from '../../config/tracker-config';
import { Tracker } from '../tracker';
import { TrackerLocation } from '../tracker-location';
import { TrackerSegmentation } from '../tracker-segmentation';

/**
 * Extension memory store. Unsure if this is better.
 */
const memoryStore: Record<string, number> = {};

/**
 * Tracker implementation for keeping track of file usage that
 * matches the glob, for seconds.
 */
export class SecondsTracker implements Tracker {
  /**
   * In memory store for the tracker.
   */
  public static memory: Record<string, number> = {};

  readonly id: string;
  readonly location: TrackerLocation;
  readonly glob: string;
  readonly seg: TrackerSegmentation;

  constructor(private config: TrackerConfig) {
    this.id = config.id;
    this.location = config.location;
    this.glob = config.glob;
    this.seg = config.seg;
  }
  onOpen(textDoc: TextDocument): void {
    const { languageId, uri, fileName } = textDoc;

    console.log('[SecondsTracker][onOpen] called', {
      languageId,
      fileName,
      uri: uri.fragment,
      url: uri.toJSON(),
    });

    // TODO: test against glob filename matching

    if (this.location === 'memory') {
      this.onMemoryOpen(textDoc);
    }
    // TODO: handle global, and local
  }

  onMemoryOpen(textDoc: TextDocument) {
    // TODO: add setTimeout
    // if (!SecondsTracker.memory[this.id]) {
    //   SecondsTracker.memory[this.id] = 1;
    // }
    // SecondsTracker.memory[this.id] += 1;
  }

  onClosed(textDoc: TextDocument): void {}
  onDisable(): void {}
  onConfigurationChanged(): void {}
}
