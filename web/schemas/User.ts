import { Schema } from 'mongoose';
import IBaseMongoResource from './IBaseMongoResource';
import { UserRole } from '../UserRole';

const schemaOptions = {
  timestamps: true,
};

export interface IUser extends IBaseMongoResource {
  username: string;
  password: string;
  iv: string;
  devices: Schema.Types.ObjectId[];
  media: Schema.Types.ObjectId[];
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  getLinkedCollection(collectionName: string): Schema.Types.ObjectId[];
  setLinkedCollection(collection: Schema.Types.ObjectId[], collectionName: string): Promise<void>;

  getId(): Schema.Types.ObjectId;
  getTable(): string;
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
  function (collectionName: string): Schema.Types.ObjectId[] {
    switch (collectionName) {
      case 'devices':
        return this.devices;
      case 'media':
        return this.media;
      default:
        return [];
    }
  };

userSchema.methods.setLinkedCollection =
  async function (collection: Schema.Types.ObjectId, collectionName: string): Promise<void> {
    switch (collectionName) {
      case 'devices':
        this.devices = collection;
        break;
      case 'media':
        this.media = collection;
        break;
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
