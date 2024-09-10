import { db } from "../database.js";

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
        SELECT * FROM Doacoes
        WHERE id = $1;
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

export async function createMedia(pacoteId, tipo, url) {
    const query = `
        INSERT INTO Midias (pacote_id, tipo, url)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [pacoteId, tipo, url];
    const result = await db.query(query, values);
    return result.rows[0];
}

export async function getMediaByPackageId(pacoteId) {
    const query = `
        SELECT * FROM Midias
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
    const values = [doacaoId, qrCode, status];
    const result = await db.query(query, values);
    return result.rows[0];
}