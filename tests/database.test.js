import test from 'tape';
import { db } from '../src/database.js';

test('Conexão com o banco de dados', async (t) => {
  try {
    await db.connect();
    t.pass('Conexão com o banco de dados estabelecida com sucesso');
  } catch (err) {
    t.fail('Erro ao conectar ao banco de dados: ' + err.message);
  } finally {
    await db.end();
    t.end();
  }
});
