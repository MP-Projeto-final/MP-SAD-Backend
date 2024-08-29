export function createUser(overrides = {}) {
    return {
      id: overrides.id || 1,
      email: overrides.email || "test@example.com",
      senha: overrides.senha || "hashedpassword",
      nome: overrides.nome || "Test User",
      ...overrides,
    };
  }
  
  export function createToken() {
    return "valid-token";
  }
  