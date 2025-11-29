import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

router.get('/plans', async (req: Request, res: Response) => {
 try {
  const [rows] = await pool.query('SELECT * FROM insurance_plans');
  res.json(rows);
 } catch (error) {
  res.status(500).json({ error: 'Erro ao buscar planos' });
 }
});

router.get('/my/:userId', async (req: Request, res: Response) => {
 try {
  const sql = `
      SELECT ui.id, ui.hired_at, p.name, p.description, p.monthly_price, p.coverage_amount, p.icon_type 
      FROM user_insurances ui 
      JOIN insurance_plans p ON ui.plan_id = p.id 
      WHERE ui.user_id = ?
    `;
  const [rows] = await pool.query(sql, [req.params.userId]);
  res.json(rows);
 } catch (error) {
  res.status(500).json({ error: 'Erro ao buscar meus seguros' });
 }
});

router.post('/buy', async (req: Request, res: Response) => {
 try {
  const { userId, planId } = req.body;

  await pool.query('INSERT INTO user_insurances (user_id, plan_id) VALUES (?, ?)', [userId, planId]);

  await pool.query(
   `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'success')`,
   [userId, 'Seguro Contratado', 'Sua apólice está ativa. Você agora está protegido!']
  );

  res.json({ message: 'Seguro contratado!' });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao contratar' });
 }
});

router.delete('/cancel/:id', async (req: Request, res: Response) => {
 try {
  await pool.query('DELETE FROM user_insurances WHERE id = ?', [req.params.id]);
  res.json({ message: 'Seguro cancelado.' });
 } catch (error) {
  res.status(500).json({ error: 'Erro ao cancelar' });
 }
});

export default router;
