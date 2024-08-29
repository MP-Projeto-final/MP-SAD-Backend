import request from 'supertest';
import app from '../../src/app';

describe('Testando o servidor Express', () => {
  it('Deve responder com um status 200 na rota principal', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });

  it('Deve retornar JSON com uma mensagem correta na rota principal', async () => {
    const res = await request(app).get('/');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Servidor rodando');
  });
});
