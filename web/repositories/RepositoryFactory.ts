import IBaseMongoResource from '../schemas/mongo/IBaseMongoResource';
import { User as MongoUser } from '../schemas/mongo/User';
import { IResourceRepository } from './IResourceRepository';
import { MongoResourceRepository } from './MongoResourceRepository';
import {MySQLResourceRepository} from "./MySQLResourceRepository";
import IBaseMySQLResource from "../schemas/mysql/IBaseMySQLResource";
import {User as MySQLUser} from "../schemas/mysql/User";
import {BaseEntity} from "typeorm";

/**
 * Generate a controller for the type of database
 */
export default class RepositoryFactory {

  /**
   * Determine database type and return fitting controller.
   * @param {string} resName
   * @returns {IResourceRepository<IBaseMongoResource | any>}
   */
  public static getRepository(resName: string): IResourceRepository<IBaseMongoResource | any> {
    switch (process.env.DB_TYPE) {
      case 'MONGO':
        return RepositoryFactory.getMongoRepository(resName);
      case 'MYSQL':
        return RepositoryFactory.getMySQLRepository(resName);
      default:
        return RepositoryFactory.getMongoRepository(resName);
    }
  }

  /**
   * Determine table and return controller for that table.
   * @param {string} res
   * @returns {MongoResourceRepository<IBaseMongoResource>}
   */
  private static getMongoRepository(res: string): MongoResourceRepository<IBaseMongoResource> {
    let repository: MongoResourceRepository<IBaseMongoResource>;

    switch (res) {
      case 'user':
        repository = new MongoResourceRepository<MongoUser>();
        break;
      default:
        repository = new MongoResourceRepository<IBaseMongoResource>();
        break;
    }

    repository.setTableName(res);
    return repository;
  }

  /**
   * Get a MySQL repo for the resource.
   * @param {string} res
   * @returns {MySQLResourceRepository<IBaseMySQLResource>}
   */
  private static getMySQLRepository(res: string): MySQLResourceRepository<IBaseMySQLResource> {
    let repository: MySQLResourceRepository<IBaseMySQLResource>;

    switch (res) {
      case 'user':
        repository = new MySQLResourceRepository<MySQLUser>(MySQLUser);
        break;
      default:
        repository = new MySQLResourceRepository<IBaseMySQLResource>(BaseEntity);
        break;
    }

    repository.setTableName(res);
    return repository;
  }
}
