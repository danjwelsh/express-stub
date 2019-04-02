import * as mongoose from "mongoose";
import {createConnection} from "typeorm";
import {User} from "./schemas/mysql/User";

export class DatabaseFactory {
  static async getConnection(): Promise<void> {
    switch (process.env.DB_TYPE) {
      case 'MONGO':
        await this.getMongoConnection();
        break;
      case 'MYSQL':
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
      host: "localhost",
      port: 3306,
      username: "root",
      password: "admin",
      database: "test",
      entities: [
        User
      ],
      synchronize: true,
      logging: false
    });
  }
}
