import { Model, model } from 'mongoose';
import { IUser, userSchema } from './schemas/User';
import IBaseMongoResource from './schemas/IBaseMongoResource';

// Export Models
export default {
  User: model<IUser>(
    'User', userSchema,
  ),
};

export function getModel(t: string): Model<IBaseMongoResource> {
  switch (t) {
    case 'user':
      return model<IUser>(
        'User', userSchema,
      );
    default:
      return null;
  }
}
