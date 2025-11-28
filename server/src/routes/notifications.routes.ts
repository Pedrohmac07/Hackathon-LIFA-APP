import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`;
    const [rows] = await pool.query(sql, [req.params.userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

export default router;
