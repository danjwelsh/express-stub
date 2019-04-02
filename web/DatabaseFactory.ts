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
  static async getConnection(dbType?: DBType): Promise<Mongoose | Connection> {
    const type: string = dbType ? dbType : process.env.DB_TYPE;

    switch (type) {
      case DBType.Mongo:
        return await this.getMongoConnection();
      case DBType.MySQL:
        return await this.getMySQLConnection();
      default:
        return await this.getMongoConnection();
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
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
        dbName: process.env.DB_DATABASE,
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User
      ],
      synchronize: true,
      logging: false
    });
  }
}
