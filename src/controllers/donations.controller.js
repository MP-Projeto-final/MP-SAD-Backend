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

export async function createDonation(req, res) {
    const { descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado } = req.body;
    const userId = res.locals.user.id; 

    try {
        const { donation, pacote } = await donationService.createDonationWithPackage(userId, descricao, destino_cep, destino_rua, destino_numero, destino_complemento, destino_bairro, destino_cidade, destino_estado);
        res.status(201).json({ donation, pacote, qrCode: pacote.qrcode });
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
