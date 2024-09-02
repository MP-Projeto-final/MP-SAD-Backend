import joi from "joi";

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
