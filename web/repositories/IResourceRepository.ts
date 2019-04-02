import { Schema } from 'mongoose';
import IBaseResource from "../schemas/IBaseResource";

/**
 * Interface for resource controllers.
 * All controllers for all dbs should implement this if they manage a resource.
 */
export interface IResourceRepository<T extends IBaseResource> {
  get(id: Schema.Types.ObjectId | string | number): Promise<T>;
  getAll(): Promise<T[]>;
  edit(id: Schema.Types.ObjectId | string | number, data: any): Promise<T>;
  store(data: any): Promise<T>;
  destroy(id: Schema.Types.ObjectId | string | number): Promise<void>;

  findOneWithFilter(filter: {}): Promise<T>;
  findManyWithFilter(filter: {}, options?: {
    limit: number,
    skip: number,
  }): Promise<T[]>;

  getCount(filter: {}): Promise<number>;

  setTableName(table: string): void;
  getTableName(): string;
}
