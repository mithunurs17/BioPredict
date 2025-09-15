import { Router } from 'express';
import { 
  predictBlood,
  predictSaliva,
  predictUrine,
  predictCSF,
  getPredictionHistory
} from '../controllers/prediction';

const router = Router();

// Prediction routes
router.post('/blood', predictBlood);
router.post('/saliva', predictSaliva);
router.post('/urine', predictUrine);
router.post('/csf', predictCSF);

// History route
router.get('/history', getPredictionHistory);

export default router; 