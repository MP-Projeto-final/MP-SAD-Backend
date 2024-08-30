import test from 'tape';
import * as authService from '../../src/services/auth.service.js';
import * as authRepository from '../../src/repository/auth.repository.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

test('signUp - Deve lançar um erro se o email já estiver cadastrado', async (t) => {
  authRepository.findUserByEmail = async () => ({ id: 1, email: 'existing@example.com' });
  
  try {
    await authService.signUp('existing@example.com', 'password123', 'Test User');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'Email já cadastrado!', 'Lançou o erro correto');
  }
  
  t.end();
});

test('signUp - Deve criar um novo usuário se o email não estiver cadastrado', async (t) => {
  authRepository.findUserByEmail = async () => null;
  authRepository.createUser = async () => 1;
  bcrypt.hash = async () => 'hashedpassword';

  const result = await authService.signUp('new@example.com', 'password123', 'New User');
  t.equal(result, 1, 'Usuário criado com sucesso');
  t.pass('Usuário criado com sucesso');
  
  t.end();
});

test('signIn - Deve lançar um erro se o email não estiver cadastrado', async (t) => {
  authRepository.findUserByEmail = async () => null;
  
  try {
    await authService.signIn('nonexistent@example.com', 'password123');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'E-mail não cadastrado!', 'Lançou o erro correto');
  }
  
  t.end();
});

test('signIn - Deve lançar um erro se a senha estiver incorreta', async (t) => {
  authRepository.findUserByEmail = async () => ({ id: 1, email: 'existing@example.com', senha: 'hashedpassword' });
  bcrypt.compare = async () => false;

  try {
    await authService.signIn('existing@example.com', 'wrongpassword');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'Senha incorreta!', 'Lançou o erro correto');
  }

  t.end();
});

test('signIn - Deve retornar um token e o nome do usuário se o login for bem-sucedido', async (t) => {
  authRepository.findUserByEmail = async () => ({ id: 1, email: 'existing@example.com', senha: 'hashedpassword', nome: 'Test User' });
  bcrypt.compare = async () => true;
  uuid.mockReturnValue('valid-token');
  authRepository.createSession = async () => 1;

  const result = await authService.signIn('existing@example.com', 'password123');
  t.deepEqual(result, { token: 'valid-token', nome: 'Test User' }, 'Retornou o token e nome corretos');
  t.pass('Login bem-sucedido, retornou token e nome');
  
  t.end();
});

test('logout - Deve remover a sessão do usuário', async (t) => {
  authRepository.logoutUser = async () => 1;

  const result = await authService.logout(1, 'valid-token');
  t.equal(result, 1, 'Sessão removida com sucesso');
  t.pass('Sessão removida com sucesso');

  t.end();
});
