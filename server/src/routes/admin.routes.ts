import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

router.post('/add-balance', async (req: Request, res: Response) => {
 try {
  const { userId, amount } = req.body;
  const value = parseFloat(String(amount).replace(',', '.'));

  if (isNaN(value) || value <= 0) return res.status(400).json({ error: 'Valor inválido' });

  await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [value, userId]);

  // Extrato
  await pool.query(
   `INSERT INTO transactions (user_id, type, value, description, category) VALUES (?, 'entrada', ?, 'Depósito Admin', 'Outros')`,
   [userId, value]
  );

  res.json({ message: 'Saldo adicionado!' });
 } catch (error) {
  res.status(500).json({ error: 'Erro no admin' });
 }
});

router.post('/add-expense', async (req, res) => {
 try {
  const { userId, description, value, category } = req.body; // <-- 'value' vem do front
  const amountVal = parseFloat(String(value).replace(',', '.'));

  if (isNaN(amountVal) || amountVal <= 0) return res.status(400).json({ error: 'Valor inválido' });
  if (!description) return res.status(400).json({ error: 'Descrição faltando' });

  // 1. Tira do Saldo
  await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amountVal, userId]);

  // 2. Cria Transação
  await pool.query(
   `INSERT INTO transactions (user_id, type, value, description, category) VALUES (?, 'saida', ?, ?, ?)`,
   [userId, amountVal, description, category || 'Outros']
  );

  res.json({ message: 'Gasto registrado!' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Erro no admin' });
 }
});

export default router;
