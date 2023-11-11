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
import parseCommandOptions from '../../utils/commandOptions';
import { unlinkSync } from 'fs';
import { SkinInteraction } from '../../services/renderSkin';
import ErrorEmbed from '../../utils/msg';
import { EmoticonPartArgument, colorModesArgument, eyeArgument, weaponArgument } from '../../utils/commonArguments';

const renderOptionalArguments = [
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
  weaponArgument,
  {
    name: 'gameskin',
    type: ApplicationCommandOptionType.Attachment,
    required: false,
    description: 'The optional gameskin image',
  },
  eyeArgument,
  {
    name: 'emoticon',
    type: ApplicationCommandOptionType.Attachment,
    required: false,
    description: 'The optional emoticon image',
  },
  EmoticonPartArgument
];

export default class implements ICommand {
  name: string;
  category: string;
  description: string;
  extraDescription: string;
  options: ApplicationCommandOption[];
    
  constructor() {
    this.name = 'render';
    this.category = 'render';
    this.description = 'Render a Teeworlds skin';
    this.options = [
      {
        name: 'default',
        description: 'Render a Teeworlds skin',
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
        description: 'Render a Teeworlds skin with custom colors',
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

    const skinInteraction = new SkinInteraction()
      .setInteraction(interaction)
      .setOptions(options)
      .setSubCommand(subCommand);
  
    // config
    if (await skinInteraction.load() === false) {
      await interaction.followUp(
        {
          embeds: [ ErrorEmbed.wrong() ],
          ephemeral: true
        }
      )
      
      return;
    }
    
    await skinInteraction.process();
    await skinInteraction.send();

    unlinkSync(skinInteraction.path);
  };
}
