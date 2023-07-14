import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessagePayload,
  CommandInteraction,
  CacheType,
  InteractionReplyOptions
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';

import Page from '../../utils/page';

export interface IPageComponent {
  collect: () => void;
  reply: () => void;
}

export default abstract class AbstractPageComponent<T>
  extends Page<T>
  implements IPageComponent
{
  protected message: CommandInteraction<CacheType>;

  protected previousId: string;
  protected nextId: string;

  constructor(maxLines: number = 10) {
    super(maxLines);

    this.previousId = uuidv4();
    this.nextId = uuidv4();
  }

  setMessage(message: CommandInteraction<CacheType>): this {
    this.message = message;
    
    return this;
  }

  protected createButtons(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(this.previousId)
					.setStyle(
            this.hasPrevious()
              ? ButtonStyle.Secondary
              : ButtonStyle.Danger
          )
          .setEmoji('⬅️'),
        new ButtonBuilder()
					.setCustomId(this.nextId)
					.setStyle(
            this.hasNext()
              ? ButtonStyle.Secondary
              : ButtonStyle.Danger
          )
          .setEmoji('➡️'),
			);
  }

  createEmbed(): EmbedBuilder {
    return new EmbedBuilder();
  }

  protected createOptions()
  : string | MessagePayload | InteractionReplyOptions {
    return {
      embeds: [ this.createEmbed() ],
      components: [ this.createButtons() ]
    };
  }

  async collect() {
    const collector = this.message.channel.createMessageComponentCollector(
      {
        time: 1000 * 60
      }
    );

    collector.on('collect', async i => {
      if (i.user.id !== this.message.member.user.id) {
        return;
      }

      if (i.customId !== this.nextId && i.customId !== this.previousId) {
        return;
      }

      switch (i.customId) {
        case this.previousId:
          this.previous()
          break;
        case this.nextId:
          this.next();
          break;
        default:
          break;
      }

      await i.deferUpdate();
      await i.editReply(this.createOptions());
      
    });
  }

  async reply() {
    await this.message.reply(this.createOptions());
  }
}
