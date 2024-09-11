import { db } from "../database.js";
import qrcode from 'qrcode';

export async function createDonation(
    userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
    destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
) {
    const query = `
        INSERT INTO Doacoes (
            id_usuario, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
            destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
    `;
    const values = [
        userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
        destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
    ];
    const result = await db.query(query, values);
    return result.rows[0];
}


export async function getDonationsByUser(userId) {
    const query = `
        SELECT * FROM Doacoes
        WHERE id_usuario = $1;
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

export async function createPackage(donationId, qrcode, status) {
    const query = `
        INSERT INTO Pacotes (doacao_id, qrcode, status)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [donationId, qrcode, status];
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

export async function createPacote(doacaoId, qrCode, status) {
    const query = `
        INSERT INTO Pacotes (doacao_id, qrcode, status, data_status)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
    const qrCodeBase64 = qrCode.toString('base64'); 
    const values = [doacaoId, qrCodeBase64, status];
    const result = await db.query(query, values);
    return result.rows[0];
}

export async function generateQrCodeForDonation(donationId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Doacao ID: ${donationId}`);
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
    await db.query(query, values);
}

export async function createMedia(pacoteId, tipo, buffer) {
    const query = `
      INSERT INTO Midias (pacote_id, tipo, imagem, data_upload)
      VALUES ($1, $2, $3, NOW())
    `;
    const values = [pacoteId, tipo, buffer];
    await db.query(query, values);
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
    try {
        const result = await db.query('SELECT COUNT(*) FROM Doacoes');
        console.log("Total de doações feitas:", result.rows[0].count); // Log do resultado
        return result.rows[0].count;
    } catch (error) {
        console.error("Erro ao buscar total de doações feitas:", error);
        throw error;
    }
}


export async function getTotalDoacoesRecebidas() {
    const result = await db.query('SELECT COUNT(*) FROM Pacotes WHERE status = \'entregue\'');
    return result.rows[0].count;
}

export async function getLocalidadesDeOrigem() {
    const result = await db.query('SELECT destino_cidade, destino_estado, COUNT(*) AS total FROM Doacoes GROUP BY destino_cidade, destino_estado');
    return result.rows;
}

export async function getLocalidadesDeDestino() {
    const result = await db.query('SELECT destino_cidade, destino_estado, COUNT(*) AS total FROM Pacotes WHERE status = \'entregue\' GROUP BY destino_cidade, destino_estado');
    return result.rows;
}

export async function getItensDoacao() {
    const result = await db.query('SELECT descricao, COUNT(*) AS total FROM Doacoes GROUP BY descricao');
    return result.rows;
}

export async function getItensRecebidos() {
    const result = await db.query('SELECT descricao, COUNT(*) AS total FROM Pacotes WHERE status = \'entregue\' GROUP BY descricao');
    return result.rows;
}

export async function insertEstatisticas(origem, destino) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem, destino)
        VALUES (NOW(), $1, $2);
    `;
    const values = [origem, destino];
    await db.query(query, values);
}

export async function updateEstatisticas(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem, destino_cidade, destino)
        VALUES (NOW(), $1, $2, $3, $4)
    `;
    const values = [origem_cidade, origem_estado, destino_cidade, destino_estado];
    await db.query(query, values);
}
