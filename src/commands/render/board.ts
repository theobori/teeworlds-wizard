import {
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
  Message,
} from 'discord.js';

import Bot from '../../bot';
import ICommand from '../../command';
import { unlinkSync } from 'fs';
import { BoardInteraction } from '../../services/renderSkin';
import parseCommandOptions from '../../utils/commandOptions';
import ErrorEmbed from '../../utils/msg';
import { colorModesArgument } from '../../utils/commonArguments';

const renderOptionalArguments: any = [
  {
    name: 'crop',
    type: ApplicationCommandOptionType.Boolean,
    description: 'Automatically crop the image',
    required: false,
  },
  {
    name: 'orientation',
    type: ApplicationCommandOptionType.Number,
    description: 'The direction in which the tee looks',
    required: false
  },
  {
    name: 'gameskin',
    type: ApplicationCommandOptionType.Attachment,
    required: false,
    description: 'The skin image',
  },
  {
    name: 'amount',
    type: ApplicationCommandOptionType.Number,
    required: false,
    description: 'The skin emote and weapon amount on the board',
  }
];

export default class implements ICommand {
  name: string;
  category: string;
  description: string;
  extraDescription: string;
  options: ApplicationCommandOption[];
    
  constructor() {
    this.name = 'board';
    this.category = 'render';
    this.description = 'Creates a view with an assembled skin for each emote associated with a weapon';
    this.options = [
      {
        name: 'default',
        description: 'Creates a board ',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'image',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
            description: 'The skin image',
          },
          ...renderOptionalArguments
        ]
      },
      {
        name: 'color',
        description: 'Creates a board with custom colors',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'image',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
            description: 'The skin image',
          },
          colorModesArgument,
          {
            name: 'colorbody',
            type: ApplicationCommandOptionType.String,
            description: 'The skin body color',
            required: true
          },
          {
            name: 'colorfeet',
            type: ApplicationCommandOptionType.String,
            description: 'The skin feet color',
            required: true
          },
          ...renderOptionalArguments
        ]
      },
    ];
  }

  async run(
    _bot: Bot,
    message: Message<boolean> | CommandInteraction<CacheType>,
    args: Array<CommandInteractionOption>
  ) {
    const [ subCommand ] = args;
    const interaction = message as CommandInteraction<CacheType>;
    const options = parseCommandOptions(subCommand)

    await interaction.deferReply({ ephemeral: true });

    const boardInteraction = new BoardInteraction()
      .setInteraction(interaction)
      .setOptions(options)
      .setSubCommand(subCommand);
  
    // config
    if (await boardInteraction.load() === false) {
      await interaction.followUp(
        {
          embeds: [ ErrorEmbed.wrong() ],
          ephemeral: true
        }
      )
      
      return;
    }
    
    await boardInteraction.process();
    await boardInteraction.send();

    unlinkSync(boardInteraction.path);

  };
}

