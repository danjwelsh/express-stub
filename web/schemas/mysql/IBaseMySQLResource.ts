import IBaseResource from "../IBaseResource";
import {BaseEntity} from "typeorm";

export default interface IBaseMySQLResource extends IBaseResource, BaseEntity {}
