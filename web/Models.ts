import { Model, model } from 'mongoose';
import { User, userSchema } from './schemas/mongo/User';
import IBaseMongoResource from './schemas/mongo/IBaseMongoResource';

// Export Models
export default {
  User: model<User>(
    'User', userSchema,
  ),
};

export function getModel(t: string): Model<IBaseMongoResource> {
  switch (t) {
    case 'user':
      return model<User>(
        'User', userSchema,
      );
    default:
      return null;
  }
}
