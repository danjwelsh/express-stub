import { getManager, ObjectType } from "typeorm";
import IBaseMySQLResource from "../schemas/mysql/IBaseMySQLResource";
import { UserRole } from "../UserRole";
import { IResourceRepository } from "./IResourceRepository";

/**
 * Generic controller for resource of type T, must extend typeorm.BaseEntity.
 */
export class MySQLResourceRepository<T extends IBaseMySQLResource>
  implements IResourceRepository<T> {
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
  public async get(id: number): Promise<T> {
    return (await getManager()
      .getRepository(this.type)
      .findOne(id)) as T;
  }

  /**
   * Get all instances of resource.
   * Get all entities
   * @returns {Promise<T[]: BaseEntity[]>}
   */
  public async getAll(): Promise<T[]> {
    return (await getManager()
      .getRepository(this.type)
      .find()) as T[];
  }

  /**
   * Destroy the resource.
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async destroy(id: number): Promise<void> {
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
  public async edit(id: number, data: any): Promise<T> {
    const entity: T = await this.get(id);
    const entObj: any = entity.toJSONObject();

    Object.keys(data).forEach((key: string) => {
      entObj[key] = data[key];
    });

    return await getManager()
      .getRepository(this.type)
      .save(entObj);
  }

  public async findManyWithFilter(
    filter: {},
    options?: { limit: number; skip: number }
  ): Promise<T[]> {
    const queries: string[] = [];
    Object.keys(filter).forEach((key: string) => {
      queries.push(`${this.getTableName()}.${key} = :${key}`);
    });

    const whereQuery = queries.join(" AND ");

    if (options) {
      return (await getManager()
        .getRepository(this.type)
        .createQueryBuilder(this.getTableName())
        .where(whereQuery, filter)
        .take(options.limit)
        .skip(options.skip)
        .getMany()) as T[];
    }

    return (await getManager()
      .getRepository(this.type)
      .createQueryBuilder(this.getTableName())
      .where(whereQuery, filter)
      .getMany()) as T[];
  }

  public async findOneWithFilter(filter: {}): Promise<T> {
    const queries: string[] = [];
    Object.keys(filter).forEach((key: string) => {
      queries.push(`${this.getTableName()}.${key} = :${key}`);
    });

    const whereQuery = queries.join(" AND ");

    return (await getManager()
      .getRepository(this.type)
      .createQueryBuilder(this.getTableName())
      .where(whereQuery, filter)
      .getOne()) as T;
  }

  public async getCount(filter: {}): Promise<number> {
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

  public getTableName(): string {
    return this.table;
  }

  public setTableName(table: string): void {
    this.table = table;
  }

  public async store(data: any): Promise<T> {
    let entity: T;
    data.role = UserRole.USER;

    try {
      entity = await getManager()
        .getRepository(this.type)
        .save(data);
    } catch (e) {
      throw e;
    }
    return entity;
  }
}
