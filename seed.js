import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'SAD',
  password: 'password',
  port: 5432,
});

async function seed() {
  try {
/*     await pool.query('DELETE FROM midias;');
    await pool.query('DELETE FROM rastreamento;');
    await pool.query('DELETE FROM pacotes;');
    await pool.query('DELETE FROM doacoes;');
    await pool.query('DELETE FROM estatisticas;');
    await pool.query('DELETE FROM sessions;');
    await pool.query('DELETE FROM usuarios;');
 */
    const users = [
      {
        nome: 'Admin',
        email: 'admin@gmail.com',
        senha: '$2b$10$YYi2vDGZaCf1rqYbQ1YGZe9/4C5xwG2MxaA7.u9TwozgnFH0GlETO',
      },
      {
        nome: 'User1',
        email: 'user1@gmail.com',
        senha: '$2b$10$YYi2vDGZaCf1rqYbQ1YGZe9/4C5xwG2MxaA7.u9TwozgnFH0GlETO',
      },
      {
        nome: 'User2',
        email: 'user2@gmail.com',
        senha: '$2b$10$YYi2vDGZaCf1rqYbQ1YGZe9/4C5xwG2MxaA7.u9TwozgnFH0GlETO',
      },
      {
        nome: 'User3',
        email: 'user3@gmail.com',
        senha: '$2b$10$YYi2vDGZaCf1rqYbQ1YGZe9/4C5xwG2MxaA7.u9TwozgnFH0GlETO',
      },
    ];

    const insertUsuarioQuery = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3) RETURNING id;
    `;

    const userIds = [];
    for (const user of users) {
      const result = await pool.query(insertUsuarioQuery, [
        user.nome,
        user.email,
        user.senha,
      ]);
      userIds.push(result.rows[0].id);
    }

    const doacoes = [
      {
        id_usuario: userIds[0],
        descricao: 'Roupas para caridade',
        data_enviado: '2024-09-11',
        destino_cep: '01001-000',
        destino_rua: 'Rua 25 de Março',
        destino_numero: '123',
        destino_complemento: 'Apto 456',
        destino_bairro: 'Centro',
        destino_cidade: 'São Paulo',
        destino_estado: 'SP',
        origem_cidade: 'Rio de Janeiro',
        origem_estado: 'RJ',
      },
      {
        id_usuario: userIds[0],
        descricao: 'Brinquedos para crianças',
        data_enviado: '2024-09-12',
        destino_cep: '30130-000',
        destino_rua: 'Avenida Afonso Pena',
        destino_numero: '456',
        destino_complemento: 'Casa',
        destino_bairro: 'Savassi',
        destino_cidade: 'Belo Horizonte',
        destino_estado: 'MG',
        origem_cidade: 'Rio de Janeiro',
        origem_estado: 'RJ',
      },
      {
        id_usuario: userIds[1],
        descricao: 'Alimentos não perecíveis',
        data_enviado: '2024-09-13',
        destino_cep: '80010-000',
        destino_rua: 'Rua XV de Novembro',
        destino_numero: '10',
        destino_complemento: '',
        destino_bairro: 'Centro',
        destino_cidade: 'Curitiba',
        destino_estado: 'PR',
        origem_cidade: 'São Paulo',
        origem_estado: 'SP',
      },
      {
        id_usuario: userIds[1],
        descricao: 'Livros para biblioteca comunitária',
        data_enviado: '2024-09-14',
        destino_cep: '69005-000',
        destino_rua: 'Avenida Eduardo Ribeiro',
        destino_numero: '20',
        destino_complemento: 'Bloco B',
        destino_bairro: 'Centro',
        destino_cidade: 'Manaus',
        destino_estado: 'AM',
        origem_cidade: 'São Paulo',
        origem_estado: 'SP',
      },
      {
        id_usuario: userIds[2],
        descricao: 'Sapatos usados em bom estado',
        data_enviado: '2024-09-15',
        destino_cep: '40010-000',
        destino_rua: 'Rua Chile',
        destino_numero: '30',
        destino_complemento: '',
        destino_bairro: 'Centro',
        destino_cidade: 'Salvador',
        destino_estado: 'BA',
        origem_cidade: 'Curitiba',
        origem_estado: 'PR',
      },
      {
        id_usuario: userIds[2],
        descricao: 'Mochilas para estudantes',
        data_enviado: '2024-09-16',
        destino_cep: '60110-000',
        destino_rua: 'Avenida Beira Mar',
        destino_numero: '40',
        destino_complemento: '',
        destino_bairro: 'Meireles',
        destino_cidade: 'Fortaleza',
        destino_estado: 'CE',
        origem_cidade: 'Curitiba',
        origem_estado: 'PR',
      },
      {
        id_usuario: userIds[3],
        descricao: 'Brinquedos novos para doação',
        data_enviado: '2024-09-17',
        destino_cep: '04501-000',
        destino_rua: 'Avenida Brigadeiro Faria Lima',
        destino_numero: '50',
        destino_complemento: '',
        destino_bairro: 'Jardim Paulistano',
        destino_cidade: 'São Paulo',
        destino_estado: 'SP',
        origem_cidade: 'Salvador',
        origem_estado: 'BA',
      },
      {
        id_usuario: userIds[3],
        descricao: 'Cestas básicas para famílias',
        data_enviado: '2024-09-18',
        destino_cep: '60000-000',
        destino_rua: 'Rua Sena Madureira',
        destino_numero: '60',
        destino_complemento: 'Apto 10',
        destino_bairro: 'Vila Clementino',
        destino_cidade: 'São Paulo',
        destino_estado: 'SP',
        origem_cidade: 'Salvador',
        origem_estado: 'BA',
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

    const insertEstatisticasQuery = `
      INSERT INTO estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
      VALUES ($1, $2, $3, $4, $5);
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

      await pool.query(insertEstatisticasQuery, [
        new Date(), 
        doacao.origem_cidade,
        doacao.origem_estado,
        doacao.destino_cidade,
        doacao.destino_estado,
      ]);
    }
    const pacotes = [
      {
        doacao_id: doacaoIds[0],
        qrcode: Buffer.from('QRCodeData1'),
        status: 'entregue',
        data_status: '2024-09-11 12:00:00',
        destino_cidade: 'Cidade Teste',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'SP',
      },
      {
        doacao_id: doacaoIds[1],
        qrcode: Buffer.from('QRCodeData2'),
        status: 'entregue',
        data_status: '2024-09-12 14:00:00',
        destino_cidade: 'Cidade Exemplo',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'MG',
      },
      {
        doacao_id: doacaoIds[2],
        qrcode: Buffer.from('QRCodeData3'),
        status: 'entregue',
        data_status: '2024-09-13 16:00:00',
        destino_cidade: 'Cidade Comida',
        origem_cidade: 'Cidade Alimentos',
        destino_estado: 'SP',
      },
      {
        doacao_id: doacaoIds[3],
        qrcode: Buffer.from('QRCodeData4'),
        status: 'entregue',
        data_status: '2024-09-14 18:00:00',
        destino_cidade: 'Cidade Cultura',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'MG',
      },
      {
        doacao_id: doacaoIds[4],
        qrcode: Buffer.from('QRCodeData5'),
        status: 'entregue',
        data_status: '2024-09-15 20:00:00',
        destino_cidade: 'Cidade Sapato',
        origem_cidade: 'Cidade Calçado',
        destino_estado: 'SP',
      },
      {
        doacao_id: doacaoIds[5],
        qrcode: Buffer.from('QRCodeData6'),
        status: 'entregue',
        data_status: '2024-09-16 22:00:00',
        destino_cidade: 'Cidade Aventura',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'MG',
      },
      {
        doacao_id: doacaoIds[6],
        qrcode: Buffer.from('QRCodeData7'),
        status: 'entregue',
        data_status: '2024-09-17 00:00:00',
        destino_cidade: 'Cidade Brinquedo',
        origem_cidade: 'Cidade Origem',
        destino_estado: 'SP',
      },
      {
        doacao_id: doacaoIds[7],
        qrcode: Buffer.from('QRCodeData8'),
        status: 'entregue',
        data_status: '2024-09-18 02:00:00',
        destino_cidade: 'Cidade Comida',
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

    const midias = [
      {
        pacote_id: pacoteIds[0],
        tipo: 'image/jpeg',
        data_upload: '2024-09-11 12:30:00',
        imagem: fs.readFileSync('src/assets/entrega1.jpg'),
      },
      {
        pacote_id: pacoteIds[1],
        tipo: 'image/jpeg',
        data_upload: '2024-09-12 14:30:00',
        imagem: fs.readFileSync('src/assets/entrega2.jpg'),
      },
      {
        pacote_id: pacoteIds[2],
        tipo: 'image/jpeg',
        data_upload: '2024-09-13 16:30:00',
        imagem: fs.readFileSync('src/assets/entrega3.jpg'),
      },
      {
        pacote_id: pacoteIds[3],
        tipo: 'image/jpeg',
        data_upload: '2024-09-14 18:30:00',
        imagem: fs.readFileSync('src/assets/entrega4.jpg'),
      },
      {
        pacote_id: pacoteIds[4],
        tipo: 'image/jpeg',
        data_upload: '2024-09-15 20:30:00',
        imagem: fs.readFileSync('src/assets/entrega1.jpg'),
      },
      {
        pacote_id: pacoteIds[5],
        tipo: 'image/jpeg',
        data_upload: '2024-09-16 22:30:00',
        imagem: fs.readFileSync('src/assets/entrega2.jpg'),
      },
      {
        pacote_id: pacoteIds[6],
        tipo: 'image/jpeg',
        data_upload: '2024-09-17 00:30:00',
        imagem: fs.readFileSync('src/assets/entrega3.jpg'),
      },
      {
        pacote_id: pacoteIds[7],
        tipo: 'image/jpeg',
        data_upload: '2024-09-18 02:30:00',
        imagem: fs.readFileSync('src/assets/entrega4.jpg'),
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
