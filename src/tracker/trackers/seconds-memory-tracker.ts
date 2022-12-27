import { TextDocument } from 'vscode';
import { TrackerConfig } from '../../config/tracker-config';
import { Tracker } from '../tracker';
import { TrackerSegmentation } from '../tracker-segmentation';

export class SecondsMemoryTrackerError extends Error {}

/**
 * Tracker implementation for keeping track of file usage that
 * matches the glob, for seconds.
 */
export class SecondsMemoryTracker implements Tracker {
  /**
   * In memory store for the tracker.
   */
  public static memory: Record<string, number> = {};

  readonly id: string;
  readonly location: 'memory';
  readonly glob: string;
  readonly seg: TrackerSegmentation;

  /**
   * Map of opened files matching the glob.
   */
  private openedFiles = new Set<string>();

  constructor(config: TrackerConfig) {
    if (config.location !== 'memory') {
      throw new SecondsMemoryTrackerError('Location is not "memory"');
    }
    this.id = config.id;
    this.location = config.location;
    this.glob = config.glob;
    this.seg = config.seg;
  }

  onEnable(textDocs: readonly TextDocument[]): void {
    for (const textDoc of textDocs) {
      this.onOpen(textDoc);
    }
  }

  onOpen(textDoc: TextDocument): void {
    const { uri } = textDoc;

    // TODO: test against glob filename matching

    this.openedFiles.add(uri.fsPath);
  }

  onClosed(textDoc: TextDocument): void {
    const { uri } = textDoc;

    this.openedFiles.delete(uri.fsPath);
  }

  onDisable(): void {
    this.openedFiles.clear();
  }

  onTick(): void {
    if (this.openedFiles.size > 0) {
      // TODO: add to segmentation
      if (!SecondsMemoryTracker.memory[this.id]) {
        SecondsMemoryTracker.memory[this.id] = 1;
      }
      SecondsMemoryTracker.memory[this.id] += 1;
    }
  }

  // we don't do anything in this case
  onConfigurationChanged(config?: TrackerConfig): void {
    if (!config) {
      // if there is no config, then this tracker should delete itself.
      this.openedFiles.clear();

      delete SecondsMemoryTracker.memory[this.id];
    }
  }

  onStats(): void {
    console.log(`[SecondsMemoryTracker][${this.id}]: stats`, {
      // TODO add segmentation
      value: SecondsMemoryTracker.memory[this.id],
    });
  }
}
