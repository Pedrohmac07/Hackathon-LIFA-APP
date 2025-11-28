import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

// Buscar cartões
router.get('/:userId', async (req: Request, res: Response) => {
 try {
  const sql = `SELECT id, type, card_number, holder_name, expiration_date, limit_amount, current_invoice FROM cards WHERE user_id = ?`;
  const [rows]: any = await pool.query(sql, [req.params.userId]);

  const credit = rows.find((c: any) => c.type === 'credito');
  const debit = rows.find((c: any) => c.type === 'debito');

  res.json({ credit, debit });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao buscar cartões' });
 }
});

// Criar cartão (+ Notificação)
router.post('/create', async (req: Request, res: Response) => {
 try {
  const { userId, type } = req.body;

  const [users]: any = await pool.query('SELECT name, credit_score FROM users WHERE id = ?', [userId]);
  if (users.length === 0) return res.status(404).json({ error: 'User not found' });
  const user = users[0];

  // Gera dados fictícios
  const prefix = type === 'credito' ? '5502' : '4200';
  const rand = () => Math.floor(1000 + Math.random() * 9000);
  const num = `${prefix} ${rand()} ${rand()} ${rand()}`;
  const today = new Date();
  const exp = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear() + 5).slice(-2)}`;
  const limit = type === 'credito' ? user.credit_score * 10 : 0;

  // 1. Salva Cartão
  await pool.query(
   `INSERT INTO cards (user_id, type, card_number, holder_name, expiration_date, cvv, limit_amount, current_invoice) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
   [userId, type, num, user.name.toUpperCase(), exp, 123, limit]
  );

  // 2. Gera Notificação 🔔
  await pool.query(
   `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'success')`,
   [userId, 'Cartão Emitido', `Seu cartão de ${type} final ${num.slice(-4)} foi emitido e já pode ser usado!`]
  );

  res.json({ message: 'Cartão criado!' });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao criar cartão' });
 }
});

// Deletar cartão
router.delete('/delete/:cardId', async (req: Request, res: Response) => {
 try {
  await pool.query('DELETE FROM cards WHERE id = ?', [req.params.cardId]);
  res.json({ message: 'Cartão excluído com sucesso!' });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao excluir cartão' });
 }
});

export default router;
