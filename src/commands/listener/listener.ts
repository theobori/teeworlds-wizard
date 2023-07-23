import {
  APIEmbedField,
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  CacheType,
  ChannelType,
  CommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
  GuildBasedChannel,
  GuildMember,
  Message,
  PermissionsBitField,
} from 'discord.js';

import {
  Document,
  WithId,
} from 'mongodb';

import Bot from '../../bot';
import ICommand from '../../command';
import parseCommandOptions from '../../utils/commandOptions';
import ErrorEmbed from '../../utils/msg';
import { IListener, ListenerFeatureKind } from '../../services/listener';
import RequestsDatabase from '../../services/database/requests';
import AbstractPageComponent from '../../services/components/page';
import capitalize from '../../utils/capitalize';
import { resolveChannel } from '../../utils/channel';

type EmbedDescriptor = {
  title: string,
  prefixMessage: string,
  color: number
}

class ListenerPageComponent 
extends AbstractPageComponent<IListener> {
  fieldResolve = {
    channelSource: 'listen',
    channelDestination: 'output',
  }
  
  constructor() {
    super();

    this
  }

  private autoCreateFields(): APIEmbedField[] {
    const currentContent = this.getCurrentContent();
    const model = currentContent[0] || [];

    const keys = Object.keys(model);

    let ret = [];

    for (const key of keys) {
      if (key === 'guildId') {
        continue;
      }

      const fieldName = Object.hasOwn(this.fieldResolve, key)
        ? this.fieldResolve[key]
        : key;

      ret.push(
        {
          name: capitalize(fieldName),
          value: currentContent
            .map(content => content[key].toString())
            .join('\n'),
          inline: true
        }
      )
    }

    return ret;
  }

  createEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('Listeners')
      .setColor(0x2b2d31)
      .addFields(this.autoCreateFields())
      .setFooter(
        {
          text: 'Page ' + this.pageNumber + ' / ' + this.pageMax
        }
      );
  }

  async reply() {
    await this.message.followUp(this.createOptions());
  }
}

const defaultArguments: any = [
  {
    name: 'source',
    type: ApplicationCommandOptionType.Channel,
    required: true,
    description: 'The channel it listens to',
  },
  {
    name: 'destination',
    type: ApplicationCommandOptionType.Channel,
    required: true,
    description: 'The channel it outputs to',
  },
  {
    name: 'feature',
    type: ApplicationCommandOptionType.String,
    required: true,
    description: 'The channel it outputs to',
    choices: [
      {
        name: 'Render a skin',
        value: ListenerFeatureKind.RENDER,
      }, 
      {
        name: 'Create a skin board',
        value: ListenerFeatureKind.BOARD
      }
    ]
  }
]

export default class implements ICommand {
  name: string;
  category: string;
  description: string;
  extraDescription: string;
  options: ApplicationCommandOption[];
    
