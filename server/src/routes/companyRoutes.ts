import { Router } from 'express';
import * as companyController from '../controllers/companyController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
