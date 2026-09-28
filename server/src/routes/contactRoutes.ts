import { Router } from 'express';
import * as contactController from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContactById);
router.post('/', contactController.createContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