  constructor() {
    this.name = 'listener';
    this.category = 'listener';
    this.description = 'Manages the listeners';
    this.options = [
      {
        name: 'set',
        description: 'Set a listener',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          ...defaultArguments
        ]
      },
      {
        name: 'get',
        description: 'Get listeners enabled',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'delete',
        description: 'Delete a listener',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          ...defaultArguments
        ]
      },
    ];
  }

  private async resolveChannels(
    interaction: CommandInteraction<CacheType>,
    ...ids: string[]
  ): Promise<GuildBasedChannel[]> {
    let ret = [];
  
    for (const id of ids) {
      ret.push(await resolveChannel(interaction, id));
    }

    return ret;
  }

  private async resolveListeners(
    interaction: CommandInteraction<CacheType>,
    listener: IListener 
  ): Promise<GuildBasedChannel[]> {
    return (
      await this.resolveChannels(
        interaction,
        listener.channelSource,
        listener.channelDestination,
      )
    )
    .filter(
      channel => channel.type === ChannelType.GuildText
    );
  }

  private async listenerMessage(
    interaction: CommandInteraction<CacheType>,
    listener: IListener
  ): Promise<string> {
    const [src, dest] = await this.resolveListeners(
      interaction,
      listener
    );
    
    return ' the listener that observes channel ' +
      '`' + src.name + '`' +
      ' and sends to channel ' +
      '`' + dest.name + '`' +
      ' with feature ' +
      '`' + listener.feature + '`' + '.';
  }

  private async formatDocuments(
    interaction: CommandInteraction<CacheType>,
    documents: WithId<Document>[]
  ): Promise<IListener[]> {
    const ret: IListener[] = [];

    for (const listener of documents) {
      const [src, dest] = await this.resolveChannels(
        interaction,
        listener.channel_source,
        listener.channel_destination,
      )

      ret.push({
        guildId: listener.guild_id,
        channelSource: src.name,
        channelDestination: dest.name,
        feature: listener.feature,
      });
    }

    return ret;
  }

  private async sendValidation(
    interaction: CommandInteraction<CacheType>,
    listener: IListener,
    embedDescriptor: EmbedDescriptor
  ) {
    const message = await this.listenerMessage(
      interaction,
      listener
    );

    const embed = new EmbedBuilder()
      .setColor(embedDescriptor.color)
      .setTitle(embedDescriptor.title)
      .setDescription(embedDescriptor.prefixMessage + message);
    
    await interaction.followUp({ embeds: [ embed ] });
  }

  private async listenerSet(
    interaction: CommandInteraction<CacheType>,
    listener: IListener,
  ) {
    await RequestsDatabase.updateListener(listener);

    await this.sendValidation(
      interaction,
      listener,
      {
        color: 0x3c9e56,
        title: 'Set',
        prefixMessage: 'You have set '
      }
    )
  }

  private async listenerGet(
    interaction: CommandInteraction<CacheType>,
    listener: IListener
  ) {
    listener = {
      guildId: listener.guildId
    };

    const result = RequestsDatabase.getListeners(listener);
    const documents = await result.toArray();

    if (documents.length === 0) {
      await interaction.followUp({ embeds: [ ErrorEmbed.notFound() ] });

      return;
    }

    const listenerContent = await this.formatDocuments(
      interaction,
      documents
    );

    const component = new ListenerPageComponent()
      .setMaxLines(10)
      .setMessage(interaction)
      .addContent(listenerContent);
    
    await component.collect();
    await component.reply();
  }

  private async listenerDelete(
    interaction: CommandInteraction<CacheType>,
    listener: IListener,
  ) {
    const result = await RequestsDatabase.deleteListener(listener);
    const embed = ErrorEmbed.wrong(
      'This listener doesn\'t exist.'
    );

    if (result.acknowledged && result.deletedCount === 0) {
      await interaction.followUp({ embeds: [ embed ] });

      return;
    }

    await this.sendValidation(
      interaction,
      listener,
      {
        color: 0xdb3b4a,
        title: 'Delete',
        prefixMessage: 'You have deleted '
      }
    )
  }

  async run(
    _bot: Bot,
    message: Message<boolean> | CommandInteraction<CacheType>,
    args: Array<CommandInteractionOption>
  ) {
    const [ subCommand ] = args;
    const interaction = message as CommandInteraction<CacheType>;
    const options = parseCommandOptions(subCommand)

    const author = message.member as GuildMember;
    
    await interaction.deferReply({ ephemeral: true });

    if (author.permissions.has(PermissionsBitField.Flags.Administrator) === false) {
      interaction.followUp({ embeds: [ErrorEmbed.missingPermission()] });
  
      return;
    }

    const listener = {
      guildId: interaction.guildId,
      channelSource: options.source,
      channelDestination: options.destination,
      feature: options.feature
    }

    switch (subCommand.name) {
      case 'set':
        const channels = await this.resolveListeners(
          interaction,
          listener
        );

        if (channels.length !== 2) {
          const embed = ErrorEmbed.wrong(
            'Only guild text channels are allowed'
          );

          await interaction.followUp({ embeds: [ embed ] });
    
          return;
        }
        
        await this.listenerSet(interaction, listener);
        break;

      case 'get':
        await this.listenerGet(interaction, listener);
        break;
        
      case 'delete':
        await this.listenerDelete(interaction, listener);
        break;
  
      default:
        break;
    }
  };
}
