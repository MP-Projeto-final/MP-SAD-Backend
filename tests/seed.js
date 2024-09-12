// seed.js (Populando o banco de dados com dados de teste)
import User from './model.js';

export async function seedDatabase() {
  await User.sync({ force: true }); // Limpa o banco e recria a tabela
  await User.create({ name: 'Admin', email: 'admin@example.com' });
  await User.create({ name: 'User1', email: 'user1@example.com' });
}
