import {
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
  Message,
} from 'discord.js';


import { Bot } from '../../bot';
import ICommand from '../../interfaces/command';

// import parseCommandOptions from '../../utils/commandOptions';

const eyesArgument: any = {
  name: 'eyes',
  type: ApplicationCommandOptionType.String,
  required: false,
  description: 'The skin eyes state',
  choices: [
    {
      name: 'default',
      value: 'default_eye'
    }, 
    {
      name: 'angry',
      value: 'angry_eye'
    },
    {
      name: 'blink',
      value: 'blink_eye'
    },
    {
      name: 'happy',
      value: 'happy_eye'
    },
    {
      name: 'cross',
      value: 'cross_eye'
    },
    {
      name: 'scary',
      value: 'scary_eye'
    }
  ]
};

const colorModes = {
  name: 'colormode',
  type: ApplicationCommandOptionType.String,
  description: 'The skin color mode',
  required: true,
  choices: [
    {
      name: 'RGB',
      value: 'rgb',
      
    }, 
    {
      name: 'HSL',
      value: 'hsl'
    },
    {
      name: 'Teeworlds code',
      value: 'code',
    }
  ]
};

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
        name: 'color',
        description: 'Render a Teeworlds skin with custom colors',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'image',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
            description: 'The skin image (it takes priority over the url)',
          },
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
          colorModes,
          {
            name: 'crop',
            type: ApplicationCommandOptionType.Boolean,
            description: 'Automatically crop the image',
            required: false
          },
          {
            name: 'orientation',
            type: ApplicationCommandOptionType.Number,
            description: 'The direction in which the tee looks',
            required: false
          },
          eyesArgument
        ]
      },
    ];
  }

  async run(
    _bot: Bot,
    message: Message<boolean> | CommandInteraction<CacheType>,
    _args: Array<CommandInteractionOption>
  ) {

    const interaction = message as CommandInteraction<CacheType>;

    await interaction.deferReply({ ephemeral: true });

    await interaction.followUp(
      {
        content: 'hello'
      }
    );
  };
}
  