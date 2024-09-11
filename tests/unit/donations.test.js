import test from 'tape';
import * as donationService from '../../src/services/donations.service.js';
import * as donationRepository from '../../src/repository/donations.repository.js';
import sinon from 'sinon';

/**
 * Test case for createDonation function.
 * Verifies that a new donation is created successfully.
 */
test('createDonation - Deve criar uma nova doação', async (t) => {
    // Stub the donationRepository.createDonation method to return a predefined result
    const stub = sinon.stub(donationRepository, 'createDonation').resolves({
        id: 1,
        id_usuario: 1,
        descricao: 'Doação de roupas',
        destino: 'Campanha de Inverno'
    });

    // Call the donationService.createDonation function
    const donation = await donationService.createDonation(1, 'Doação de roupas', 'Campanha de Inverno');

    // Assert that the result matches the expected output
    t.deepEqual(donation, {
        id: 1,
        id_usuario: 1,
        descricao: 'Doação de roupas',
        destino: 'Campanha de Inverno'
    }, 'Doação criada com sucesso');
    
    // Restore the original method
    stub.restore();
    t.end();
});
