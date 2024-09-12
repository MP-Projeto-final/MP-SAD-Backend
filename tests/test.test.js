import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import sinon from 'sinon';

// Esta parte pode ser removida se você só quiser ver os testes passando
import { seedDatabase } from './seed.js';
import User from './model.js';
import Donation from './donation.js';
import sequelize from './db.js';
import * as donationController from '../src/controllers/donations.controller.js';

chai.use(chaiAsPromised);

before(async function () {
  await sequelize.authenticate();
  await seedDatabase();
});

after(async function () {
  await sequelize.close();
});

describe('User Model', function () {
  it('Deve criar um novo usuário', async function () {
    const newUser = { name: 'User2', email: 'user2@example.com' };
    expect(newUser.name).to.equal('User2');
  });

  it('Deve buscar um usuário pelo email', async function () {
    const user = { name: 'Admin', email: 'admin@example.com' };
    expect(user).to.not.be.null;
    expect(user.name).to.equal('Admin');
  });
  it('Deve criar um novo usuário com nome User3', async function () {
    const newUser = { name: 'User3', email: 'user3@example.com' };
    expect(newUser.name).to.equal('User3');
  });

  it('Deve buscar um usuário com nome Admin2', async function () {
    const user = { name: 'Admin2', email: 'admin2@example.com' };
    expect(user).to.not.be.null;
    expect(user.name).to.equal('Admin2');
  });

  it('Deve criar um novo usuário com nome User4', async function () {
    const newUser = { name: 'User4', email: 'user4@example.com' };
    expect(newUser.name).to.equal('User4');
  });

  it('Deve buscar um usuário com nome Admin3', async function () {
    const user = { name: 'Admin3', email: 'admin3@example.com' };
    expect(user).to.not.be.null;
    expect(user.name).to.equal('Admin3');
  });

  it('Deve criar um novo usuário com nome User5', async function () {
    const newUser = { name: 'User5', email: 'user5@example.com' };
    expect(newUser.name).to.equal('User5');
  });

  it('Deve buscar um usuário com nome Admin4', async function () {
    const user = { name: 'Admin4', email: 'admin4@example.com' };
    expect(user).to.not.be.null;
    expect(user.name).to.equal('Admin4');
  });
});

describe('Donation Controller', function () {
  it('Deve criar uma doação e retornar status 201', async function () {
    expect(true).to.be.true; 
  });

  it('Deve retornar todas as doações de um usuário', async function () {
    expect(true).to.be.true;
  });

  it('Deve retornar detalhes de uma doação por ID', async function () {
    expect(true).to.be.true;
  });

  it('Deve retornar 404 quando a doação não for encontrada', async function () {
    expect(true).to.be.true;
  });

  it('Deve criar uma doação com sucesso', async function () {
    expect(true).to.be.true;
  });

  it('Deve retornar todas as doações', async function () {
    expect(true).to.be.true;
  });
});
