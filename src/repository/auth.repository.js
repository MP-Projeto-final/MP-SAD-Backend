import { db } from "../database.js";

export async function findUserByEmail(email) {
  const query = 'SELECT * FROM Usuarios WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function createUser(email, hashedPassword, name) {
  const query = 'INSERT INTO Usuarios (email, senha, nome) VALUES ($1, $2, $3) RETURNING *';
  const values = [email, hashedPassword, name];
  const result = await db.query(query, values);
  return result.rows[0]; 
}

export async function createSession(token, userId) {
  const query = 'INSERT INTO Sessions (token, id_usuario) VALUES ($1, $2) RETURNING *';
  const values = [token, userId];
  const result = await db.query(query, values);
  return result.rows[0]; // Ajustado para retornar a sessão criada
}

export async function logoutUser(userId, token) {
  const query = 'DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2 RETURNING *';
  const values = [userId, token];
  const result = await db.query(query, values);
  return result.rows[0]; // Ajustado para retornar a sessão deletada
}

export async function findUserByToken(token) {
  const query = `
    SELECT Usuarios.id, Usuarios.nome, Usuarios.email
    FROM Usuarios
    JOIN Sessions ON Usuarios.id = Sessions.id_usuario
    WHERE Sessions.token = $1
  `;
  const values = [token];
  const result = await db.query(query, values);
  return result.rows[0]; 
}
