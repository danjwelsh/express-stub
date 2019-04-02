import * as mongoose from "mongoose";
import {createConnection} from "typeorm";
import {User} from "./schemas/mysql/User";
import {DBType} from "./DBType";

/**
 * Factory for generating database connections.
 */
export class DatabaseFactory {
  /**
   * Get a connection depending on DB_TYPE
   * @returns {Promise<void>}
   */
  static async getConnection(): Promise<void> {
    switch (process.env.DB_TYPE) {
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
  private static async getMongoConnection(): Promise<void> {
    /**
     * Skip auth if in development.
     */
    if (process.env.LOCAL === 'true') {
      await mongoose.connect(process.env.MONGO_URI_LOCAL);
    } else {
      await mongoose.connect(process.env.MONGO_URI, {
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
  private static async getMySQLConnection(): Promise<void> {
    await createConnection({
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
