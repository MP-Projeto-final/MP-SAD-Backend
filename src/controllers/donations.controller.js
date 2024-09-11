import * as donationService from "../services/donations.service.js";

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
        res.status(error.status || 500).send(error.message);
    }
}


export async function getDonationsByUser(req, res) {
    const userId = res.locals.user.id; 

    try {
        const donations = await donationService.getDonationsByUser(userId);
        res.send(donations);
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

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

export async function getStatistics(req, res) {
    try {
        const stats = await donationService.getStatistics();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
}

export async function getMediaByPackageId(req, res) {
    const { pacoteId } = req.params;
  
    try {
      const midias = await donationService.getMediaByPackageId(pacoteId);
      res.status(200).json(midias);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
}

export async function updatePacoteStatusAndUploadMedia(req, res) {
    const { id } = req.params; 
    const { status } = req.body; 
    const files = req.files;
  
    try {
      await donationService.updateStatus(id, status);

      if (files && files.length > 0) {
        await donationService.uploadMediaForPacote(id, files);
      }
  
      res.status(200).send({ message: 'Status atualizado e mídias enviadas com sucesso!' });
    } catch (error) {
      res.status(500).send({ error: 'Erro ao atualizar o status e enviar as mídias.' });
    }
}
  

