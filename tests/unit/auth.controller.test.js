import test from 'tape';
import request from 'supertest';
import express from 'express';
import * as authController from '../../src/controllers/auth.controller.js';
import proxyquire from 'proxyquire';

const app = express();
app.use(express.json());

proxyquire('../../src/controllers/auth.controller.js', {
  '../services/auth.service.js': {
    signUp: async () => undefined,
    signIn: async () => ({ token: 'valid-token', username: 'Test User' }),
    logout: async () => undefined,
  },
});

app.post('/sign-up', authController.signUp);
app.post('/sign-in', authController.signIn);
app.post('/logout', (req, res, next) => {
  res.locals.user_id = 1;
  next();
}, authController.logout);

test('POST /sign-up - Deve criar um novo usuário', async (t) => {
  const res = await request(app).post('/sign-up').send({ email: 'new@example.com', name: 'New User', password: 'password123' });
  t.equal(res.status, 201, 'Resposta com status 201');
  t.end();
});

test('POST /sign-in - Deve retornar token e nome do usuário', async (t) => {
  const res = await request(app).post('/sign-in').send({ email: 'existing@example.com', password: 'password123' });
  t.equal(res.status, 200, 'Resposta com status 200');
  t.deepEqual(res.body, { token: 'valid-token', username: 'Test User' }, 'Resposta com token e nome corretos');
  t.end();
});

test('POST /logout - Deve remover a sessão do usuário', async (t) => {
  const res = await request(app).post('/logout').set('Authorization', 'Bearer valid-token');
  t.equal(res.status, 200, 'Resposta com status 200');
  t.equal(res.text, 'Logout bem-sucedido', 'Resposta com mensagem de sucesso');
  t.end();
});
