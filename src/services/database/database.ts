import 'dotenv/config';
import { MongoClient, Collection, Document, Db } from 'mongodb';

import { DBError } from '../../errors';

import { Logger } from "../../services/logs";

interface IConnection {
  client: MongoClient;
  db: Db;
  collections: Record<string, Collection<Document>>
}

export default class Mongo {
  private static conn?: IConnection = undefined;

  static createConnection(): IConnection {
    if (Mongo.conn) {
      return Mongo.conn;
    }

    try {
      const client = new MongoClient(process.env.MONGO);
      const db = client.db(process.env.DATABASE);
      const collections = {
        'listener': db.collection('listener')
      };

      Mongo.conn = { client, db, collections };

      Logger.info("[+] Connection to the database created");

      return Mongo.conn;
    } catch (error) {
        throw new DBError(error);
    }
  }

  static closeConnection() {
    this.conn.client.close();
  }

  static get collections(): Record<string, Collection<Document>> {
    return this.conn.collections;
  }
}
