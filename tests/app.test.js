import test from 'tape';
import supertest from 'supertest';
import app from '../src/app.js';

/**
 * Test case for the root GET route.
 * Verifies that the server responds with a 200 status code and a correct message.
 */
test('GET / - Servidor deve responder com status 200 e uma mensagem', (t) => {
  supertest(app)
    .get('/') // Perform a GET request to the root endpoint
    .expect(200) // Expect a 200 OK response status
    .expect('Content-Type', /json/) // Expect the content type to be JSON
    .end((err, res) => {
      if (err) {
        // If there's an error, fail the test with an appropriate message
        t.fail('Erro ao fazer requisição ao servidor');
      } else {
        // Check if the response message matches the expected message
        t.equal(res.body.message, 'Servidor rodando', 'Mensagem correta recebida');
        // Pass the test if the server responded correctly
        t.pass('Servidor respondeu corretamente');
      }
      // End the test
      t.end();
    });
});
