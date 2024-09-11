import * as donationRepository from "../repository/donations.repository.js";
import qrcode from 'qrcode';
import QRCode from 'qrcode';
import { db } from "../database.js";

/**
 * Creates a new donation with the provided details.
 * 
 * @param {number} userId - The ID of the user making the donation.
 * @param {string} descricao - The description of the donation.
 * @param {string} destino_cep - The postal code of the donation destination.
 * @param {string} destino_rua - The street of the donation destination.
 * @param {string} destino_numero - The number of the donation destination.
 * @param {string} destino_complemento - Additional address information for the donation destination.
 * @param {string} destino_bairro - The neighborhood of the donation destination.
 * @param {string} destino_cidade - The city of the donation destination.
 * @param {string} destino_estado - The state of the donation destination.
 * 
 * @returns {Object} Returns the created donation object.
 */
export async function createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado) {
    return await donationRepository.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
}

/**
 * Retrieves all donations made by a specific user.
 * 
 * @param {number} userId - The ID of the user whose donations are to be retrieved.
 * 
 * @returns {Array} Returns a list of donations made by the user.
 */
export async function getDonationsByUser(userId) {
    return await donationRepository.getDonationsByUser(userId);
}

/**
 * Retrieves a donation by its ID.
 * 
 * @param {number} donationId - The ID of the donation to be retrieved.
 * 
 * @returns {Object} Returns the donation object if found.
 * 
 * @throws {Error} Throws a 404 error if the donation is not found.
 */
export async function getDonationById(donationId) {
    const donation = await donationRepository.getDonationById(donationId);
    if (!donation) {
        const error = new Error("Doação não encontrada");
        error.status = 404;
        throw error;
    }
    return donation;
}

/**
 * Generates a QR code for a donation.
 * 
 * @param {number} donationId - The ID of the donation for which to generate the QR code.
 * 
 * @returns {Buffer} Returns the QR code as a buffer.
 */
export async function generateQrCodeForDonation(donationId) {
    const qrCodeBuffer = await qrcode.toBuffer(`Doacao ID: ${donationId}`);
    return qrCodeBuffer; 
}

/**
 * Retrieves the QR code for a specific package.
 * 
 * @param {number} id - The ID of the package.
 * 
 * @returns {Buffer} Returns the QR code binary data if found.
 * 
 * @throws {Error} Throws a 404 error if the QR code is not found.
 */
export async function getPacoteQrCode(id) {
    const qrCodeBinary = await donationRepository.getPacoteQrCodeById(id);
    if (!qrCodeBinary) {
        const error = new Error('QR code não encontrado');
        error.status = 404;
        throw error;
    }
    return qrCodeBinary;
}

/**
 * Creates a new media record for a package.
 * 
 * @param {number} pacoteId - The ID of the package to associate with the media.
 * @param {string} tipo - The type of media (e.g., 'image/jpeg').
 * @param {Buffer} imagemBuffer - The image data as a buffer.
 * 
 * @returns {Object} Returns the created media record.
 */
export async function createMedia(pacoteId, tipo, imagemBuffer) {
    return await donationRepository.createMedia(pacoteId, tipo, imagemBuffer);
}
  
/**
 * Retrieves media associated with a specific package.
 * 
 * @param {number} pacoteId - The ID of the package for which to retrieve media.
 * 
 * @returns {Array} Returns a list of media records for the package.
 * 
 * @throws {Error} Throws a 404 error if no media is found for the package.
 */
export async function getMediaByPackageId(pacoteId) {
    const midias = await donationRepository.getMediaByPackageId(pacoteId);
    if (midias.length === 0) {
      const error = new Error("Nenhuma mídia encontrada para este pacote");
      error.status = 404;
      throw error;
    }
    return midias;
}

/**
 * Updates the status of a package.
 * 
 * @param {number} pacoteId - The ID of the package to update.
 * @param {string} status - The new status for the package.
 */
export async function updateStatus(pacoteId, status) {
    await donationRepository.updatePacoteStatus(pacoteId, status);
}
  
/**
 * Uploads multiple media files for a specific package.
 * 
 * @param {number} pacoteId - The ID of the package to associate with the uploaded media.
 * @param {Array} files - An array of file objects, each containing mimetype and buffer properties.
 */
export async function uploadMediaForPacote(pacoteId, files) {
    const mediaUploads = files.map(file => {
      return donationRepository.createMedia(pacoteId, file.mimetype, file.buffer);
    });
    await Promise.all(mediaUploads);
}

/**
 * Retrieves various statistics related to donations and packages.
 * 
 * @returns {Object} Returns an object containing different statistics.
 */
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


/**
 * Creates a donation along with a package and updates the statistics.
 * 
 * @param {number} userId - The ID of the user making the donation.
 * @param {string} descricao - The description of the donation.
 * @param {string} destino_cep - The postal code of the donation destination.
 * @param {string} destino_rua - The street of the donation destination.
 * @param {string} destino_numero - The number of the donation destination.
 * @param {string} destino_complemento - Additional address information for the donation destination.
 * @param {string} destino_bairro - The neighborhood of the donation destination.
 * @param {string} destino_cidade - The city of the donation destination.
 * @param {string} destino_estado - The state of the donation destination.
 * @param {string} origem_cidade - The city of the donation origin.
 * @param {string} origem_estado - The state of the donation origin.
 * 
 * @returns {Object} Returns the created donation and package objects.
 */
export async function createDonationWithPackage(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado) {
    const donation = await donationRepository.createDonation(
        userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
        destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
    );

    const pacote = await donationRepository.createPackage(donation.id);

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
