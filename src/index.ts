import { GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';

import Bot from './bot';

function main() {
  const client = new Bot(
    {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ],

      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
      ]
    }
  );
  const token = process.env.TOKEN;

  client.login(token);
}

main();
