import joi from "joi";

/**
 * Joi schema for user registration (sign up).
 * 
 * This schema validates the data for user sign up.
 * 
 * @property {string} email - User's email address. Must be a valid email format and is required.
 * @property {string} password - User's password. Must be at least 3 characters long and is required.
 * @property {string} name - User's name. It is a required field.
 * @property {string} phone - User's phone number. It is a required field.
 */
export const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(3),
  name: joi.string().required(),
  phone: joi.string().required()
});

/**
 * Joi schema for user login (sign in).
 * 
 * This schema validates the data for user sign in.
 * 
 * @property {string} email - User's email address. Must be a valid email format and is required.
 * @property {string} password - User's password. Must be at least 3 characters long and is required.
 */
export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(3),
});
