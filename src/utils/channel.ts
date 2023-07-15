import {
  CacheType,
  CommandInteraction,
  GuildBasedChannel,
  Message
} from "discord.js";

export async function resolveChannel(
  interaction: CommandInteraction<CacheType> | Message,
  id: string
): Promise<GuildBasedChannel> {
  return await interaction
    .guild
    .channels
    .fetch(id);
}
