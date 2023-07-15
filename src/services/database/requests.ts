import {
  FindCursor,
  Document,
  WithId,
  UpdateResult,
  DeleteResult
} from 'mongodb';

import database from "./database";
import { IListener, listenerValues } from '../listener';

function filterFromListener(
  listener: IListener
): {[key: string]: any} {
  let filter = {};

  for (const k of Object.keys(listenerValues)) {
    if (listener[k]) {
      filter[listenerValues[k]] = listener[k];
    }
  }

  return filter;
}

class RequestsDatabase {
  static getListeners(
    listener: IListener
  ): FindCursor<WithId<Document>> {
    return database.collections['listener']
      .find(
        filterFromListener(listener)
      );
  }

  static async updateListener(
    listener: IListener
  ): Promise<UpdateResult> {
    return await database.collections['listener']
      .updateOne(
        {
          'guild_id': listener.guildId,
          'channel_source': listener.channelSource,
          'channel_destination': listener.channelDestination,
          'feature': listener.feature
        },
        {
          '$set': {
            'guild_id': listener.guildId,
            'channel_source': listener.channelSource,
            'channel_destination': listener.channelDestination,
            'feature': listener.feature
          }
        },
        {
          'upsert': true
        }
      );
  }

  static async deleteListener(
    listener: IListener
  ): Promise<DeleteResult> {
    return await database.collections['listener']
      .deleteOne(
        {
          'channel_source': listener.channelSource,
          'channel_destination': listener.channelDestination,
          'feature': listener.feature
        }
      );
  }
}

export default RequestsDatabase;
