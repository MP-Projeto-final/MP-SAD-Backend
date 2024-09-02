import test from 'tape';
import * as authService from '../../src/services/auth.service.js';
import * as authRepository from '../../src/repository/auth.repository.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import sinon from 'sinon';

const authRepositoryProxy = new Proxy(authRepository, {
  get(target, prop) {
    return sinon.stub(target, prop);
  }
});

const bcryptProxy = new Proxy(bcrypt, {
  get(target, prop) {
    return sinon.stub(target, prop);
  }
});

const uuidProxy = new Proxy(uuid, {
  get(target, prop) {
    return sinon.stub(target, prop);
  }
});

test('signUp - Deve lançar um erro se o email já estiver cadastrado', async (t) => {
  authRepositoryProxy.findUserByEmail.resolves({ id: 1, email: 'existing@example.com' });
  
  try {
    await authService.signUp('existing@example.com', 'password123', 'Test User');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'Email já cadastrado!', 'Lançou o erro correto');
  }

  authRepositoryProxy.findUserByEmail.restore();
  t.end();
});

test('signUp - Deve criar um novo usuário se o email não estiver cadastrado', async (t) => {
  authRepositoryProxy.findUserByEmail.resolves(null);
  authRepositoryProxy.createUser.resolves(1);
  bcryptProxy.hash.resolves('hashedpassword');

  const result = await authService.signUp('new@example.com', 'password123', 'New User');
  t.equal(result, 1, 'Usuário criado com sucesso');

  authRepositoryProxy.findUserByEmail.restore();
  authRepositoryProxy.createUser.restore();
  bcryptProxy.hash.restore();
  
  t.end();
});

test('signIn - Deve lançar um erro se o email não estiver cadastrado', async (t) => {
  authRepositoryProxy.findUserByEmail.resolves(null);
  
  try {
    await authService.signIn('nonexistent@example.com', 'password123');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'E-mail não cadastrado!', 'Lançou o erro correto');
  }

  authRepositoryProxy.findUserByEmail.restore();
  t.end();
});

test('signIn - Deve lançar um erro se a senha estiver incorreta', async (t) => {
  authRepositoryProxy.findUserByEmail.resolves({ id: 1, email: 'existing@example.com', senha: 'hashedpassword' });
  bcryptProxy.compare.resolves(false);

  try {
    await authService.signIn('existing@example.com', 'wrongpassword');
    t.fail('Deveria lançar erro, mas não lançou');
  } catch (err) {
    t.equal(err.message, 'Senha incorreta!', 'Lançou o erro correto');
  }

  authRepositoryProxy.findUserByEmail.restore();
  bcryptProxy.compare.restore();
  t.end();
});

test('signIn - Deve retornar um token e o nome do usuário se o login for bem-sucedido', async (t) => {
  authRepositoryProxy.findUserByEmail.resolves({ id: 1, email: 'existing@example.com', senha: 'hashedpassword', nome: 'Test User' });
  bcryptProxy.compare.resolves(true);
  uuidProxy.returns('valid-token');
  authRepositoryProxy.createSession.resolves(1);

  const result = await authService.signIn('existing@example.com', 'password123');
  t.deepEqual(result, { token: 'valid-token', username: 'Test User' }, 'Retornou o token e nome corretos');

  authRepositoryProxy.findUserByEmail.restore();
  bcryptProxy.compare.restore();
  uuidProxy.restore();
  authRepositoryProxy.createSession.restore();
  
  t.end();
});

test('logout - Deve remover a sessão do usuário', async (t) => {
  authRepositoryProxy.logoutUser.resolves(1);

  const result = await authService.logout(1, 'valid-token');
  t.equal(result, 1, 'Sessão removida com sucesso');

  authRepositoryProxy.logoutUser.restore();
  t.end();
});
