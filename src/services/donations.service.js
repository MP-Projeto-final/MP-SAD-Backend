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

export async function createDonationWithPackage(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado) {
    const donation = await donationRepository.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
    
    const qrCodeBuffer = await generateQrCodeForDonation(donation.id);
    const pacote = await donationRepository.createPacote(donation.id, qrCodeBuffer, 'Criado');
    
    return { donation, pacote };
}


export async function generateQrCodeForDonation(donationId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Doacao ID: ${donationId}`);
    return qrCodeBuffer; 
}

export async function getPacoteQrCode(id) {
    const qrCodeBinary = await donationRepository.getPacoteQrCodeById(id);
    if (!qrCodeBinary) {
        const error = new Error('QR code não encontrado');
        error.status = 404;
        throw error;
    }
    return qrCodeBinary;
}

export async function createMedia(pacoteId, tipo, imagemBuffer) {
    return await donationRepository.createMedia(pacoteId, tipo, imagemBuffer);
  }
  
  export async function getMediaByPackageId(pacoteId) {
    const midias = await donationRepository.getMediaByPackageId(pacoteId);
    if (midias.length === 0) {
      const error = new Error("Nenhuma mídia encontrada para este pacote");
      error.status = 404;
      throw error;
    }
    return midias;
  }