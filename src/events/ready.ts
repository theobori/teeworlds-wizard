import { Collection } from 'discord.js';
import { Bot } from '../bot';
import { Logger } from '../services/logs';

async function cacheInvite(bot: Bot) {
  for (const [_name, guild] of bot.guilds.cache) {
    const invites = await guild.invites.fetch();

    bot.invites.set(
      guild.id,
      new Collection(invites.map(invite => [invite.code, invite.uses]))
    )
  }
}

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

  // Caching every guilds invites
  await cacheInvite(bot);
}
