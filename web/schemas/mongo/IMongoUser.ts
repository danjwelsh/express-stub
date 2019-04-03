import { Schema } from "mongoose";
import { getModel } from "../../Models";
import { UserRole } from "../../UserRole";
import { IUser } from "../IUser";
import IBaseMongoResource from "./IBaseMongoResource";

const schemaOptions = {
  timestamps: true
};

export interface IMongoUser extends IBaseMongoResource, IUser {
  username: string;
  password: string;
  iv: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  getLinkedCollection(collectionName: string): Promise<Schema.Types.ObjectId[]>;
  setLinkedCollection(
    collection: Schema.Types.ObjectId[],
    collectionName: string
  ): Promise<void>;

  getId(): Schema.Types.ObjectId;
  getTable(): string;
  toJSONObject(): {};
}

export const userSchema = new Schema(
  {
    iv: {
      required: true,
      type: String
    },
    password: {
      required: true,
      type: String
    },
    role: {
      default: UserRole.USER,
      enum: [UserRole.ADMIN, UserRole.USER],
      type: String
    },
    username: {
      index: true,
      required: true,
      type: String,
      unique: true
    }
  },
  schemaOptions
);

userSchema.methods.getLinkedCollection = async function(
  collectionName: string
): Promise<Schema.Types.ObjectId[]> {
  const results = await getModel(collectionName).find({ userId: this.getId() });
  return results.map(result => result.getId() as Schema.Types.ObjectId);
};

userSchema.methods.setLinkedCollection = async function(
  collection: Schema.Types.ObjectId,
  collectionName: string
): Promise<void> {
  switch (collectionName) {
    // set collections here
    default:
      break;
  }

  await this.save();
};

userSchema.methods.getId = function(): Schema.Types.ObjectId {
  return this._id;
};

userSchema.methods.getTable = (): string => {
  return "user";
};
