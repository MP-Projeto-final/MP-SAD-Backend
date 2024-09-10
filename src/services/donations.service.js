import * as donationRepository from "../repository/donations.repository.js";
import QRCode from 'qrcode';
import qrcode from 'qrcode';

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

export async function createDonationWithPackage(userId, descricao, cep, rua, numero, complemento, bairro, cidade, estado) {
    // Cria a doação
    const donation = await donationRepository.createDonation(userId, descricao, cep, rua, numero, complemento, bairro, cidade, estado);
    
    // Gera o QR code para a doação
    const qrCodeBuffer = await generateQrCodeForDonation(donation.id);
    
    // Cria o pacote associado à doação com o QR code gerado
    const pacote = await pacoteRepository.createPacote(donation.id, qrCodeBuffer, 'Criado');
    
    return { donation, pacote };
}

// Função para gerar o QR code (deve ficar aqui no service)
export async function generateQrCodeForDonation(donationId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Doacao ID: ${donationId}`);
    return qrCodeBuffer; // Retorna o buffer binário do QR code
}

export async function getPacoteQrCode(id) {
    const qrCodeBinary = await pacoteRepository.getPacoteQrCodeById(id);
    if (!qrCodeBinary) {
        const error = new Error('QR code não encontrado');
        error.status = 404;
        throw error;
    }
    return qrCodeBinary;
}