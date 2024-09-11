import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database.js";
import authRouter from "./routers/auth.router.js";
import donationRouter from "./routers/donations.router.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(express.json()); // Parse incoming JSON requests

// Route setup
app.use(authRouter); // Attach authentication routes
app.use(donationRouter); // Attach donation-related routes

// Root route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor rodando' }); // Basic health check
});

// Connect to the database and start the server
const port = process.env.PORT || 4000; // Port from environment variables or default to 4000

db.connect()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`); // Start server on the specified port
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados. O servidor não foi iniciado.", err); // Handle database connection errors
  });

export default app; // Export the app for use in other modules (e.g., testing)
