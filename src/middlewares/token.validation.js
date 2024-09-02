import { findUserByToken } from "../repository/token.validation.js";

export async function tokenValidation(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).send('Token inválido.');
    }
  
    try {
      const user = await findUserByToken(token);
  
      if (!user) {
        return res.status(404).send('Usuário não encontrado.');
      }
  
      console.log("Usuário autenticado com ID:", user.id);
      res.locals.user = user;  
      next();
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }