import * as mongoose from "mongoose";
import { Mongoose } from "mongoose";
import { Connection, createConnection } from "typeorm";
import { DBType } from "./DBType";
import { User } from "./schemas/mysql/User";

/**
 * Factory for generating database connections.
 */
export class DatabaseFactory {
  /**
   * Get a connection depending on DB_TYPE
   * @returns {Promise<void>}
   */
  public static async getConnection(
    dbType?: DBType
  ): Promise<Mongoose | Connection> {
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
    if (process.env.LOCAL === "true") {
      return await mongoose.connect(process.env.MONGO_URI_LOCAL);
    } else {
      return await mongoose.connect(process.env.MONGO_URI, {
        authdb: "admin",
        dbName: process.env.DB_DATABASE,
        pass: process.env.DB_PASSWORD,
        user: process.env.DB_USERNAME
      });
    }
  }

  /**
   * Connect to mysql
   * @returns {Promise<void>}
   */
  public static async getMySQLConnection(): Promise<Connection> {
    return await createConnection({
      database: process.env.DB_DATABASE,
      entities: [User],
      host: process.env.DB_HOST,
      logging: false,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      synchronize: true,
      type: "mysql",
      username: process.env.DB_USERNAME
    });
  }
}
