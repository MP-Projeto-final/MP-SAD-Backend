import * as donationRepository from "../repository/donations.repository.js";
import qrcode from 'qrcode';
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

export async function updateStatus(pacoteId, status) {
    await donationRepository.updatePacoteStatus(pacoteId, status);
}
  
export async function uploadMediaForPacote(pacoteId, files) {
    const mediaUploads = files.map(file => {
      return donationRepository.createMedia(pacoteId, file.mimetype, file.buffer);
    });
    await Promise.all(mediaUploads);
}

export async function getStatistics() {
    const totalDoacoesFeitas = await donationRepository.getTotalDoacoesFeitas();
    const totalDoacoesRecebidas = await donationRepository.getTotalDoacoesRecebidas();
    const localidadesDeOrigem = await donationRepository.getLocalidadesDeOrigem();
    const localidadesDeDestino = await donationRepository.getLocalidadesDeDestino();
    const itensDoacao = await donationRepository.getItensDoacao();
    const itensRecebidos = await donationRepository.getItensRecebidos();

    return {
        totalDoacoesFeitas,
        totalDoacoesRecebidas,
        localidadesDeOrigem,
        localidadesDeDestino,
        itensDoacao,
        itensRecebidos
    };
}

export async function createDonationWithPackage(
    userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
    destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
) {
    const donation = await donationRepository.createDonation(
        userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
        destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
    );
    
    const qrCodeBuffer = await generateQrCodeForDonation(donation.id);
    const pacote = await donationRepository.createPacote(donation.id, qrCodeBuffer, 'Criado');
    
    return { donation, pacote };
}

export async function generateQrCode(doacaoId, pacoteId) {
    const qrCodeData = `Doacao ID: ${doacaoId}, Pacote ID: ${pacoteId}`;  
    try {
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);  
        return qrCodeImage;
    } catch (error) {
        throw new Error('Erro ao gerar o QR Code');
    }
}