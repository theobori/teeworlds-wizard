import {
  ApplicationCommandOption,
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
  Message,
  APIEmbedField,
  ApplicationCommandOptionChoiceData
} from 'discord.js';
import { join } from 'path';

import Bot from '../../bot';
import ICommand, { isICommand } from '../../command';
import AbstractPageComponent from '../../services/components/page';
import capitalize from '../../utils/capitalize';
import parseCommandOptions from '../../utils/commandOptions';
import { files } from '../../utils/files';
import ErrorEmbed from '../../utils/msg';

type CommandBasic = {
  name: string;
  category: string;
};

class CommandListPageComponent 
extends AbstractPageComponent<CommandBasic> {
  constructor() {
    super();
  }

  private autoCreateFields(): APIEmbedField[] {
    const currentContent = this.getCurrentContent();
    const model = currentContent[0] || [];

    return Object.keys(model).map(name => {
      return {
        name: capitalize(name),
        value: currentContent.map(content => { 
          return content[name].toString()
        }).join('\n'),
        inline: true
    };
    });
  }

  createEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('Command list')
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

export default class implements ICommand {
  name: string;
  category: string;
  description: string;
  options: ApplicationCommandOption[];

  private readonly commands: ICommand[];
    
  constructor() {
    this.name = 'help';
    this.category = 'general';
    this.description = 'Get informations about the available commands';
    this.commands = this.getCommands();
    this.options = [
      {
        name: 'list',
        description: 'List every command name',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
        ]
      },
      {
        name: 'detail',
        description: 'Get detail about a command',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'Website username',
            choices: this.createChoices()
          }
        ]
      },
    ];
  }

  private createChoices(): ApplicationCommandOptionChoiceData<string>[] {
    return this.commands.map(command => {
      return {
        name: command.name,
        value: command.name
      } 
    });
  }

  private getCommands(): ICommand[] {
    const dir = join(__dirname, '../');
    const categories = files.listFileRecursive(dir);
    const commands = [];

    for (let category of categories) {
      category = category.replace(__dirname, '..');
      const filename = __filename.replace(__dirname + '/', '');

      if (category.includes(filename) === true) {
        continue;
      }
  
      const command = new (require(category).default)();

      if (isICommand(command) === false) {
        continue
      }

      commands.push(command);
    }

    return commands;
  }

  private async listCommand(
    interaction: CommandInteraction<CacheType>
  ) {
    const commands= this.commands.map(command => {
      return {
        name: command.name,
        category: command.category
      }
    });

    const component = new CommandListPageComponent()
        .setMaxLines(10)
        .setMessage(interaction)
        .addContent(commands);
    
    await component.collect();
    await component.reply();
  }

  private async detailCommand(
    interaction: CommandInteraction<CacheType>,
    commandName: string
  ) {
    const command = this.commands.find(command => {
      return command.name == commandName
    });

    if (command === undefined) {
      await interaction.followUp({
        embeds: [ ErrorEmbed.wrong('This command doesn\'t exist') ]
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(commandName)
      .setColor(0x2b2d31)
      .addFields({ name: 'Description', value: command.description });
    
    if (command.extraDescription) {
      embed.addFields({ name: 'Extra description', value: command.extraDescription });
    }
  
    await interaction.followUp({
      embeds: [ embed ]
    });
  }

  async run(
    _bot: Bot,
    message: Message<boolean> | CommandInteraction<CacheType>,
    args: Array<CommandInteractionOption>
  ) {
    const [ subCommand ] = args;
    const options = parseCommandOptions(subCommand);

    const interaction = message as CommandInteraction<CacheType>;

    await interaction.deferReply({ ephemeral: true });

    switch (subCommand.name) {
      case 'list':
        await this.listCommand(interaction);
        break;

      case 'detail':
        await this.detailCommand(interaction, options.name);
        break;
      
      default:
        break;
    }
  }
}
    