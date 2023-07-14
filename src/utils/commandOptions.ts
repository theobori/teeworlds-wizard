import {
  CacheType,
  CommandInteractionOption
} from 'discord.js';

export type ParsedOptions = {[key: string]: any};

export default function parseCommandOptions(
  command: CommandInteractionOption<CacheType>
): ParsedOptions {
  let options = {};

  if (command.options === null) {
    return options;
  }

  for (const option of command.options) {
    options[option.name] = option.attachment || option.value;
  }

  return options;
}
