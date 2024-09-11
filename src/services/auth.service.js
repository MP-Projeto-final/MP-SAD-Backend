import * as userRepository from "../repository/auth.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

/**
 * Registers a new user with the provided details.
 * 
 * This function first checks if the email is already registered. If not, it hashes the provided password
 * and creates a new user in the database.
 * 
 * @param {string} email - The email address of the user. It must be unique.
 * @param {string} name - The name of the user.
 * @param {string} password - The password of the user. It will be hashed before saving.
 * @param {string} phone - The phone number of the user.
 * 
 * @throws {Error} Throws an error if the email is already registered. The error will have a status of 409.
 */
export async function signUp(email, name, password, phone) {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    const error = new Error("Email já cadastrado!");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userRepository.createUser(email, hashedPassword, name, phone);
}

/**
 * Logs in a user with the provided email and password.
 * 
 * This function checks if the user exists and if the provided password matches the hashed password in the database.
 * If the credentials are correct, it creates a session and returns a token.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Object} Returns an object containing the token, userId, and username.
 * 
 * @throws {Error} Throws an error if the email is not registered (404) or if the password is incorrect (401).
 */
export async function signIn(email, password) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("E-mail não cadastrado!");
    error.status = 404;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.senha);
  if (!isPasswordCorrect) {
    const error = new Error("Senha incorreta!");
    error.status = 401;
    throw error;
  }

  const token = uuid();
  await userRepository.createSession(token, user.id);

  console.log("Usuário logado com sucesso, ID do usuário:", user.id);
  return { token, userId: user.id, username: user.nome }
}

/**
 * Logs out a user by invalidating their session.
 * 
 * This function removes the session associated with the given userId and token from the database.
 * 
 * @param {number} userId - The ID of the user to log out.
 * @param {string} token - The session token to invalidate.
 */
export async function logout(userId, token) {
  await userRepository.logoutUser(userId, token);
}
