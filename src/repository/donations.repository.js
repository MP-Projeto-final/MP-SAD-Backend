import { db } from "../database.js";
import qrcode from 'qrcode';

export async function createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado) {
    console.log('Creating donation for user:', userId);
    const query = `
        INSERT INTO Doacoes (id_usuario, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const values = [userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado];
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

export async function createMedia(pacoteId, tipo, imagem) {
    const query = `
      INSERT INTO Midias (pacote_id, tipo, imagem, data_upload)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [pacoteId, tipo, imagem];
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