import * as vscode from 'vscode';
import { ExtensionConfig } from './config/extension-config';
import { COMMANDS } from './constants/commands';
import { Tracker } from './tracker/tracker';
import { TrackerFactory } from './tracker/tracker-factory';

/**
 * Configuration params for the TimeShift class.
 */
export interface TimeShiftParams {
  /**
   * The extension context
   */
  context: vscode.ExtensionContext;
  /**
   * If we are to not auto-register commands.
   * This is available for debugging
   */
  noRegister?: boolean;
  /**
   * If we are to not auto-enable the extension, which will setup file
   * watchers and tracking.
   */
  noEnable?: boolean;
}

/**
 * Primary class instance that sets up event listeners,
 * and manages everything.
 *
 * This instance should be created when activated.
 *
 * TODO: not sure if having an instance of the class is even the
 * right call here. Possible move away from OOP entirely.
 */
export class TimeShift {
  /**
   * The passed params from the constructor.
   */
  private readonly params: TimeShiftParams;

  /**
   * The configuration as pared by extension-config.ts
   */
  private config: ExtensionConfig;

  /**
   * List of disposables that are added/removed on enable and disable.
   */
  private disposables: vscode.Disposable[] = [];

  /**
   * The current tracker classes.
   */
  private trackers: Tracker[];

  /**
   * Ref for the timeout that is used to throttle the tracking.
   */
  private intervalRef?: NodeJS.Timeout;

  /**
   * The tick count for the current session.
   *
   * Is essentially stored "in-memory", and can be used for
   * debugging.
   */
  private tickCount = 0;

  /**
   * If the extension is enabled.
   */
  private enabled?: boolean;

  constructor(params: TimeShiftParams) {
    const { noRegister } = params;
    this.params = params;
    this.config = new ExtensionConfig();

    this.logMeta();

    if (!noRegister) {
      this.registerCommands();
    }

    this.trackers = this.config.trackerConfigs.map((trackerConfig) =>
      new TrackerFactory().create(trackerConfig)
    );
  }

  /**
   * Logs meta-data to the console to help with debugging.
   */
  private logMeta() {
    const { context } = this.params;
    console.log('[TimeShift][logMeta] called', {
      globalStorageUriPath: context.globalStorageUri.fsPath,
      localStorageUriPath: context.storageUri?.fsPath,
      config: this.config,
      tickCount: this.tickCount,
    });

    return this;
  }

  /**
   * Registers commands for this extension.
   *
   * This should be disabled if passed `noRegister` in the constructor.
   *
   * TODO: verify commands not already registered?
   */
  private registerCommands() {
    const { context } = this.params;
    console.log('[TimeShift][registerCommands] called');
    context.subscriptions.push(
      vscode.commands.registerCommand(COMMANDS.ENABLE, this.enable.bind(this))
    );
    context.subscriptions.push(
      vscode.commands.registerCommand(COMMANDS.DISABLE, this.disable.bind(this))
    );
    context.subscriptions.push(
      vscode.commands.registerCommand(COMMANDS.STATS, this.stats.bind(this))
    );
    return this;
  }

  /**
   * Callback for the enable command.
   *
   * Enables the tracking of time spent in files using the different trackers
   * specified.
   */
  private enable() {
    console.log('[TimeShift][enable] called');
    if (this.enabled) {
      console.log('[TimeShift][enable] already enabled');
      return;
    }
    vscode.window.showInformationMessage('time-shift enabled!');

    // TODO: add `vscode.workspace.textDocuments` for initial tracking
    vscode.workspace.onDidChangeConfiguration(
      this.handleDidChangeConfiguration,
      this,
      this.disposables
    );
    vscode.workspace.onDidOpenTextDocument(
      this.handleDidOpenTextDocument,
      this,
      this.disposables
    );
    vscode.workspace.onDidCloseTextDocument(
      this.handleDidCloseTextDocument,
      this,
      this.disposables
    );
    const textDocuments = vscode.workspace.textDocuments;
    for (const tracker of this.trackers) {
      tracker.onEnable(textDocuments);
    }

    this.intervalRef = setInterval(
      this.onTick.bind(this),
      this.config.throttle
    );
    this.tickCount = 0;
    this.enabled = true;
  }

  /**
   * Handles when the configuration changes. This clears previous ticks,
   *
   * Used to update the config of this extension
   */
  private handleDidChangeConfiguration() {
    console.log('[TimeShift][handleDidChangeConfiguration] called');
    this.config = new ExtensionConfig();

    for (const tracker of this.trackers) {
      const trackerConfig = this.config.trackerConfigsMap.get(tracker.id);
      tracker.onConfigurationChanged(trackerConfig);

      if (!trackerConfig) {
        // TODO: cleanup the trackers
      }
      if (this.intervalRef) {
        clearInterval(this.intervalRef);
      }
      this.tickCount = 0;
      this.intervalRef = setInterval(
        this.onTick.bind(this),
        this.config.throttle
      );
    }
  }

  /**
   * Handles when a "tick" occurs according to the setInterval.
   */
  private onTick() {
    console.log(`[TimeShift][tick] called: ${this.tickCount}`);
    for (const tracker of this.trackers) {
      tracker.onTick();
    }
    this.tickCount += 1;
  }

  /**
   * Handles when a text document is opened.
   *
   * This will start tracking time spent in the file.
   */
  private handleDidOpenTextDocument(textDoc: vscode.TextDocument) {
    const { languageId, uri } = textDoc;

    console.log('[TimeShift][handleDidOpenTextDocument] called', {
      languageId,
      uri: uri.fragment,
      url: uri.toJSON(),
    });

    for (const tracker of this.trackers) {
      tracker.onOpen(textDoc);
    }
  }

  /**
   * Handles when a text document is closed.
   *
   * This will stop tracking time spent in the file.
   *
   * **note** this might be moved to a different class, as what to track
   * might be too generic.
   */
  private handleDidCloseTextDocument(textDoc: vscode.TextDocument) {
    const { languageId } = textDoc;

    console.log('[TimeShift][handleDidCloseTextDocument] called', {
      languageId,
    });

    for (const tracker of this.trackers) {
      tracker.onClosed(textDoc);
    }
  }

  /**
   * Callback for the disable command.
   *
   * Disables tracking
   */
  private disable() {
    console.log('[TimeShift][disable] called');

    vscode.window.showInformationMessage('time-shift disabled!');

    for (const tracker of this.trackers) {
      tracker.onDisable();
    }

    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];

    clearInterval(this.intervalRef);
  }

  /**
   * Callback for the stats command.
   *
   * Shows the stats for the current session into the console.
   * Useful for debugging
   */
  private stats() {
    console.log('[TimeShift][stats] called');

    this.logMeta();

    for (const tracker of this.trackers) {
      tracker.onStats();
    }
  }
}
