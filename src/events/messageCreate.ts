import {
  Attachment,
  AttachmentBuilder,
  Collection,
  Message, TextBasedChannel
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';
import { Gameskin, Skin, createSkinOverview } from 'teeworlds-utilities';

import Bot from '../bot';
import RequestsDatabase from '../services/database/requests';
import { ListenerFeatureKind } from '../services/listener';
import { defaultGameskin } from '../services/renderSkin';
import { resolveChannel } from '../utils/channel';
import { unlink } from 'fs/promises';

async function buildBoard(
  url: string,
  path: string
) {
  const skin = new Skin();
  const gameskin = new Gameskin();

  try {
    await skin.load(url);
    await gameskin.load(defaultGameskin);
  } catch {
    return;
  }
  
  createSkinOverview(skin, gameskin)
    .saveAs(path, true);
}

async function buildRender(
  url: string,
  path: string
) {
  const skin = new Skin();

  try {
    await skin.load(url);
  } catch {
    return;
  }

  skin
    .render()
    .saveRenderAs(path, true);
}

async function buildFeatureImage(
  url: string,
  feature: ListenerFeatureKind
): Promise<string> {
  const path = uuidv4() + '.png';
  
  switch (feature) {
    case ListenerFeatureKind.BOARD:
      await buildBoard(url, path);
      break;

    case ListenerFeatureKind.RENDER:
      await buildRender(url, path);
      break;
  
    default:
      break;
  }

  return path;
}

async function buildAttachments(
  channel: TextBasedChannel,
  attachments: Collection<string, Attachment>,
  feature: ListenerFeatureKind
  ) {
  for (const [_, attachment] of attachments) {
    // Build
    const path = await buildFeatureImage(
      attachment.url,
      feature
    );

    // Output to the Discord text channel
    await channel.send(
      {
        files: [ new AttachmentBuilder(path) ]
      }
    );

    // Remove the file
    await unlink(path);
  }
}

export default async function messageCreate(
  _bot: Bot,
  message: Message
) {
  const attachments = message.attachments.filter(
    attachment => attachment.contentType === 'image/png'
  );

  if (
    attachments.size === 0 ||
    attachments.size > 5 || 
    message.author.bot
  ) {
    return;
  }

  // Get the channels
  const listeners = RequestsDatabase.getListeners(
    {
      guildId: message.guildId,
      channelSource: message.channelId
    }
  );

  const documents = await listeners.toArray();

  // Outputs in every found listeners
  for (const listener of documents) {
    const id = listener.channel_destination;

    const channel = await resolveChannel(
      message,
      id
    ) as TextBasedChannel;

    await buildAttachments(
      channel,
      attachments,
      listener.feature
    );
  }
}
