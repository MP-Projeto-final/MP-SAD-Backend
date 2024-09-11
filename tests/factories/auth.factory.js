/**
 * Generates a user object with optional overrides.
 *
 * @param {Object} [overrides={}] - An object containing fields to override the default values.
 * @param {number} [overrides.id=1] - The user's ID. Defaults to 1 if not provided.
 * @param {string} [overrides.email="test@example.com"] - The user's email address. Defaults to "test@example.com" if not provided.
 * @param {string} [overrides.senha="hashedpassword"] - The user's hashed password. Defaults to "hashedpassword" if not provided.
 * @param {string} [overrides.nome="Test User"] - The user's name. Defaults to "Test User" if not provided.
 * @returns {Object} The user object with the specified or default values.
 */
export function createUser(overrides = {}) {
  return {
      id: overrides.id || 1,
      email: overrides.email || "test@example.com",
      senha: overrides.senha || "hashedpassword",
      nome: overrides.nome || "Test User",
      ...overrides,
  };
}

/**
* Generates a default valid token.
*
* @returns {string} A default valid token string.
*/
export function createToken() {
  return "valid-token";
}
