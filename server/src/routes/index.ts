import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cardsRoutes from './cards.routes';
import insuranceRoutes from './insurance.routes';
import loansRoutes from './loans.routes';
import aiRoutes from './ai.routes';
import notificationsRoutes from './notifications.routes';
import pixRoutes from './pix.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('API LIFA - Sistema Operacional 🚀');
});

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/cards', cardsRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/loans', loansRoutes);
router.use('/', aiRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/pix', pixRoutes);
router.use('/admin', adminRoutes);

export { router };
