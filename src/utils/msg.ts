import { EmbedBuilder } from "discord.js";

enum ErrorMessage {
  WRONG_ERROR_MSG = '⚠️ Something went wrong',
  NOT_FOUND_ERROR_MSG = '☁️ Nothing has not been found',
  MISSING_PERMISSION = '⛔️ Missing permission(s)',
}

export default class ErrorEmbed {
  static wrong(details: string = ''): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setTitle(ErrorMessage.WRONG_ERROR_MSG)
      .setColor(0x2b2d31);

    if (details) {
      embed.setDescription('**Hint**: ' + details);
    }

    return embed;
  }

  static notFound(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(ErrorMessage.NOT_FOUND_ERROR_MSG)
      .setColor(0x2b2d31);
  }

  static missingPermission(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(ErrorMessage.MISSING_PERMISSION)
      .setColor(0x2b2d31);
  }
}
