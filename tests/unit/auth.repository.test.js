import test from 'tape';
import * as authRepository from '../../src/repository/auth.repository.js';
import { db } from '../../src/database.js';

const mockDbQuery = async (query, values) => {
  if (query.includes('SELECT * FROM Usuarios WHERE email = $1')) {
    return { rows: values[0] === 'existing@example.com' ? [{ id: 1, email: 'existing@example.com', nome: 'Test User' }] : [] };
  }
  if (query.includes('INSERT INTO Usuarios')) {
    return { rows: [{ id: 2, email: 'new@example.com', nome: 'New User' }] }; 
  }
  if (query.includes('INSERT INTO Sessions')) {
    return { rows: [{ token: 'valid-token', id_usuario: 1 }] }; 
  }
  if (query.includes('DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2')) {
    return { rows: [{ token: 'valid-token', id_usuario: 1 }] }; 
  }
  return { rows: [], rowCount: 0 }; 
};

db.query = mockDbQuery;

test('findUserByEmail - Deve encontrar um usuário por email', async (t) => {
  const user = await authRepository.findUserByEmail('existing@example.com');
  t.deepEqual(user, { id: 1, email: 'existing@example.com', nome: 'Test User' }, 'Encontrou o usuário corretamente');
  t.end();
});

test('createUser - Deve criar um novo usuário', async (t) => {
  const result = await authRepository.createUser('new@example.com', 'hashedpassword', 'New User');
  t.deepEqual(result, { id: 2, email: 'new@example.com', nome: 'New User' }, 'Usuário criado com sucesso');
  t.end();
});

test('createSession - Deve criar uma nova sessão', async (t) => {
  const result = await authRepository.createSession('valid-token', 1);
  t.deepEqual(result, { token: 'valid-token', id_usuario: 1 }, 'Sessão criada com sucesso');
  t.end();
});

test('logoutUser - Deve remover a sessão do usuário', async (t) => {
  const result = await authRepository.logoutUser(1, 'valid-token');
  t.deepEqual(result, { token: 'valid-token', id_usuario: 1 }, 'Sessão removida com sucesso');
  t.end();
});

