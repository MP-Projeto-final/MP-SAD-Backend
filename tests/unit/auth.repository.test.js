import test from 'tape';
import * as authRepository from '../../src/repository/auth.repository.js';
import { db } from '../../src/database.js';

const mockDbQuery = async (query, values) => {
  console.log('Query:', query);
  console.log('Values:', values);

  if (query.includes('SELECT * FROM Usuarios WHERE email = $1')) {
    return { rows: values[0] === 'existing@example.com' ? [{ id: 1, email: 'existing@example.com', nome: 'Test User' }] : [] };
  }
  if (query.includes('INSERT INTO Usuarios')) {
    return { rowCount: 1 };
  }
  if (query.includes('INSERT INTO Sessions')) {
    return { rowCount: 1 }; 
  }
  // if (query.includes('SELECT Usuarios.id, Usuarios.nome, Usuarios.email FROM Usuarios JOIN Sessions ON Usuarios.id = Sessions.id_usuario WHERE Sessions.token = $1')) {
  //   return {
  //     rows: values[0] === 'valid-token'
  //       ? [{ id: 1, nome: 'Test User', email: 'existing@example.com' }]
  //       : []
  //   };
  // }
  if (query.includes('DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2')) {
    return { rowCount: 1 }; 
  }

  return { rows: [], rowCount: 0 }; 
};


db.query = mockDbQuery;

test('createUser - Deve criar um novo usuário', async (t) => {
  const result = await authRepository.createUser('new@example.com', 'hashedpassword', 'New User');
  t.strictEqual(result, 1, 'Usuário criado com sucesso');
  t.pass('Usuário criado com sucesso');
  t.end();
});

test('createSession - Deve criar uma nova sessão', async (t) => {
  const result = await authRepository.createSession('valid-token', 1);
  t.strictEqual(result, 1, 'Sessão criada com sucesso');
  t.pass('Sessão criada com sucesso');
  t.end();
});

test('logoutUser - Deve remover a sessão do usuário', async (t) => {
  const result = await authRepository.logoutUser(1, 'valid-token');
  t.strictEqual(result, 1, 'Sessão removida com sucesso');
  t.pass('Sessão removida com sucesso');
  t.end();
});

// test('findUserByToken - Deve encontrar um usuário pelo token', async (t) => {
//   const user = await authRepository.findUserByToken('valid-token');
//   t.deepEqual(user, { id: 1, nome: 'Test User', email: 'existing@example.com' }, 'Encontrou o usuário corretamente pelo token');
//   t.end();
// });

