export enum ListenerFeatureKind {
  RENDER = 'render',
  BOARD = 'board'
}

export interface IListener {
  guildId: string,
  channelSource?: string,
  channelDestination?: string,
  feature?: ListenerFeatureKind,
}

export const listenerValues: {[key: string]: string} = {
  guildId: 'guild_id',
  channelSource: 'channel_source',
  channelDestination: 'channel_destination',
  feature: 'feature'
};

export const listenerCallback: Record<ListenerFeatureKind, Function> = {
  [ListenerFeatureKind.RENDER]: undefined,
  [ListenerFeatureKind.BOARD]: undefined
};

