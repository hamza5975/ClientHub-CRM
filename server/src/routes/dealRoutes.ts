import { Router } from 'express';
import * as dealController from '../controllers/dealController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', dealController.getDeals);
router.get('/stats', dealController.getDealStats);
router.get('/:id', dealController.getDealById);
router.post('/', dealController.createDeal);
router.put('/:id', dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);

export default router;
