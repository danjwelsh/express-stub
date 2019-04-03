import { BaseEntity } from "typeorm";
import IBaseResource from "../IBaseResource";

export default interface IBaseMySQLResource extends IBaseResource, BaseEntity {}
