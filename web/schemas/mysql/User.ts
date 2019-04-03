import {
  BaseEntity,
  Column,
  Entity,
  getRepository,
  PrimaryGeneratedColumn
} from "typeorm";
import { UserRole } from "../../UserRole";
import { IUser } from "../IUser";
import IBaseMySQLResource from "./IBaseMySQLResource";

/**
 * User MySQL implementation
 */
@Entity()
export class User extends BaseEntity implements IBaseMySQLResource, IUser {
  @PrimaryGeneratedColumn()
  // tslint:disable-next-line:variable-name
  public _id: number;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column()
  public iv: string;

  @Column("varchar")
  public role: UserRole;

  public getId(): number {
    return this._id;
  }

  public getTable(): string {
    return "user";
  }

  public getUserId(): number {
    return 0;
  }

  /**
   * Get a collection the user owns
   *
   * @param {string} collectionName
   * @returns {Promise<number[]>}
   */
  public async getLinkedCollection(collectionName: string): Promise<number[]> {
    const results: IBaseMySQLResource[] = (await getRepository(
      collectionName
    ).find({ userId: this._id })) as IBaseMySQLResource[];
    return results.map(res => res.getId() as number);
  }

  /**
   * Set a collection the user owns
   *
   * @param {number[]} collection
   * @param {string} collectionName
   * @returns {Promise<void>}
   */
  public setLinkedCollection(
    collection: number[],
    collectionName: string
  ): Promise<void> {
    return undefined;
  }

  /**
   * Convert to a json object for record updating and insertion
   * @returns {{}}
   */
  public toJSONObject(): {} {
    return {
      _id: this._id,
      iv: this.iv,
      password: this.password,
      role: this.role,
      username: this.username
    };
  }
}
