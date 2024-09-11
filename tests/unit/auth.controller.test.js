import test from 'tape';
import request from 'supertest';
import express from 'express';
import * as authController from '../../src/controllers/auth.controller.js';
import proxyquire from 'proxyquire';

// Initialize Express application
const app = express();
app.use(express.json());

// Mock the auth service methods
proxyquire('../../src/controllers/auth.controller.js', {
  '../services/auth.service.js': {
    signUp: async () => undefined,  // Mock implementation for user sign-up
    signIn: async () => ({ token: 'valid-token', username: 'Test User' }),  // Mock implementation for user sign-in
    logout: async () => undefined,  // Mock implementation for user logout
  },
});

// Set up routes for testing
app.post('/sign-up', authController.signUp);  // Route to handle user sign-up
app.post('/sign-in', authController.signIn);  // Route to handle user sign-in
app.post('/logout', (req, res, next) => {
  res.locals.user_id = 1;  // Mock user ID for logout
  next();
}, authController.logout);  // Route to handle user logout

/**
 * Test case for POST /sign-up
 * This test verifies that a new user can be created successfully.
 */
test('POST /sign-up - Deve criar um novo usuário', async (t) => {
  const res = await request(app).post('/sign-up').send({
    email: 'new@example.com',  // Email for the new user
    name: 'New User',  // Name for the new user
    password: 'password123'  // Password for the new user
  });

  t.equal(res.status, 201, 'Resposta com status 201');  // Assert that the response status is 201 Created
  t.end();
});

/**
 * Test case for POST /sign-in
 * This test verifies that signing in returns a valid token and username.
 */
test('POST /sign-in - Deve retornar token e nome do usuário', async (t) => {
  const res = await request(app).post('/sign-in').send({
    email: 'existing@example.com',  // Email for an existing user
    password: 'password123'  // Password for the existing user
  });

  t.equal(res.status, 200, 'Resposta com status 200');  // Assert that the response status is 200 OK
  t.deepEqual(res.body, { token: 'valid-token', username: 'Test User' }, 'Resposta com token e nome corretos');  // Assert that the response body contains the expected token and username
  t.end();
});

/**
 * Test case for POST /logout
 * This test verifies that logging out removes the user session successfully.
 */
test('POST /logout - Deve remover a sessão do usuário', async (t) => {
  const res = await request(app).post('/logout').set('Authorization', 'Bearer valid-token');  // Send request with Authorization header

  t.equal(res.status, 200, 'Resposta com status 200');  // Assert that the response status is 200 OK
  t.equal(res.text, 'Logout bem-sucedido', 'Resposta com mensagem de sucesso');  // Assert that the response body contains the success message
  t.end();
});
