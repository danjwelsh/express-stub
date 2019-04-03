import { Schema } from "mongoose";
import { getModel } from "../../Models";
import { UserRole } from "../../UserRole";
import { IUser } from "../IUser";
import IBaseMongoResource from "./IBaseMongoResource";

const schemaOptions = {
  timestamps: true
};

/**
 * IMongoUser
 *
 * Outlines a user mongo implementation
 */
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

// Schema for db
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

/**
 * Get a collection the user owns
 *
 * @param {string} collectionName
 * @returns {Promise<Schema.Types.ObjectId[]>}
 */
userSchema.methods.getLinkedCollection = async function(
  collectionName: string
): Promise<Schema.Types.ObjectId[]> {
  const results = await getModel(collectionName).find({ userId: this.getId() });
  return results.map(result => result.getId() as Schema.Types.ObjectId);
};

/**
 * Set a collection the user owns
 *
 * @param {Schema.Types.ObjectId} collection
 * @param {string} collectionName
 * @returns {Promise<void>}
 */
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

/**
 * Get id
 *
 * @returns {Schema.Types.ObjectId}
 */
userSchema.methods.getId = function(): Schema.Types.ObjectId {
  return this._id;
};

/**
 * Get table
 *
 * @returns {string}
 */
userSchema.methods.getTable = (): string => {
  return "user";
};
