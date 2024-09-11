import test from 'tape';
import * as authRepository from '../../src/repository/auth.repository.js';
import { db } from '../../src/database.js';

/**
 * Mock database query function to simulate interactions with the database.
 * This function provides predefined responses based on the query and values.
 * 
 * @param {string} query - The SQL query string.
 * @param {Array} values - The values to be used in the SQL query.
 * @returns {Object} - The mocked response from the database.
 */
const mockDbQuery = async (query, values) => {
  if (query.includes('SELECT * FROM Usuarios WHERE email = $1')) {
    // Simulate finding a user by email
    return { rows: values[0] === 'existing@example.com' ? [{ id: 1, email: 'existing@example.com', nome: 'Test User' }] : [] };
  }
  if (query.includes('INSERT INTO Usuarios')) {
    // Simulate creating a new user
    return { rows: [{ id: 2, email: 'new@example.com', nome: 'New User' }] }; 
  }
  if (query.includes('INSERT INTO Sessions')) {
    // Simulate creating a new session
    return { rows: [{ token: 'valid-token', id_usuario: 1 }] }; 
  }
  if (query.includes('DELETE FROM Sessions WHERE id_usuario = $1 AND token = $2')) {
    // Simulate removing a session
    return { rows: [{ token: 'valid-token', id_usuario: 1 }] }; 
  }
  return { rows: [], rowCount: 0 }; 
};

// Override the database query method with the mock function
db.query = mockDbQuery;

/**
 * Test case for findUserByEmail function.
 * This test verifies that the function correctly finds a user by their email address.
 */
test('findUserByEmail - Deve encontrar um usuário por email', async (t) => {
  const user = await authRepository.findUserByEmail('existing@example.com');
  t.deepEqual(user, { id: 1, email: 'existing@example.com', nome: 'Test User' }, 'Encontrou o usuário corretamente');
  t.end();
});

/**
 * Test case for createUser function.
 * This test verifies that the function correctly creates a new user.
 */
test('createUser - Deve criar um novo usuário', async (t) => {
  const result = await authRepository.createUser('new@example.com', 'hashedpassword', 'New User');
  t.deepEqual(result, { id: 2, email: 'new@example.com', nome: 'New User' }, 'Usuário criado com sucesso');
  t.end();
});

/**
 * Test case for createSession function.
 * This test verifies that the function correctly creates a new session.
 */
test('createSession - Deve criar uma nova sessão', async (t) => {
  const result = await authRepository.createSession('valid-token', 1);
  t.deepEqual(result, { token: 'valid-token', id_usuario: 1 }, 'Sessão criada com sucesso');
  t.end();
});

/**
 * Test case for logoutUser function.
 * This test verifies that the function correctly removes a user session.
 */
test('logoutUser - Deve remover a sessão do usuário', async (t) => {
  const result = await authRepository.logoutUser(1, 'valid-token');
  t.deepEqual(result, { token: 'valid-token', id_usuario: 1 }, 'Sessão removida com sucesso');
  t.end();
});
