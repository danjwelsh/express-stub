import {getManager, ObjectType} from 'typeorm';
import {IResourceRepository} from "./IResourceRepository";
import IBaseMySQLResource from "../schemas/mysql/IBaseMySQLResource";

/**
 * Generic controller for resource of type T, must extend typeorm.BaseEntity.
 */
export class MySQLResourceRepository<T extends IBaseMySQLResource> implements IResourceRepository<T>{
  private type: ObjectType<T>;
  private table: string;

  constructor(type: ObjectType<T>) {
    this.type = type;
  }

  /**
   * Get the resource by id.
   * @param {number} id
   * @returns {Promise<T: BaseEntity>}
   */
  async get(id: number): Promise<T> {
    return await getManager().getRepository(this.type).findOne(id) as T;
  }

  /**
   * Get all instances of resource.
   * Get all entities
   * @returns {Promise<T[]: BaseEntity[]>}
   */
  async getAll(): Promise<T[]> {
    return await getManager().getRepository(this.type).find() as T[];
  }

  /**
   * Destroy the resource.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async destroy(id: number): Promise<void> {
    const entity: T = await this.get(id);
    if (entity) {
      await entity.remove();
    }
  }

  /**
   * Update a record
   * @param {number} id
   * @param data
   * @returns {Promise<T>}
   */
  async edit(id: number, data: any): Promise<T> {
    let entity: T = await this.get(id);
    const objEntity: any = {
      id: entity.getId(),
    };

    Object.keys(data).forEach((key: string) => {
      objEntity[key] = data[key];
    });

    entity = objEntity as T;
    entity = await entity.save();

    return entity;
  }

  async findManyWithFilter(filter: {}, options?: { limit: number; skip: number }): Promise<T[]> {
    const queries: string[] = [];
    Object.keys(filter).forEach((key: string) => {
      queries.push(`${this.getTableName()}.${key} = :${key}`);
    });

    const whereQuery = queries.join(" AND ");

    if (options) {
      return await getManager()
        .getRepository(this.type)
        .createQueryBuilder(this.getTableName())
        .where(whereQuery, filter)
        .take(options.limit)
        .skip(options.skip)
        .getMany() as T[];
    }

    return await getManager()
      .getRepository(this.type)
      .createQueryBuilder(this.getTableName())
      .where(whereQuery, filter)
      .getMany() as T[];
  }

  async findOneWithFilter(filter: {}): Promise<T> {
    const queries: string[] = [];
    Object.keys(filter).forEach((key: string) => {
      queries.push(`${this.getTableName()}.${key} = :${key}`);
    });

    const whereQuery = queries.join(" AND ");

    return await getManager()
      .getRepository(this.type)
      .createQueryBuilder(this.getTableName())
      .where(whereQuery, filter)
      .getOne() as T;
  }

  async getCount(filter: {}): Promise<number> {
    const queries: string[] = [];
    Object.keys(filter).forEach((key: string) => {
      queries.push(`${this.getTableName()}.${key} = :${key}`);
    });

    const whereQuery = queries.join(" AND ");

    return await getManager()
      .getRepository(this.type)
      .createQueryBuilder(this.getTableName())
      .where(whereQuery, filter)
      .getCount();
  }

  getTableName(): string {
    return this.table;
  }

  setTableName(table: string): void {
    this.table = table;
  }

  async store(data: any): Promise<T> {
    let entity: T = data as T;
    entity = await entity.save();
    return entity;
  }
}
