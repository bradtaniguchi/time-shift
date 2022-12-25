/* eslint-disable @typescript-eslint/naming-convention */
/**
 * List of commands for this extension.
 *
 * These should be reflected in the package.json file, otherwise
 * they wont be found by VSCode.
 */
export const COMMANDS = {
  ENABLE: 'time-shift.enable',
  DISABLE: 'time-shift.disable',
  STATS: 'time-shift.stats',
} as const;

/**
 * Commands for this extension
 */
export type Commands = typeof COMMANDS[keyof typeof COMMANDS];

/**
 * Type-guard to check if a string is a command
 */
export const isCommand = (command: string): command is Commands =>
  Object.values(COMMANDS).includes(command as Commands);
