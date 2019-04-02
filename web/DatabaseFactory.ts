import * as mongoose from "mongoose";
import {Connection, createConnection} from "typeorm";
import {User} from "./schemas/mysql/User";
import {DBType} from "./DBType";
import {Mongoose} from "mongoose";

/**
 * Factory for generating database connections.
 */
export class DatabaseFactory {
  /**
   * Get a connection depending on DB_TYPE
   * @returns {Promise<void>}
   */
  static async getConnection(dbType?: DBType): Promise<void> {
    const type: string = dbType ? dbType : process.env.DB_TYPE;

    switch (type) {
      case DBType.Mongo:
        await this.getMongoConnection();
        break;
      case DBType.MySQL:
        await this.getMySQLConnection();
        break;
      default:
        await this.getMongoConnection();
    }
  }

  /**
   * Connect to mongo
   * @returns {Promise<void>}
   */
  public static async getMongoConnection(): Promise<Mongoose> {
    /**
     * Skip auth if in development.
     */
    if (process.env.LOCAL === 'true') {
      return await mongoose.connect(process.env.MONGO_URI_LOCAL);
    } else {
      return await mongoose.connect(process.env.MONGO_URI, {
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASS,
        dbName: process.env.MONGODB_DATABASE,
        authdb: 'admin',
      });
    }
  }

  /**
   * Connect to mysql
   * @returns {Promise<void>}
   */
  public static async getMySQLConnection(): Promise<Connection> {
    return await createConnection({
      type: "mysql",
      host: "mysql",
      port: 3306,
      username: "root",
      password: "secret",
      database: "stub",
      entities: [
        User
      ],
      synchronize: true,
      logging: false
    });
  }
}
