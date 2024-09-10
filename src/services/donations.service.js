import * as donationRepository from "../repository/donations.repository.js";
import QRCode from 'qrcode';

export async function createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado) {
    return await donationRepository.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
}

export async function getDonationsByUser(userId) {
    return await donationRepository.getDonationsByUser(userId);
}

export async function getDonationById(donationId) {
    const donation = await donationRepository.getDonationById(donationId);
    if (!donation) {
        const error = new Error("Doação não encontrada");
        error.status = 404;
        throw error;
    }
    return donation;
}

export async function createDonationWithPackage(userId,descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado) {
    const donation = await donationRepository.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
    
    const trackingLink = `http://localhost:3000/tracking/${donation.id}`;  
    const qrCode = await QRCode.toDataURL(trackingLink);  
   
    const pacote = await donationRepository.createPacote(donation.id, qrCode, 'Criado');

    return { donation, pacote };
}