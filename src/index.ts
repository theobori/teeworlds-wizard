import { Partials } from 'discord.js';
import 'dotenv/config';

import { Bot } from './bot';

function main() {
  const client = new Bot(
    {
      intents: [
        'Guilds',
        'GuildMembers'
      ],

      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
      ]
    }
  );
  const token = process.env.TOKEN;

  client.login(token);
}

main();
