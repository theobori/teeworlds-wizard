import {
  Client,
  ClientOptions,
  Collection
} from 'discord.js';
import { join } from 'path';

import { CommandError, EventError } from './errors';
import ICommand, { isICommand } from './command';

import { files } from './utils/files';

import database from "./services/database/database";

export default class Bot extends Client {
  private readonly commandsDir: string = 'commands/';
  private readonly eventsDir: string = 'events/';

  commands: Collection<string, ICommand> = new Collection();
  invites: Collection<string, Collection<string, number>> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    // Connecting to the database
    database.createConnection();

    // Loading commands and events
    this.loadCommands();
    this.loadEvents();
  }

  private loadCommands() {
    const dir = join(__dirname, this.commandsDir);
    const categories = files.listFileRecursive(dir);
    
    for (let category of categories) {
      // Relative path for `require`
      category = category.replace(__dirname, '.');

      const command = new (require(category).default)();

      if (isICommand(command) === false) {
        throw new CommandError(
          'This class doesn\'t implement ICommand'
        );
      }

      // Adding the command to the collection
      this.commands.set(command.name, command);
    }
  }

  private loadEvents() {
    // There are no categories for events handling
    const dir = join(__dirname, this.eventsDir);
    const events = files.list(dir);

    for (const filename of events) {
      const path = './' + this.eventsDir + filename;
      const event = require(path).default;

      if (typeof event !== 'function') {
        throw new EventError(
          'Event has to be a function'
        );
      }

      // Event Name
      const name = filename.split('.')[0];

      // 'Mapping' the event function
      this.on(
        name,
        (...args) => event(this, ...args)
      );
    }
  }
}
