import * as donationService from "../services/donations.service.js";

/**
 * Retrieves a QR code image for a package by its ID.
 * 
 * @param {Object} req - Express request object, expects params with package ID.
 * @param {Object} res - Express response object.
 * @returns {Buffer} - Returns a PNG image of the QR code.
 */
export async function getPacoteQrCode(req, res) {
    const { id } = req.params;

    try {
        const qrCodeBinary = await pacoteService.getPacoteQrCode(id);
        res.setHeader('Content-Type', 'image/png'); 
        res.send(qrCodeBinary); 
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

/**
 * Creates a donation with associated statistics.
 * 
 * @param {Number} userId - ID of the user making the donation.
 * @param {Object} donationData - Donation data including description, destination address, and origin.
 * @returns {Object} - Returns the created donation object.
 */
export async function createDonationWithStatistics(userId, donationData) {
    const { descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado } = donationData;

    const donation = await donationService.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado);

    try {
        await donationService.createEstatistica(origem_cidade, origem_estado, destino_cidade, destino_estado);
    } catch (error) {
        console.error("Erro ao criar estatística:", error);
    }

    return donation;
}

/**
 * Creates a donation, generates a package, and inserts statistics.
 * 
 * @param {Object} req - Express request object, expects body with donation details.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns the created donation, package, and QR code.
 */
export async function createDonation(req, res) {
    const { 
        descricao, 
        destino_cep, 
        destino_rua, 
        destino_numero, 
        destino_complemento, 
        destino_bairro, 
        destino_cidade,  
        destino_estado, 
        origem_cidade,   
        origem_estado    
    } = req.body;

    const userId = res.locals.user.id; 

    try {
        const { donation, pacote } = await donationService.createDonationWithPackage(
            userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, 
            destino_bairro, destino_cidade, destino_estado, origem_cidade, origem_estado
        );

        const qrCode = await donationService.generateQrCode(donation.id, pacote.id);

        res.status(201).json({ donation, pacote, qrCode });
    } catch (error) {
        console.error("Erro ao criar doação ou inserir estatísticas:", error);
        res.status(error.status || 500).send(error.message);
    }
}

/**
 * Retrieves all donations made by a specific user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Array} - Returns a list of donations.
 */
export async function getDonationsByUser(req, res) {
    const userId = res.locals.user.id; 

    try {
        const donations = await donationService.getDonationsByUser(userId);
        res.send(donations);
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

/**
 * Retrieves donation details by donation ID.
 * 
 * @param {Object} req - Express request object, expects params with donation ID.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns the donation details or a 404 if not found.
 */
export async function getDonationById(req, res) {
    const { id } = req.params;

    try {
        const donationData = await donationService.getDonationById(id);

        if (!donationData) {
            return res.status(404).json({ message: 'Doação não encontrada' });
        }

        res.json(donationData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Uploads media (images/videos) for a package.
 * 
 * @param {Object} req - Express request object, expects body with package ID and file data.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns the uploaded media details.
 */
export async function uploadMedia(req, res) {
    const { pacoteId } = req.body;
    const tipo = req.file.mimetype;  
    const imagemBuffer = req.file.buffer; 
  
    try {
      const midia = await donationService.createMedia(pacoteId, tipo, imagemBuffer);
      res.status(201).json(midia);  
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
}

/**
 * Retrieves donation statistics.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns donation statistics data.
 */
export async function getStatistics(req, res) {
    try {
        const stats = await donationService.getStatistics();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
}

/**
 * Retrieves media associated with a specific package ID.
 * 
 * @param {Object} req - Express request object, expects params with package ID.
 * @param {Object} res - Express response object.
 * @returns {Array} - Returns a list of media objects.
 */
export async function getMediaByPackageId(req, res) {
    const { pacoteId } = req.params;
  
    try {
      const midias = await donationService.getMediaByPackageId(pacoteId);
      res.status(200).json(midias);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
}

/**
 * Updates the status of a package and uploads associated media if provided.
 * 
 * @param {Object} req - Express request object, expects params with package ID and body with status.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns a success message or error.
 */
export async function updatePacoteStatusAndUploadMedia(req, res) {
    const { id } = req.params; 
    const { status } = req.body; 
    const file = req.file;

    try {
        await donationService.updateStatus(id, status);

        if (file) {
            await donationService.createMedia(id, file.mimetype, file.buffer); 
        }

        res.status(200).send({ message: 'Status atualizado e mídia enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar o status e enviar a mídia:', error);
        res.status(500).json({ message: 'Erro ao atualizar o status e enviar a mídia.' });
    }
}
