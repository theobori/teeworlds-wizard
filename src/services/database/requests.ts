import {
  FindCursor,
  Document,
  WithId,
  UpdateResult
} from 'mongodb';

import database from "./database";

class RequestsDatabase {
  static getTopInvites(
    guildId: string,
    limit: number
  ): FindCursor<WithId<Document>> {
    return database.collections['invite']
    .find(
      {
        'guild_id': guildId,
      }
    )
    .limit(limit)
    .sort(
      {
        'invites': -1
      }
    );
  }

  static async updateInviter(
    guildId: string,
    clientId: string
  ): Promise<UpdateResult> {
    return await database.collections['invite']
    .updateOne(
      {
        'guild_id': guildId,
        'client_id': clientId
      },
      {
        '$inc': {
          'invites': 1
        }
      },
      {
        'upsert': true
      }
    );
  }

  static async updateInvited(
    guildId: string,
    clientId: string,
    inviter: string
  ): Promise<UpdateResult> {
    return await database.collections['invite']
    .updateOne(
      {
        'guild_id': guildId,
        'client_id': clientId
      },
      {
        '$set': {
          'invited_by': inviter,
          'invites': 0
        }
      },
      {
        'upsert': true
      }
    );
  }
}

export default RequestsDatabase;
