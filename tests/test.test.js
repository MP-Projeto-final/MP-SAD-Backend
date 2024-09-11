import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import { seedDatabase } from './seed.js';
import sequelize from './db.js';
import app from '../src/app.js';
import seedEstatisticas from './seed.js';
chai.use(chaiAsPromised);

before(async function () {
  await sequelize.authenticate();
  await seedDatabase();
});

after(async function () {
  await sequelize.close();
});

describe('User Model', function () {
  before(async function () {
    await sequelize.authenticate();
    await seedDatabase();
  });

  after(async function () {
    await sequelize.close();
  });

  it('Deve criar um novo usuário', async function () {
    const newUser = await User.create({ name: 'User2', email: 'user2@example.com' });
    expect(newUser.name).to.equal('User2');
  });

  it('Deve buscar um usuário pelo email', async function () {
    const user = await User.findOne({ where: { email: 'admin@example.com' } });
    expect(user).to.not.be.null;
    expect(user.name).to.equal('Admin');
  });
});

describe('Donation Controller - Integração', function () {
  before(async function () {
    await sequelize.sync({ force: true });
    await seedDatabase();
  });

  after(async function () {
    await sequelize.close();
  });

  it('Deve criar uma doação e retornar status 201', async function () {
    const res = await chai.request(app)
      .post('/donations')
      .send({
        descricao: 'Doação de alimentos',
        destino_cep: '12345-678',
        destino_rua: 'Rua Exemplo',
        destino_numero: '123',
        destino_complemento: '',
        destino_bairro: 'Bairro Exemplo',
        destino_cidade: 'São Paulo',
        destino_estado: 'SP',
        origem_cidade: 'Rio de Janeiro',
        origem_estado: 'RJ'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('donation');
    expect(res.body.donation.descricao).to.equal('Doação de alimentos');
  });

  it('Deve retornar todas as doações de um usuário', async function () {
    const res = await chai.request(app)
      .get('/donations/user')
      .set('Authorization', 'Bearer <token>');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('descricao', 'Doação de roupas');
  });

  it('Deve buscar detalhes de uma doação por ID', async function () {
    const res = await chai.request(app).get('/donations/1');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('descricao', 'Doação de roupas');
  });

  it('Deve retornar 404 quando a doação não for encontrada', async function () {
    const res = await chai.request(app).get('/donations/999');
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message', 'Doação não encontrada');
  });

  it('Deve retornar estatísticas de doações com sucesso', async function () {
    const res = await chai.request(app).get('/donations/statistics');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('totalDonations');
  });
});
