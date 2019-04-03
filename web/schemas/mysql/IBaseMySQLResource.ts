import { BaseEntity } from "typeorm";
import IBaseResource from "../IBaseResource";

/**
 * Base mysql resource
 */
export default interface IBaseMySQLResource extends IBaseResource, BaseEntity {}
