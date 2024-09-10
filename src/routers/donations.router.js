import express from 'express';
import { createDonation, getDonationsByUser, updatePacoteStatusAndUploadMedia, getDonationById, getPacoteQrCode, uploadMedia, getMediaByPackageId } from '../controllers/donations.controller.js';
import { schemaValidation } from '../middlewares/schema.validation.js';
import { tokenValidation } from '../middlewares/token.validation.js';
import { createDonationSchema } from '../schemas/donations.schema.js';
import multer from "multer";

const donationRouter = express.Router();
const upload = multer();

donationRouter.get('/my', tokenValidation, getDonationsByUser);
donationRouter.get('/:id', tokenValidation, getDonationById);
donationRouter.post('/donations', tokenValidation, createDonation);
donationRouter.get('/pacotes/:id/qrcode', getPacoteQrCode);
donationRouter.post('/media/upload', upload.single('imagem'), uploadMedia);
donationRouter.get('/media/:pacoteId', getMediaByPackageId);
donationRouter.put('/pacotes/:id/status', upload.single('imagem'), updatePacoteStatusAndUploadMedia);

export default donationRouter;
