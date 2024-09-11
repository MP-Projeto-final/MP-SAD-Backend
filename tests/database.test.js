import test from 'tape';
import { db } from '../src/database.js';

/**
 * Test case for establishing a connection to the database.
 * Verifies that the connection to the database can be successfully established.
 */
test('Conexão com o banco de dados', async (t) => {
  try {
    // Attempt to connect to the database
    await db.connect();
    // If successful, mark the test as passed with an appropriate message
    t.pass('Conexão com o banco de dados estabelecida com sucesso');
  } catch (err) {
    // If an error occurs during the connection attempt, mark the test as failed
    t.fail('Erro ao conectar ao banco de dados: ' + err.message);
  } finally {
    // Ensure the database connection is closed after the test, regardless of success or failure
    await db.end();
    // End the test
    t.end();
  }
});
