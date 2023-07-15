import {
  // Attachment,
  // AttachmentBuilder,
  Message
} from 'discord.js';

// import { v4 as uuidv4 } from 'uuid';
// import { Gameskin, Skin, createSkinOverview } from 'teeworlds-utilities';

import Bot from '../bot';
// import { defaultGameskin } from '../services/renderSkin';
// import { unlinkSync } from 'fs';
// import RequestsDatabase from '../services/database/requests';

// async function sendBoard(
//   attachment: Attachment,
//   path: string
// ) {
//   const url = attachment.url;

//   const skin = new Skin();
//   const gameskin = new Gameskin();

//   try {
//     await skin.load(url);
//     await gameskin.load(defaultGameskin);
//   } catch (error) {
//     return;
//   }
  
//   createSkinOverview(skin, gameskin).saveAs(path, true);
// }

export default async function messageCreate(
  _bot: Bot,
  message: Message
) {
  const attachments = message.attachments.filter(
    attachment => attachment.contentType === 'image/png'
  );

  // let path: string;

  if (attachments.size > 5 || message.author.bot) {
    return;
  }

  // for (const [_, attachment] of attachments) {
  //   path = uuidv4() + '.png';

  //   await sendBoard(attachment, path);

  //   RequestsDatabase.getListeners(
  //     {
  //       guildId: message.guildId
  //     }
  //   )

  //   // Selection de la feature
  //   await message.channel.send(
  //     {
  //       files: [ new AttachmentBuilder(path) ]
  //     }
  //   );

  //   unlinkSync(path);
  // }
}
