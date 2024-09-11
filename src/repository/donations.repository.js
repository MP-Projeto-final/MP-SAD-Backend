import { db } from "../database.js";
import qrcode from 'qrcode';

export async function getDonationsByUser(userId) {
    const query = `
        SELECT d.id AS donation_id, d.descricao, d.destino_cep, d.destino_rua, d.destino_numero, 
            d.destino_complemento, d.destino_bairro, d.destino_cidade, d.destino_estado,
            p.id AS pacote_id, p.status AS pacote_status
        FROM Doacoes d
        JOIN Pacotes p ON d.id = p.doacao_id
        WHERE d.id_usuario = $1;
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
}

export async function getDonationById(donationId) {
    const query = `
        SELECT 
            d.id as donation_id, 
            d.descricao, 
            d.destino_cep, 
            d.destino_rua, 
            d.destino_numero, 
            d.destino_complemento, 
            d.destino_bairro, 
            d.destino_cidade, 
            d.destino_estado, 
            d.data_enviado,
            p.id as pacote_id, 
            p.qrcode, 
            p.status, 
            p.data_status 
        FROM Doacoes d
        LEFT JOIN Pacotes p ON d.id = p.doacao_id
        WHERE d.id = $1
    `;
    const values = [donationId];
    const result = await db.query(query, values);
    return result.rows[0]; 
}

export async function getPackagesByDonationId(donationId) {
    const query = `
        SELECT * FROM Pacotes
        WHERE doacao_id = $1;
    `;
    const values = [donationId];
    const result = await db.query(query, values);
    return result.rows;
}

export async function createTracking(pacoteId, localizacao, dataHora) {
    const query = `
        INSERT INTO Rastreamento (pacote_id, localizacao, data_hora)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [pacoteId, localizacao, dataHora];
    const result = await db.query(query, values);
    return result.rows[0];
}

export async function getTrackingByPackageId(pacoteId) {
    const query = `
        SELECT * FROM Rastreamento
        WHERE pacote_id = $1;
    `;
    const values = [pacoteId];
    const result = await db.query(query, values);
    return result.rows;
}

export async function createPacote(doacaoId, qrCodeBuffer, status) {
    const query = `
        INSERT INTO Pacotes (doacao_id, qrcode, status, data_status)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
    const values = [doacaoId, qrCodeBuffer, status]; 
    const result = await db.query(query, values);
    return result.rows[0]; 
}

export async function generateQrCodeForDonation(pacoteId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Pacote ID: ${pacoteId}`);  
    return qrCodeBuffer;
}

export async function getPacoteQrCodeById(id) {
    const query = 'SELECT qrcode FROM Pacotes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0]?.qrcode;
}

export async function updatePacoteStatus(pacoteId, status) {
    const query = `
    UPDATE Pacotes
    SET status = $1, data_status = NOW()
    WHERE id = $2
  `;
  const values = [status, pacoteId];

  console.log('Executando query:', query, 'Valores:', values);

  const result = await db.query(query, values);

  console.log('Resultado da query:', result);
}

export async function createMedia(pacoteId, tipo, buffer) {
    const query = `
      INSERT INTO Midias (pacote_id, tipo, imagem, data_upload)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [pacoteId, tipo, buffer]; 
    const result = await db.query(query, values);
    return result.rows[0]; 
}
  
export async function getMediaByPackageId(pacoteId) {
    const query = `
      SELECT id, pacote_id, tipo, imagem, data_upload
      FROM Midias
      WHERE pacote_id = $1;
    `;
    const values = [pacoteId];
    const result = await db.query(query, values);
    return result.rows; 
}

export async function getTotalDoacoesFeitas() {
    const result = await db.query('SELECT COUNT(*) FROM Doacoes');
    return result.rows[0].count;
}

export async function getTotalDoacoesRecebidas() {
    const result = await db.query('SELECT COUNT(*) FROM Pacotes WHERE status = \'entregue\'');
    return result.rows[0].count;
}

export async function getLocalidadesDeOrigem() {
    const result = await db.query(`
        SELECT origem_cidade, origem_estado, COUNT(*) AS total 
        FROM Estatisticas 
        GROUP BY origem_cidade, origem_estado
    `);
    return result.rows;
}

export async function getLocalidadesDeDestino() {
    const result = await db.query(`
        SELECT destino_cidade, destino_estado, COUNT(*) AS total 
        FROM Estatisticas 
        GROUP BY destino_cidade, destino_estado
    `);
    return result.rows;
}

export async function getItensRecebidos() {
    const query = `
      SELECT descricao, COUNT(*) AS total 
      FROM Doacoes
      WHERE id IN (SELECT doacao_id FROM Pacotes WHERE status = 'entregue')
      GROUP BY descricao
    `;
    const result = await db.query(query);
    return result.rows;
}

export async function getItensDoacao() {
    const query = `
        SELECT descricao, COUNT(*) AS total 
        FROM Doacoes
        GROUP BY descricao;
    `;
    const result = await db.query(query);
    return result.rows;
}

export async function insertEstatistica(client, origemCidade, origemEstado, destinoCidade, destinoEstado) {
    const queryText = `
      INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
      VALUES (NOW(), $1, $2, $3, $4)
    `;
    const values = [origemCidade, origemEstado, destinoCidade, destinoEstado];
  
    await client.query(queryText, values);
}

export async function updateEstatisticas(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem, destino_cidade, destino)
        VALUES (NOW(), $1, $2, $3, $4)
    `;
    const values = [origem_cidade, origem_estado, destino_cidade, destino_estado];
    await db.query(query, values);
}

export async function createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado) {
    const query = `
        INSERT INTO Doacoes (id_usuario, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado, data_enviado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING *;
    `;
    const values = [userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado];

    const result = await db.query(query, values);
    return result.rows[0];  
}

export async function createPackage(donationId) {
    const query = `
        INSERT INTO Pacotes (doacao_id, status, data_status)
        VALUES ($1, 'Criado', NOW())
        RETURNING *;
    `;
    const result = await db.query(query, [donationId]);
    return result.rows[0];
}

export async function createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
        VALUES (NOW(), $1, $2, $3, $4);
    `;
    const values = [origem_cidade, origem_estado, destino_cidade, destino_estado];
    await db.query(query, values);
}
