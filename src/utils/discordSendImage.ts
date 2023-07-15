import { AttachmentBuilder, CacheType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { files } from './files';

type DiscordImage = {
  title: string;
  raw: Uint8Array;
  path: string
}

export default async function sendDiscordRawImage(
  interaction: CommandInteraction<CacheType>,
  discordImage: DiscordImage
) {
  const path = discordImage.path;

  files.write(
    path,
    discordImage.raw
  );

  const file = new AttachmentBuilder(path);
  const embed = new EmbedBuilder()
    .setTitle(discordImage.title)
    .setImage('attachment://' + path)
    .setColor(0x2b2d31);

  await interaction.followUp(
    {
      embeds: [ embed ],
      files: [ file ]
    }
  );

  files.delete(path);
}
