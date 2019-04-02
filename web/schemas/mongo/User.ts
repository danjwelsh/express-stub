import { Schema} from 'mongoose';
import { UserRole } from '../../UserRole';
import IBaseMongoResource from "./IBaseMongoResource";
import {IUser} from "../IUser";
import {getModel} from "../../Models";

const schemaOptions = {
  timestamps: true,
};

export interface User extends IBaseMongoResource, IUser {
  username: string;
  password: string;
  iv: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  getLinkedCollection(collectionName: string): Promise<Schema.Types.ObjectId[]>;
  setLinkedCollection(collection: Schema.Types.ObjectId[], collectionName: string): Promise<void>;

  getId(): Schema.Types.ObjectId;
  getTable(): string;
  toObject(): {};
}

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  role: {
    default: UserRole.USER,
    enum: [
      UserRole.ADMIN,
      UserRole.USER,
    ],
    type: String,
  },
},                                   schemaOptions);

userSchema.methods.getLinkedCollection =
  async function (collectionName: string): Promise<Schema.Types.ObjectId[]> {
    const results = await getModel(collectionName).find({userId: this.getId()})
    return results.map(result => result.getId() as Schema.Types.ObjectId);
  };

userSchema.methods.setLinkedCollection =
  async function (collection: Schema.Types.ObjectId, collectionName: string): Promise<void> {
    switch (collectionName) {
      // set collections here
      default:
        break;
    }

    await this.save();
  };

userSchema.methods.getId = function (): Schema.Types.ObjectId {
  return this._id;
};

userSchema.methods.getTable = function (): string {
  return 'user';
};
