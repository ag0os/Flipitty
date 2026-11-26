#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { loadFlags } from './flags.ts';

const help = `Usage: flipitty eval <flag> [--file PATH]
Prints true or false.
Exit status: 0 on, 1 off, 2 error.
Reads ./flags.json unless --file is given.`;
const missingFileValue = 'option "--file" needs a value';

function usageError(message: string): number {
  console.error(`flipitty: ${message}\n${help}`);
  return 2;
}

function commandError(command?: string): string | undefined {
  if (command === undefined) {
    return 'missing command';
  }
  if (command !== 'eval') {
    return `unknown command ${JSON.stringify(command)}`;
  }
  return undefined;
}

function flagError(flag?: string, extra?: string): string | undefined {
  if (!flag) {
    return 'missing flag name';
  }
  if (extra !== undefined) {
    return `extra argument ${JSON.stringify(extra)}`;
  }
  return undefined;
}

function argumentError([command, flag, extra]: string[], file: string): string | undefined {
  return commandError(command) ?? flagError(flag, extra) ?? (file ? undefined : missingFileValue);
}

function evaluateFlag(flag: string, file: string): number {
  const flags = loadFlags(file);
  if (!flags.has(flag)) {
    console.error(`flipitty: Warning: flag ${JSON.stringify(flag)} is absent from ${JSON.stringify(file)}`);
  }
  const enabled = flags.isEnabled(flag);
  console.log(enabled);
  return enabled ? 0 : 1;
}

// Node gives a value passed to --help and a value missing from --file one code; its message names the option.
function optionValueError(message: string): string {
  return message.includes('--help') ? 'option "--help" takes no value' : missingFileValue;
}

function reportError(failure: Error & { code?: string }): number {
  if (failure.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION') {
    const option = failure.message.match(/Unknown option '([^']+)'/)?.[1];
    return usageError(`unknown option ${JSON.stringify(option)}`);
  }
  if (failure.code === 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE') {
    return usageError(optionValueError(failure.message));
  }
  console.error(`flipitty: ${failure.message}`);
  return 2;
}

function main(): number {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: {
        file: { type: 'string', default: 'flags.json' },
        help: { type: 'boolean', short: 'h' }
      }
    });
    if (values.help) {
      console.log(help);
      return 0;
    }
    const problem = argumentError(positionals, values.file!);
    if (problem) {
      return usageError(problem);
    }
    return evaluateFlag(positionals[1]!, resolve(values.file!));
  } catch (error) {
    return reportError(error as Error & { code?: string });
  }
}

process.exitCode = main();
