import test from 'tape';
import supertest from 'supertest';
import app from '../src/app.js';

test('GET / - Servidor deve responder com status 200 e uma mensagem', (t) => {
  supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        t.fail('Erro ao fazer requisição ao servidor');
      } else {
        t.equal(res.body.message, 'Servidor rodando', 'Mensagem correta recebida');
        t.pass('Servidor respondeu corretamente');
      }
      t.end();
    });
});
