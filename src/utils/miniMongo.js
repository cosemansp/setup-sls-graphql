import { MongoClient, ObjectId, Collection } from 'mongodb';
import { EventEmitter } from 'events';
import shortid from 'shortid';

import mongodbUri from 'mongodb-uri';

export class MongoUri {
  constructor(uri) {
    this.fullUri = uri;
    const parsed = mongodbUri.parse(uri);
    this.scheme = parsed.scheme;
    this.host = parsed.hosts[0].host;
    this.port = parsed.hosts[0].port;
    this.options = parsed.options;
    this.dbName = parsed.database;
  }

  toString() {
    return this.fullUri;
  }

  static parse(uri) {
    return new MongoUri(uri);
  }
}

const DB_STATES = {
  NotConnected: 1,
  Connecting: 2,
  Connected: 3,
};

//
// Collection helpers
//
Collection.prototype.$findById = function findById(id, options = {}) {
  return this.findOne({ _id: id }, options);
};

Collection.prototype.$findByIdAndUpdate = function findByIdAndUpdate(id, partial) {
  const changes = { ...partial };
  return this.findOneAndUpdate(
    { _id: id },
    { $set: { ...changes } },
    { returnOriginal: false },
  ).then((result) => result.value);
};

Collection.prototype.$insertOne = async function insertOne(obj) {
  const result = await this.insert({ ...obj, _id: shortid.generate() });
  return result.ops[0];
};

Collection.prototype.$findByIdAndDelete = async function findByIdAndDelete(id) {
  const result = await this.findOneAndDelete({ _id: id });
  return result.value;
};

// http://mongodb.github.io/node-mongodb-native/2.1/api/index.html

export class MiniMongo extends EventEmitter {
  connect(uri, dbClient) {
    this.uri = uri;
    if (dbClient && dbClient.serverConfig.isConnected()) {
      this.state = DB_STATES.Connected;
      this.dbClient = dbClient;
      return Promise.resolve(dbClient);
    }
    return this.open();
  }

  bind(name, options) {
    Object.defineProperty(this, name, {
      get() {
        if (!this.dbClient) {
          throw new Error('DB is not connected');
        }
        return this.dbClient.collection(name, options);
      },
    });
  }

  collection(name, options) {
    return this.dbClient.collection(name, options);
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.client) {
        console.log('closing db...');
        this.client.close((err /* result */) => {
          if (err) {
            reject(err);
            return;
          }
          this.emit('closed');
          this.state = DB_STATES.NotConnected;
          this.client = null;
          this.dbClient = null;
          resolve();
        });
        return;
      }

      // no dbClient, so always successfull
      resolve();
    });
  }

  /**
   * Create an ObjectId from a string
   * When id is the wrong format a null is returned
   * @param {string} id
   */
  static createObjectId(id) {
    try {
      return new ObjectId(id);
    } catch (error) {
      return null;
    }
  }

  //
  // private functions
  //
  open() {
    return new Promise((resolve, reject) => {
      if (
        this.state === DB_STATES.Connected &&
        this.dbClient &&
        this.dbClient.serverConfig.isConnected()
      ) {
        console.info('Already connected :)');
        resolve(this.dbClient);
        return;
      }

      if (this.state === DB_STATES.Connecting) {
        this.on('connected', (dbClient) => {
          resolve(dbClient);
        });
        return;
      }

      this.state = DB_STATES.Connecting;
      console.info('Open DB connection...');
      MongoClient.connect(
        this.uri.toString(),
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            console.error('Connect failed', err);
            this.state = DB_STATES.NotConnected;
            this.emit('error', err);
            reject(err);
            return;
          }
          console.info('  Connected');
          this.state = DB_STATES.Connected;
          this.client = client;
          this.dbClient = client.db(this.uri.dbName);
          this.emit('connected', this.dbClient);
          resolve(this.dbClient);
        },
      );
    });
  }
}

export const db = new MiniMongo();
