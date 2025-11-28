import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

// Informações e Limite
router.get('/info/:userId', async (req: Request, res: Response) => {
 try {
  const [users]: any = await pool.query('SELECT credit_score FROM users WHERE id = ?', [req.params.userId]);
  if (users.length === 0) return res.status(404).json({ error: 'User not found' });

  const maxLimit = users[0].credit_score * 15;
  const [activeLoans]: any = await pool.query('SELECT * FROM loans WHERE user_id = ? AND status = "active"', [req.params.userId]);

  res.json({ maxLimit: maxLimit, activeLoan: activeLoans.length > 0 ? activeLoans[0] : null });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao buscar empréstimos' });
 }
});

// Pegar Empréstimo (+ Saldo + Notificação)
router.post('/create', async (req: Request, res: Response) => {
 try {
  const { userId, amount, installments } = req.body;

  const rate = 3.5;
  const totalPayable = amount * (1 + (rate / 100 * installments));
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  // 1. Cria Dívida
  const sql = `INSERT INTO loans (user_id, amount_borrowed, total_payable, installments, interest_rate, due_date) VALUES (?, ?, ?, ?, ?, ?)`;
  await pool.query(sql, [userId, amount, totalPayable, installments, rate, dueDate]);

  // 2. Deposita Dinheiro (Cash In)
  await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId]);

  // 3. Gera Notificação 🔔
  await pool.query(
   `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'warning')`,
   [userId, 'Dinheiro na Conta', `O empréstimo de R$ ${amount} foi aprovado e depositado!`]
  );

  res.json({ message: 'Empréstimo contratado!' });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao contratar' });
 }
});

export default router;
