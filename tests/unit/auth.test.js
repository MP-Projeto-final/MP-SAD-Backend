import * as userService from "../../src/services/auth.service.js";
import * as userRepository from "../../src/repository/auth.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { createUser, createToken } from "../factories/auth.factory.js";

jest.mock("../../src/repository/auth.repository.js");
jest.mock("bcrypt");
jest.mock("uuid");

describe("User Service", () => {
  describe("signUp", () => {
    it("deve lançar um erro se o email já estiver cadastrado", async () => {
      const existingUser = createUser(); 
      userRepository.findUserByEmail.mockResolvedValue(existingUser);

      await expect(userService.signUp({ email: existingUser.email, password: "1234", name: "Test" }))
        .rejects
        .toThrow("Email já cadastrado!");
    });

    it("deve criar um novo usuário se o email não estiver cadastrado", async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue();

      const newUser = createUser({ email: "new@example.com", nome: "New User" });

      await userService.signUp({ email: newUser.email, password: "1234", name: newUser.nome });

      expect(userRepository.createUser).toHaveBeenCalledWith(
        newUser.email,
        expect.any(String),
        newUser.nome
      );
    });

    it("deve hash a senha antes de salvar", async () => {
      const password = "1234";
      const hashedPassword = "hashedpassword";
      const newUser = createUser({ email: "new@example.com", nome: "New User" });

      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.findUserByEmail.mockResolvedValue(null);

      await userService.signUp({ email: newUser.email, password, name: newUser.nome });

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        newUser.email,
        hashedPassword,
        newUser.nome
      );
    });
  });

  describe("signIn", () => {
    it("deve lançar um erro se o email não estiver cadastrado", async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(userService.signIn({ email: "nonexistent@example.com", password: "1234" }))
        .rejects
        .toThrow("E-mail não cadastrado!");
    });

    it("deve lançar um erro se a senha estiver incorreta", async () => {
      const user = createUser();
      userRepository.findUserByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.signIn({ email: user.email, password: "wrongpassword" }))
        .rejects
        .toThrow("Senha incorreta!");
    });

    it("deve retornar um token e o nome do usuário se o login for bem-sucedido", async () => {
      const user = createUser();
      const token = createToken();
      userRepository.findUserByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      uuid.mockReturnValue(token);

      const result = await userService.signIn({ email: user.email, password: "1234" });

      expect(result).toEqual({ token, username: user.nome });
      expect(userRepository.createSession).toHaveBeenCalledWith(token, user.id);
    });
  });

  describe("logout", () => {
    it("deve remover a sessão do usuário", async () => {
      const userId = 1;
      const token = createToken();

      await userService.logout(userId, token);

      expect(userRepository.logoutUser).toHaveBeenCalledWith(userId, token);
    });
  });
});
