import {Document, Schema} from 'mongoose';
import IBaseResource from "../IBaseResource";

export default interface IBaseMongoResource extends Document, IBaseResource {
  _id: number | string | Schema.Types.ObjectId;
}
