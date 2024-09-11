import * as authService from "../services/auth.service.js";

/**
 * Handles user sign-up by calling the authService's signUp function.
 * 
 * @param {Object} req - Express request object, expects body with email, name, password, and phone.
 * @param {Object} res - Express response object.
 */
export async function signUp(req, res) {
  const { email, name, password, phone } = req.body;

  try {
    await authService.signUp(email, name, password, phone);
    res.sendStatus(201); // Created status code.
  } catch (error) {
    res.status(error.status || 500).send(error.message); // Error handling with status code.
  }
}

/**
 * Handles user sign-in by calling the authService's signIn function.
 * 
 * @param {Object} req - Express request object, expects body with email and password.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns a response with the authentication token and username.
 */
export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const tokenData = await authService.signIn(email, password);
    res.setHeader('Authorization', `Bearer ${tokenData.token}`);
    res.status(200).send({ token: tokenData.token, username: tokenData.username });
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
}

/**
 * Handles user logout by calling the authService's logout function.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object, expects headers with authorization token.
 */
export async function logout(req, res) {
  const userId = res.locals.user_id;
  const token = req.headers.authorization?.replace('Bearer ', '');

  try {
    await authService.logout(userId, token);
    res.send('Logout bem-sucedido');
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
}
