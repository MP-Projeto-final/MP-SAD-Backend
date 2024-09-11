import { db } from "../database.js";
import qrcode from 'qrcode';

/**
 * Retrieves all donations made by a specific user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Array<Object>} - Returns an array of donations and associated packages.
 */
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

/**
 * Retrieves a specific donation by its ID.
 * 
 * @param {number} donationId - The ID of the donation.
 * @returns {Object|null} - Returns the donation details or null if not found.
 */
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

/**
 * Retrieves all packages associated with a specific donation.
 * 
 * @param {number} donationId - The ID of the donation.
 * @returns {Array<Object>} - Returns an array of packages.
 */
export async function getPackagesByDonationId(donationId) {
    const query = `
        SELECT * FROM Pacotes
        WHERE doacao_id = $1;
    `;
    const values = [donationId];
    const result = await db.query(query, values);
    return result.rows;
}

/**
 * Creates a tracking entry for a package.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @param {string} localizacao - The location of the package.
 * @param {Date} dataHora - The date and time of the tracking.
 * @returns {Object} - Returns the created tracking object.
 */
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

/**
 * Retrieves tracking information for a specific package.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @returns {Array<Object>} - Returns an array of tracking records.
 */
export async function getTrackingByPackageId(pacoteId) {
    const query = `
        SELECT * FROM Rastreamento
        WHERE pacote_id = $1;
    `;
    const values = [pacoteId];
    const result = await db.query(query, values);
    return result.rows;
}

/**
 * Creates a package for a donation and stores the QR code buffer.
 * 
 * @param {number} doacaoId - The ID of the donation.
 * @param {Buffer} qrCodeBuffer - The QR code buffer for the package.
 * @param {string} status - The initial status of the package.
 * @returns {Object} - Returns the created package object.
 */
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

/**
 * Generates a QR code for a specific package.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @returns {Buffer} - Returns the generated QR code buffer.
 */
