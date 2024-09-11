import express from 'express';
import { 
    createDonation, 
    getStatistics, 
    getDonationsByUser, 
    updatePacoteStatusAndUploadMedia, 
    getDonationById, 
    getPacoteQrCode, 
    uploadMedia, 
    getMediaByPackageId 
} from '../controllers/donations.controller.js';
import { tokenValidation } from '../middlewares/token.validation.js';
import multer from 'multer';

const donationRouter = express.Router();
const upload = multer();

/**
 * Route to get QR code for a package.
 * 
 * This route handles GET requests to '/pacotes/:id/qrcode'. It calls the `getPacoteQrCode` controller function
 * to retrieve the QR code for a package with the specified ID.
 */
donationRouter.get('/pacotes/:id/qrcode', getPacoteQrCode);

/**
 * Route to upload media files.
 * 
 * This route handles POST requests to '/media/upload'. It uses `multer` middleware to handle file uploads,
 * and then calls the `uploadMedia` controller function to process and store the uploaded media.
 */
donationRouter.post('/media/upload', upload.single('imagem'), uploadMedia);

/**
 * Route to get media associated with a package.
 * 
 * This route handles GET requests to '/media/:pacoteId'. It calls the `getMediaByPackageId` controller function
 * to retrieve media records for a package with the specified ID.
 */
donationRouter.get('/media/:pacoteId', getMediaByPackageId);

/**
 * Route to update the status of a package and upload media.
 * 
 * This route handles PUT requests to '/pacotes/:id/status'. It uses `multer` middleware to handle file uploads,
 * and then calls the `updatePacoteStatusAndUploadMedia` controller function to update the status of the package
 * and upload associated media.
 */
donationRouter.put('/pacotes/:id/status', upload.single('imagem'), updatePacoteStatusAndUploadMedia);

/**
 * Route to get donation statistics.
 * 
 * This route handles GET requests to '/stats'. It calls the `getStatistics` controller function
 * to retrieve overall donation statistics.
 */
donationRouter.get('/stats', getStatistics);

/**
 * Route to get donations by the authenticated user.
 * 
 * This route handles GET requests to '/my'. It uses the `tokenValidation` middleware to ensure the request is authenticated
 * and then calls the `getDonationsByUser` controller function to retrieve donations made by the authenticated user.
 */
donationRouter.get('/my', tokenValidation, getDonationsByUser);

/**
 * Route to get details of a specific donation.
 * 
 * This route handles GET requests to '/:id'. It uses the `tokenValidation` middleware to ensure the request is authenticated
 * and then calls the `getDonationById` controller function to retrieve details of the donation with the specified ID.
 */
donationRouter.get('/:id', tokenValidation, getDonationById);

/**
 * Route to create a new donation.
 * 
 * This route handles POST requests to '/donations'. It uses the `tokenValidation` middleware to ensure the request is authenticated
 * and then calls the `createDonation` controller function to create a new donation record.
 */
donationRouter.post('/donations', tokenValidation, createDonation);

export default donationRouter;
