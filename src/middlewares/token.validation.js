import { findUserByToken } from "../repository/token.validation.js";

/**
 * Middleware function to validate the authorization token from the request headers.
 * 
 * This middleware checks for a Bearer token in the request headers, validates it,
 * and fetches the associated user. If the token is invalid or the user is not found,
 * it sends an appropriate error response. Otherwise, it attaches the user to the
 * response locals and proceeds to the next middleware or route handler.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * 
 * @returns {void} - Sends an error response if the token is invalid or the user is not found,
 *                   otherwise calls the next middleware function.
 */
export async function tokenValidation(req, res, next) {
    // Extract the token from the Authorization header, removing the "Bearer " prefix.
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    // Check if the token is missing or empty.
    if (!token) {
      return res.status(401).send('Token inválido.');
    }
  
    try {
        // Find the user associated with the provided token.
        const user = await findUserByToken(token);
  
        // If no user is found, respond with a 404 status code and error message.
        if (!user) {
          return res.status(404).send('Usuário não encontrado.');
        }
  
        // Log the authenticated user's ID and attach the user to response locals.
        console.log("Usuário autenticado com ID:", user.id);
        res.locals.user = user;  
        
        // Proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // If an error occurs during token validation, respond with a 500 status code and the error message.
        return res.status(500).send(error.message);
    }
}
