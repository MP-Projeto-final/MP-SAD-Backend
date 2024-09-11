import * as donationRepository from "../repository/donations.repository.js";
import qrcode from 'qrcode';
import QRCode from 'qrcode';
import { db } from "../database.js";

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


// export async function createDonationWithPackage(
//     userId,
//     descricao,
//     destino_cep,
//     destino_rua,
//     destino_numero,
//     destino_complemento,
//     destino_bairro,
//     destino_cidade,
//     destino_estado,
//     origem_cidade,
//     origem_estado
//   ) {
   
//     const client = await donationRepository.beginTransaction();
  
//     try {
//       const donation = await donationRepository.createDonation(
//         client,
//         userId,
//         descricao,
//         destino_cep,
//         destino_rua,
//         destino_numero,
//         destino_complemento,
//         destino_bairro,
//         destino_cidade,
//         destino_estado,
//         origem_cidade,
//         origem_estado
//       );
  
//       const pacote = await donationRepository.createPacote(client, donation.id);
  
//       await donationRepository.insertEstatistica(
//         client,
//         origem_cidade,
//         origem_estado,
//         destino_cidade,
//         destino_estado
//       );

//       await donationRepository.commitTransaction(client);
  
//       return { donation, pacote };
//     } catch (error) {
//       await donationRepository.rollbackTransaction(client);
//       throw error;
//     }
//   }

// export async function generateQrCode(doacaoId, pacoteId) {
//     const qrCodeData = `Doacao ID: ${doacaoId}, Pacote ID: ${pacoteId}`;  
//     try {
//         const qrCodeImage = await QRCode.toDataURL(qrCodeData);  
//         return qrCodeImage;
//     } catch (error) {
//         throw new Error('Erro ao gerar o QR Code');
//     }
// }

// export async function createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado) {
//     const query = `
//         INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
//         VALUES (NOW(), $1, $2, $3, $4)
//     `;
    
//     await db.none(query, [origem_cidade, origem_estado, destino_cidade, destino_estado]);
// }


export async function createDonationWithPackage(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado) {
    // Cria a doação
    const donation = await donationRepository.createDonation(
        userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
        destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
    );

    // Cria o pacote vinculado à doação
    const pacote = await donationRepository.createPackage(donation.id);

    // Insere as estatísticas na tabela
    await donationRepository.createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado);

    return { donation, pacote };
}

// Função para gerar QR Code
export async function generateQrCode(donationId, pacoteId) {
    const qrCodeData = `Doacao ID: ${donationId}, Pacote ID: ${pacoteId}`;
    return await QRCode.toDataURL(qrCodeData);  // Retorna a URL do QR Code gerado
}

// Função para criar estatística
export async function createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado) {
    console.log("Dados para inserir em Estatisticas:", { origem_cidade, origem_estado, destino_cidade, destino_estado });

    const estatisticaQuery = `
        INSERT INTO Estatisticas (data_hora, origem_cidade, origem_estado, destino_cidade, destino_estado)
        VALUES (NOW(), $1, $2, $3, $4)
    `;
    const estatisticaValues = [origem_cidade, origem_estado, destino_cidade, destino_estado];

    await db.none(estatisticaQuery, estatisticaValues);
    console.log("Inserção de estatística concluída.");
}
