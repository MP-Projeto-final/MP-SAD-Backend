import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(3),
  name: joi.string().required(),
  phone: joi.string().required()
});

export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(3),
});