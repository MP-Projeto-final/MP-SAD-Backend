import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

if (process.env.NODE_ENV === "production") {
    configDatabase.ssl = {
        rejectUnauthorized: false,
    };
}

export const db = new Pool(configDatabase);
