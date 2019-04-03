import { Document, Schema } from "mongoose";
import IBaseResource from "../IBaseResource";

/**
 * Mongo interface
 */
export default interface IBaseMongoResource extends Document, IBaseResource {
  _id: number | string | Schema.Types.ObjectId;
}
