import { Router, Request, Response } from 'express';

// Importação das rotas modulares
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

// Rota de Teste (Health Check)
router.get('/', (req: Request, res: Response) => {
  res.send('API LIFA - Sistema Operacional 🚀');
});

// ===============================================
// MAPA DE ROTAS
// ===============================================

// Autenticação (Login/Cadastro)
router.use('/', authRoutes);

// Dados do Usuário (Feed, Saldo, Stats)
router.use('/', userRoutes);

// Cartões (Criar, Listar, Deletar)
router.use('/cards', cardsRoutes);

// Seguros (Planos, Contratar)
router.use('/insurance', insuranceRoutes);

// Empréstimos (Simular, Contratar)
router.use('/loans', loansRoutes);

// Inteligência Artificial (Insights, Relatórios)
router.use('/', aiRoutes);

// Notificações (Sininho)
router.use('/notifications', notificationsRoutes);

// Pix (Transferências)
router.use('/pix', pixRoutes);

// Admin (Painel de Controle, Add Saldo)
router.use('/admin', adminRoutes);

export { router };
