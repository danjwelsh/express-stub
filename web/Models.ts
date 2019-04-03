import { Model, model } from "mongoose";
import { IMongoUser, userSchema } from "./schemas/mongo/IMongoUser";
import IBaseMongoResource from "./schemas/mongo/IBaseMongoResource";

// Export Models
export default {
  User: model<IMongoUser>("IMongoUser", userSchema)
};

export function getModel(t: string): Model<IBaseMongoResource> {
  switch (t) {
    case "user":
      return model<IMongoUser>("IMongoUser", userSchema);
    default:
      return null;
  }
}
