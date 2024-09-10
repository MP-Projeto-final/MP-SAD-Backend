import * as donationService from "../services/donations.service.js";

// export async function createDonation(req, res) {
//     const { descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado } = req.body;
//     const userId = res.locals.user.id; 
//     console.log("ID do usuário autenticado para criar a doação:", userId);

//     try {
//         const donation = await donationService.createDonation(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
//         res.status(201).send(donation);
//     } catch (error) {
//         res.status(error.status || 500).send(error.message);
//     }
// }

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
    const { descricao, cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
    const userId = res.locals.user.id;

    try {
        // Chama o serviço para criar a doação e o pacote
        const { donation, pacote } = await donationService.createDonationWithPackage(userId, descricao, cep, rua, numero, complemento, bairro, cidade, estado);
        
        // Envia a resposta com a doação, pacote e QR code já em base64
        res.status(201).json({ donation, pacote, qrCode: `data:image/png;base64,${pacote.qrcode}` });
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
        const donation = await donationService.getDonationById(id);
        res.send(donation);
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}
