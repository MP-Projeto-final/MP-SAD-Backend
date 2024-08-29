import { db } from "../database.js";

export async function findUserByToken(token) {
    const tokenArray = [token];
    const outputArray = tokenArray.map(item => item.replace(/'/g, ''));

    try {
        const result = await db.query('SELECT users.*, sessions.* FROM users JOIN sessions ON users.id = sessions.user_id WHERE token = $1', outputArray);
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}