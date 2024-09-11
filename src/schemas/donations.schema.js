import joi from "joi";

/**
 * Joi schema for creating a donation.
 * 
 * This schema validates the data for creating a new donation.
 * 
 * @property {string} descricao - Description of the donation. Must be a string with a maximum length of 300 characters and is required.
 * @property {string} destino_cep - Destination ZIP code. Must be a string with exactly 8 characters and is required.
 * @property {string} destino_rua - Destination street. Must be a string with a maximum length of 255 characters and is required.
 * @property {string} destino_numero - Destination number. Must be a string with a maximum length of 50 characters and is required.
 * @property {string} [destino_complemento] - Destination complement. Optional field that can be a string with a maximum length of 255 characters or an empty string.
 * @property {string} destino_bairro - Destination neighborhood. Must be a string with a maximum length of 255 characters and is required.
 * @property {string} destino_cidade - Destination city. Must be a string with a maximum length of 255 characters and is required.
 * @property {string} destino_estado - Destination state. Must be a string with exactly 2 characters (usually an abbreviation) and is required.
 */
export const createDonationSchema = joi.object({
  descricao: joi.string().max(300).required(),  
  destino_cep: joi.string().length(8).required(), 
  destino_rua: joi.string().max(255).required(),  
  destino_numero: joi.string().max(50).required(), 
  destino_complemento: joi.string().max(255).optional().allow(""),  
  destino_bairro: joi.string().max(255).required(),  
  destino_cidade: joi.string().max(255).required(),  
  destino_estado: joi.string().length(2).required(),  
});
