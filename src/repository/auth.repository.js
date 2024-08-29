import { db } from "../database/database.js";

export async function findUserByEmail(email) {
  const query = 'SELECT * FROM Usuarios WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function createUser(email, hashedPassword, name) {
  const query = 'INSERT INTO Usuarios (email, senha, nome) VALUES ($1, $2, $3)';
  const values = [email, hashedPassword, name];
  await db.query(query, values);
}

export async function createSession(token, userId) {
  const query = 'INSERT INTO Sessions (token, id_usuario) VALUES ($1, $2)';
  const values = [token, userId];
  await db.query(query, values);
}

export async function logoutUser(userId, token) {
  const query = 'DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2';
  const values = [userId, token];
  await db.query(query, values);
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
