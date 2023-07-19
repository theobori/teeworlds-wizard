import { Logger } from './services/logs';

abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;

    Logger.error(message);
  }
}

export class CommandError extends BaseError { };
export class EventError extends BaseError { };
export class DBError extends BaseError { };
export class AssetError extends BaseError { };

export class FileError extends BaseError { };
