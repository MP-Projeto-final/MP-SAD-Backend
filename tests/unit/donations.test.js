import test from 'tape';
import * as donationService from '../../src/services/donations.service.js';
import * as donationRepository from '../../src/repository/donations.repository.js';
import sinon from 'sinon';

test('createDonation - Deve criar uma nova doação', async (t) => {
    const stub = sinon.stub(donationRepository, 'createDonation').resolves({
        id: 1,
        id_usuario: 1,
        descricao: 'Doação de roupas',
        destino: 'Campanha de Inverno'
    });

    const donation = await donationService.createDonation(1, 'Doação de roupas', 'Campanha de Inverno');
    t.deepEqual(donation, {
        id: 1,
        id_usuario: 1,
        descricao: 'Doação de roupas',
        destino: 'Campanha de Inverno'
    }, 'Doação criada com sucesso');
    
    stub.restore();
    t.end();
});
