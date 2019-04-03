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

  public async getLinkedCollection(collectionName: string): Promise<number[]> {
    const results: IBaseMySQLResource[] = (await getRepository(
      collectionName
    ).find({ userId: this._id })) as IBaseMySQLResource[];
    return results.map(res => res.getId() as number);
  }

  public setLinkedCollection(
    collection: number[],
    collectionName: string
  ): Promise<void> {
    return undefined;
  }

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
