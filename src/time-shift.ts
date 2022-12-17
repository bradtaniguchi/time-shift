import * as vscode from 'vscode';
import { COMMANDS } from './constants/commands';

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
   * The configuration for this extension.
   * Can be manipulated by the user
   *
   * TODO: make own interface
   */
  private config: { throttle: number };

  /**
   * List of disposables that are added/removed on enable and disable.
   */
  private disposables: vscode.Disposable[] = [];

  constructor(params: TimeShiftParams) {
    const { noRegister } = params;
    this.params = params;
    this.config = this.getConfig();

    this.logMeta();

    if (!noRegister) {
      this.registerCommands();
    }
  }

  private getConfig(): { throttle: number } {
    return {
      throttle:
        vscode.workspace.getConfiguration('time-shift').get('throttle') ?? 1000,
    };
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
    vscode.window.showInformationMessage('time-shift enabled!');
    // write code to subscribe to file open events
    // TODO: this might be moved to multiple class calls, so the act of
    // actual tracking can be separated from the act of enabling the
    // extension.
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
    return this;
  }

  /**
   * Handles when the configuration changes.
   *
   * Used to update the config of this extension
   */
  private handleDidChangeConfiguration() {
    this.config = this.getConfig();
  }

  /**
   * Handles when a text document is opened.
   *
   * This will start tracking time spent in the file.
   *
   * TODO: add tracking logic
   */
  private handleDidOpenTextDocument(textDoc: vscode.TextDocument) {
    const { languageId, uri } = textDoc;

    console.log('[TimeShift][handleDidOpenTextDocument] called', {
      languageId,
      uri: uri.fragment,
      url: uri.toJSON(),
    });

    return this;
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

    return this;
  }

  /**
   * Callback for the disable command.
   *
   * Disables tracking
   */
  private disable() {
    console.log('[TimeShift][disable] called');

    vscode.window.showInformationMessage('time-shift disabled!');

    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];

    return this;
  }
}
