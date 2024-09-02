import { db } from "../database.js";

export async function createDonation(userId, descricao, destino) {
    const query = `
        INSERT INTO Doacoes (id_usuario, descricao, destino)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [userId, descricao, destino];
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
