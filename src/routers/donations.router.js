import express from 'express';
import { createDonation, getDonationsByUser, getDonationById, getPacoteQrCode } from '../controllers/donations.controller.js';
import { schemaValidation } from '../middlewares/schema.validation.js';
import { tokenValidation } from '../middlewares/token.validation.js';
import { createDonationSchema } from '../schemas/donations.schema.js';

const donationRouter = express.Router();

donationRouter.use(tokenValidation); 
// donationRouter.post('/', schemaValidation(createDonationSchema), createDonation);
donationRouter.get('/', getDonationsByUser);
donationRouter.get('/:id', getDonationById);
donationRouter.post('/donations', tokenValidation, createDonation);
donationRouter.get('/pacotes/:id/qrcode', getPacoteQrCode);

export default donationRouter;
