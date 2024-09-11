import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Configuration object for the PostgreSQL connection
const configDatabase = {
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

// Apply SSL configuration if in production environment
if (process.env.NODE_ENV === "production") {
    configDatabase.ssl = {
        rejectUnauthorized: false,
    };
}

// Create and export a new Pool instance for database connection
export const db = new Pool(configDatabase);
