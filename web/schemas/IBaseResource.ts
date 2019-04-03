import { Schema } from "mongoose";

/**
 * Base resource interface
 */
export default interface IBaseResource {
  /**
   * Get the id of the resource
   *
   * @returns {string | number | Schema.Types.ObjectId}
   */
  getId(): string | number | Schema.Types.ObjectId;

  /**
   * Get the resource's table
   *
   * @returns {string}
   */
  getTable(): string;

  /**
   * Get the user's id the resource belongs to
   *
   * @returns {string | number | Schema.Types.ObjectId}
   */
  getUserId(): string | number | Schema.Types.ObjectId;

  /**
   * Convert to JSON
   *
   * @returns {{}}
   */
  toJSONObject(): {};
}
