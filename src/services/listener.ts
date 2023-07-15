import { CacheType, CommandInteraction, GuildBasedChannel } from "discord.js";

export enum ListenerFeature {
  RENDER = 'render',
  BOARD = 'board'
}

export interface IListener {
  guildId: string,
  channelSource?: string,
  channelDestination?: string,
  feature?: ListenerFeature,
}

export const listenerValues: {[key: string]: string} = {
  guildId: 'guild_id',
  channelSource: 'channnel_source',
  channelDestination: 'channnel_destination',
  feature: 'feature'
};

export const listenerCallback: Record<ListenerFeature, Function> = {
  [ListenerFeature.RENDER]: undefined,
  [ListenerFeature.BOARD]: undefined
};

export async function resolveChannel(
  interaction: CommandInteraction<CacheType>,
  id: string
): Promise<GuildBasedChannel> {
  return await interaction
    .guild
    .channels
    .fetch(id);
}