export async function generateQrCodeForDonation(pacoteId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Pacote ID: ${pacoteId}`);  
    return qrCodeBuffer;
}

/**
 * Retrieves the QR code buffer for a package by its ID.
 * 
 * @param {number} id - The ID of the package.
 * @returns {Buffer|null} - Returns the QR code buffer or null if not found.
 */
export async function getPacoteQrCodeById(id) {
    const query = 'SELECT qrcode FROM Pacotes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0]?.qrcode;
}

/**
 * Updates the status of a package and sets the status date to the current time.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @param {string} status - The new status of the package.
 */
export async function updatePacoteStatus(pacoteId, status) {
    const query = `
    UPDATE Pacotes
    SET status = $1, data_status = NOW()
    WHERE id = $2
  `;
  const values = [status, pacoteId];

  console.log('Executing query:', query, 'Values:', values);

  const result = await db.query(query, values);

  console.log('Query result:', result);
}

/**
 * Creates a media record for a package with the provided type and buffer.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @param {string} tipo - The type of media (e.g., image, video).
 * @param {Buffer} buffer - The buffer containing the media data.
 * @returns {Object} - Returns the created media object.
 */
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
  
/**
 * Retrieves all media associated with a specific package.
 * 
 * @param {number} pacoteId - The ID of the package.
 * @returns {Array<Object>} - Returns an array of media records.
 */
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

/**
 * Retrieves the total number of donations made.
 * 
 * @returns {number} - Returns the total count of donations.
 */
export async function getTotalDoacoesFeitas() {
    const result = await db.query('SELECT COUNT(*) FROM Doacoes');
    return result.rows[0].count;
}

/**
 * Retrieves the total number of donations received (i.e., packages delivered).
 * 
 * @returns {number} - Returns the total count of delivered packages.
 */
export async function getTotalDoacoesRecebidas() {
    const result = await db.query('SELECT COUNT(*) FROM Pacotes WHERE status = \'entregue\'');
    return result.rows[0].count;
}

/**
 * Retrieves the locations of donation origins grouped by city and state.
 * 
 * @returns {Array<Object>} - Returns an array of origin locations and their counts.
 */
export async function getLocalidadesDeOrigem() {
    const result = await db.query(`
        SELECT origem_cidade, origem_estado, COUNT(*) AS total 
        FROM Estatisticas 
        GROUP BY origem_cidade, origem_estado
    `);
    return result.rows;
}

/**
 * Retrieves the locations of donation destinations grouped by city and state.
 * 
 * @returns {Array<Object>} - Returns an array of destination locations and their counts.
 */
export async function getLocalidadesDeDestino() {
    const result = await db.query(`
        SELECT destino_cidade, destino_estado, COUNT(*) AS total 
        FROM Estatisticas 
        GROUP BY destino_cidade, destino_estado
    `);
    return result.rows;
}

/**
 * Retrieves items that have been received in donations, grouped by description.
 * 
 * @returns {Array<Object>} - Returns an array of items and their counts.
 */
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

/**
 * Retrieves items from all donations, grouped by description.
 * 
 * @returns {Array<Object>} - Returns an array of items and their counts.
 */
export async function getItensDoacao() {
    const query = `
        SELECT descricao, COUNT(*) AS total 
        FROM Doacoes
        GROUP BY descricao;
    `;
    const result = await db.query(query);
    return result.rows;
}

/**
 * Inserts a new statistic record into the database.
 * 
 * @param {Object} client - The database client.
 * @param {string} origemCidade - The city of origin.
 * @param {string} origemEstado - The state of origin.
 * @param {string} destinoCidade - The city of destination.
 * @param {string} destinoEstado - The state of destination.
 */
export async function insertEstatistica(client, origemCidade, origemEstado, destinoCidade, destinoEstado) {
    const queryText = `
      INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
      VALUES (NOW(), $1, $2, $3, $4)
    `;
    const values = [origemCidade, origemEstado, destinoCidade, destinoEstado];
  
    await client.query(queryText, values);
}

/**
 * Updates the statistics with new data.
 * 
 * @param {string} origem_cidade - The city of origin.
 * @param {string} origem_estado - The state of origin.
 * @param {string} destino_cidade - The city of destination.
 * @param {string} destino_estado - The state of destination.
 */
export async function updateEstatisticas(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
        VALUES (NOW(), $1, $2, $3, $4)
    `;
    const values = [origem_cidade, origem_estado, destino_cidade, destino_estado];
    await db.query(query, values);
}

/**
 * Creates a new donation record in the database.
 * 
 * @param {number} userId - The ID of the user making the donation.
 * @param {string} descricao - The description of the donation.
 * @param {string} destino_cep - The postal code of the destination.
 * @param {string} destino_rua - The street address of the destination.
 * @param {string} destino_numero - The street number of the destination.
 * @param {string} destino_complemento - The complement of the destination address.
 * @param {string} destino_bairro - The neighborhood of the destination.
 * @param {string} destino_cidade - The city of the destination.
 * @param {string} destino_estado - The state of the destination.
 * @param {string} origem_cidade - The city of the origin.
 * @param {string} origem_estado - The state of the origin.
 * @returns {Object} - Returns the created donation record.
 */
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

/**
 * Creates a new package record for a given donation ID with initial status.
 * 
 * @param {number} donationId - The ID of the donation.
 * @returns {Object} - Returns the created package record.
 */
export async function createPackage(donationId) {
    const query = `
        INSERT INTO Pacotes (doacao_id, status, data_status)
        VALUES ($1, 'Criado', NOW())
        RETURNING *;
    `;
    const result = await db.query(query, [donationId]);
    return result.rows[0];
}

/**
 * Creates a new statistic record for donation data.
 * 
 * @param {string} origem_cidade - The city of origin.
 * @param {string} origem_estado - The state of origin.
 * @param {string} destino_cidade - The city of destination.
 * @param {string} destino_estado - The state of destination.
 */
export async function createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    const query = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
        VALUES (NOW(), $1, $2, $3, $4);
    `;
    const values = [origem_cidade, origem_estado, destino_cidade, destino_estado];
    await db.query(query, values);
}
