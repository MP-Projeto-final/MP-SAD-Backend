import * as userRepository from "../repository/auth.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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
  return { token, username: user.nome };
}

export async function logout(userId, token) {
  await userRepository.logoutUser(userId, token);
}
