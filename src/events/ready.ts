import Bot from '../bot';
import { Logger } from '../services/logs';

export default async function ready(bot: Bot) {
  const slashCommands = [];

  for (const [name, command] of bot.commands) {
    slashCommands.push(
      {
        name,
        description: command.description,
        options: command.options,
        type: 1
      }
    );

    Logger.info('[+] Registered /' + name + ' - ' + command.description);
  }

  const botName = bot.user.username + '#' + bot.user.discriminator
  Logger.info(botName + ' is ready')

  await bot.application?.commands.set(slashCommands);
}
