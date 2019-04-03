import { Schema } from "mongoose";
import { UserRole } from "../UserRole";

/**
 * Interface for a user.
 */
export interface IUser {
  _id: number | string | Schema.Types.ObjectId;
  username: string;
  password: string;
  iv: string;
  role: UserRole;

  getId(): number | string | Schema.Types.ObjectId;
  getTable(): string;
  getUserId(): number | string | Schema.Types.ObjectId;

  getLinkedCollection(
    collectionName: string
  ): Promise<Schema.Types.ObjectId[] | number[]>;
  setLinkedCollection(
    collection: Array<Schema.Types.ObjectId | number>,
    collectionName: string
  ): Promise<void>;

  toJSONObject(): {};
}
