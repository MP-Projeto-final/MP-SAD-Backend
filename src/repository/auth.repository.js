import { db } from "../database.js";

/**
 * Finds a user in the database using the provided email.
 * 
 * @param {string} email - The email of the user to be found.
 * @returns {Object|null} - Returns the first user found or null if no user is found.
 */
export async function findUserByEmail(email) {
  const query = 'SELECT * FROM Usuarios WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

/**
 * Creates a new user in the database with the provided email, hashed password, and name.
 * 
 * @param {string} email - The user's email.
 * @param {string} hashedPassword - The user's password, already hashed.
 * @param {string} name - The user's name.
 * @returns {Object} - Returns the created user object.
 */
export async function createUser(email, hashedPassword, name) {
  const query = 'INSERT INTO Usuarios (email, senha, nome) VALUES ($1, $2, $3) RETURNING *';
  const values = [email, hashedPassword, name];
  const result = await db.query(query, values);
  return result.rows[0]; 
}

/**
 * Creates a new session in the database with the provided token and user ID.
 * 
 * @param {string} token - The session token.
 * @param {number} userId - The ID of the user associated with the session.
 * @returns {Object} - Returns the created session object.
 */
export async function createSession(token, userId) {
  const query = 'INSERT INTO Sessions (token, id_usuario) VALUES ($1, $2) RETURNING *';
  const values = [token, userId];
  const result = await db.query(query, values);
  return result.rows[0]; 
}

/**
 * Logs out a user by deleting the session associated with the given user ID and token.
 * 
 * @param {number} userId - The ID of the user.
 * @param {string} token - The session token.
 * @returns {Object|null} - Returns the deleted session object or null if no session is found.
 */
export async function logoutUser(userId, token) {
  const query = 'DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2 RETURNING *';
  const values = [userId, token];
  const result = await db.query(query, values);
  return result.rows[0]; 
}

/**
 * Finds a user in the database using the provided session token.
 * 
 * @param {string} token - The session token.
 * @returns {Object|null} - Returns the user object if the token is valid, or null if no user is found.
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
