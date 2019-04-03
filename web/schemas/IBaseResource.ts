import { Schema } from "mongoose";

export default interface IBaseResource {
  getId(): string | number | Schema.Types.ObjectId;
  getTable(): string;
  getUserId(): string | number | Schema.Types.ObjectId;
  toJSONObject(): {};
}
