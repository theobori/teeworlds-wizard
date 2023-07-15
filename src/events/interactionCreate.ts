import {
  CommandInteractionOption,
  Interaction
} from 'discord.js';

import Bot from '../bot';
import { Logger } from '../services/logs';

export default function interactionCreate(
  bot: Bot,
  interaction: Interaction
) {
  const args: Array<CommandInteractionOption> = [];

  if (!interaction.isCommand()) {
    return;
  }

  for (const v of interaction.options.data) {
    args.push(v)
  }

  const command = bot.commands.get(interaction.commandName);
  const user = interaction.user;

  Logger.info(
    user.username + '#' + user.discriminator +
    ' used /' + interaction.commandName + 
    ' in #' + interaction.channel.name +
    ' of ' + interaction.guild.name
  );

  if (command === undefined) {
    return;
  }

  command.run(bot, interaction, args);
}
