import User from './factories/user.js';
import Donation from './factories/donation.js';
import Estatistica from './factories/estatistica.js';

export async function seedDatabase() {
  await User.sync({ force: true });
  await Donation.sync({ force: true });
  await User.create({ name: 'Admin', email: 'admin@example.com' });
  await Donation.create({
    descricao: 'Doação de roupas',
    destino_cidade: 'São Paulo',
    destino_estado: 'SP',
    origem_cidade: 'Rio de Janeiro',
    origem_estado: 'RJ'
  });
}

export default async function seedEstatisticas() {
  await Estatistica.sync({ force: true });

  await Estatistica.create({
    origem_cidade: 'Cidade Origem',
    origem_estado: 'RJ',
    destino_cidade: 'Cidade Destino',
    destino_estado: 'SP',
    total_doacoes: 5
  });

  await Estatistica.create({
    origem_cidade: 'Cidade Origem 2',
    origem_estado: 'ES',
    destino_cidade: 'Cidade Exemplo',
    destino_estado: 'MG',
    total_doacoes: 3
  });
}