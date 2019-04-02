import {BaseEntity, Column, Entity, getRepository, PrimaryGeneratedColumn} from "typeorm";
import IBaseMySQLResource from "./IBaseMySQLResource";
import {UserRole} from "../../UserRole";
import {IUser} from "../IUser";

@Entity()
export class User extends BaseEntity implements IBaseMySQLResource, IUser {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  iv: string;

  @Column('varchar')
  role: UserRole;

  getId(): number {
    return this._id;
  }

  getTable(): string {
    return 'user';
  }

  getUserId(): number {
    return 0;
  }

  async getLinkedCollection(collectionName: string): Promise<number[]> {
    const results: IBaseMySQLResource[] = await getRepository(collectionName).find({userId : this._id}) as IBaseMySQLResource[];
    return results.map(res => res.getId() as number);
  }

  setLinkedCollection(collection: number[], collectionName: string): Promise<void> {
    return undefined;
  }
}
