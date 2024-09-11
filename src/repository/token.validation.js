import { db } from "../database.js";

/**
 * Finds a user by their session token.
 * 
 * This function retrieves user details based on the provided token. It joins the `usuarios` table with the `sessions` table
 * to match the token and return the user's ID, name, and email.
 * 
 * @param {string} token - The session token associated with the user.
 * @returns {Object|null} - Returns an object containing user details (ID, name, email) if a matching token is found, otherwise returns null.
 */
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
