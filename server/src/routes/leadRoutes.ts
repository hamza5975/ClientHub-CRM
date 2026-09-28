import { Router } from 'express';
import * as leadController from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', leadController.getLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', leadController.getLeadById);
router.post('/', leadController.createLead);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export default router;
