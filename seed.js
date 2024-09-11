import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'your_database_name', // Substitua pelo nome do seu banco de dados
  password: 'password', // Substitua pela sua senha
  port: 5432,
});

async function seed() {
  try {
    // Limpar tabelas
    await pool.query('DELETE FROM midias;');
    await pool.query('DELETE FROM rastreamento;');
    await pool.query('DELETE FROM pacotes;');
    await pool.query('DELETE FROM doacoes;');
    await pool.query('DELETE FROM estatisticas;');
    await pool.query('DELETE FROM sessions;');
    await pool.query('DELETE FROM usuarios;');

    // Inserir um usuário admin
    const adminUser = {
      nome: 'Admin',
      email: 'admin@gmail.com',
      senha: '$2b$10$YYi2vDGZaCf1rqYbQ1YGZe9/4C5xwG2MxaA7.u9TwozgnFH0GlETO', // Hash fornecido
    };

    const insertUsuarioQuery = `
      INSERT INTO usuarios (nome, email, senha) 
      VALUES ($1, $2, $3) RETURNING id;
    `;
    const adminUserResult = await pool.query(insertUsuarioQuery, [
      adminUser.nome,
      adminUser.email,
      adminUser.senha,
    ]);
    const adminUserId = adminUserResult.rows[0].id;

    // Inserir algumas doações
    const doacoes = [
      {
        id_usuario: adminUserId,
        descricao: 'Doação de roupas',
        data_enviado: '2024-09-11',
        destino_cep: '12345-678',
        destino_rua: 'Rua Teste',
        destino_numero: '123',
        destino_complemento: 'Apto 456',
        destino_bairro: 'Bairro Teste',
        destino_cidade: 'Cidade Teste',
        destino_estado: 'SP',
        origem_cidade: 'Cidade Origem',
        origem_estado: 'RJ',
      },
      {
        id_usuario: adminUserId,
        descricao: 'Doação de brinquedos',
        data_enviado: '2024-09-12',
        destino_cep: '98765-432',
        destino_rua: 'Avenida Teste',
        destino_numero: '456',
        destino_complemento: 'Casa',
        destino_bairro: 'Bairro Exemplo',
        destino_cidade: 'Cidade Exemplo',
        destino_estado: 'MG',
        origem_cidade: 'Cidade Origem',
        origem_estado: 'RJ',
      },
    ];

    const insertDoacaoQuery = `
      INSERT INTO doacoes (
        id_usuario, descricao, data_enviado, destino_cep, destino_rua, destino_numero, 
        destino_complemento, destino_bairro, destino_cidade, destino_estado, 
        origem_cidade, origem_estado
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;
    `;

    const doacaoIds = [];
    for (const doacao of doacoes) {
      const result = await pool.query(insertDoacaoQuery, [
        doacao.id_usuario,
        doacao.descricao,
        doacao.data_enviado,
        doacao.destino_cep,
        doacao.destino_rua,
        doacao.destino_numero,
        doacao.destino_complemento,
        doacao.destino_bairro,
        doacao.destino_cidade,
        doacao.destino_estado,
        doacao.origem_cidade,
        doacao.origem_estado,
      ]);
      doacaoIds.push(result.rows[0].id);
    }

    // Inserir alguns pacotes
    const pacotes = [
      {
        doacao_id: doacaoIds[0],
        qrcode: Buffer.from('QRCodeData1'), // Exemplo de QRCode
        status: 'Criado',
        data_status: '2024-09-11 12:00:00',
        destino_cidade: 'Cidade Teste',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'SP',
      },
      {
        doacao_id: doacaoIds[1],
        qrcode: Buffer.from('QRCodeData2'),
        status: 'Criado',
        data_status: '2024-09-12 14:00:00',
        destino_cidade: 'Cidade Exemplo',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'MG',
      },
    ];

    const insertPacoteQuery = `
      INSERT INTO pacotes (
        doacao_id, qrcode, status, data_status, destino_cidade, origem_cidade, destino_estado
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;

    const pacoteIds = [];
    for (const pacote of pacotes) {
      const result = await pool.query(insertPacoteQuery, [
        pacote.doacao_id,
        pacote.qrcode,
        pacote.status,
        pacote.data_status,
        pacote.destino_cidade,
        pacote.origem_cidade,
        pacote.destino_estado,
      ]);
      pacoteIds.push(result.rows[0].id);
    }

    // Inserir uma estatística
    await pool.query(`
      INSERT INTO estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado) 
      VALUES ('2024-09-11 10:00:00', 'Cidade Origem', 'RJ', 'Cidade Teste', 'SP');
    `);

    // Inserir algumas mídias para os pacotes
    const midias = [
      {
        pacote_id: pacoteIds[0],
        tipo: 'image/png',
        data_upload: '2024-09-11 12:30:00',
        imagem: fs.readFileSync('path/to/image1.png'), // Substitua pelo caminho real da imagem
      },
    ];

    const insertMidiaQuery = `
      INSERT INTO midias (pacote_id, tipo, data_upload, imagem) 
      VALUES ($1, $2, $3, $4);
    `;

    for (const midia of midias) {
      await pool.query(insertMidiaQuery, [
        midia.pacote_id,
        midia.tipo,
        midia.data_upload,
        midia.imagem,
      ]);
    }

    console.log('Seed concluído com sucesso');
  } catch (err) {
    console.error('Erro ao executar o seed', err);
  } finally {
    pool.end();
  }
}

seed();
