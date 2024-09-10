import { db } from "../database.js";

export async function findUserByToken(token) {
    const query = `
      SELECT usuarios.id AS user_id, usuarios.nome, usuarios.email
      FROM usuarios
      JOIN sessions ON usuarios.id = sessions.id_usuario
      WHERE sessions.token = $1;
    `;
    const values = [token];
    const result = await db.query(query, values);
  
    if (result.rows.length > 0) {
      return {
        id: result.rows[0].user_id,  
        nome: result.rows[0].nome,
        email: result.rows[0].email,
      };
    }
    return null;
  }