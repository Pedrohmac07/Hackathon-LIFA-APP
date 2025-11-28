
import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos!' });

    const sql = 'INSERT INTO users (name, email, password, balance, credit_score) VALUES (?, ?, ?, 0.00, 400)';
    const [result]: any = await pool.query(sql, [nome, email, senha]);

    res.status(201).json({ userId: result.insertId, nome });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email já cadastrado!' });
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const [rows]: any = await pool.query('SELECT id, name FROM users WHERE email = ? AND password = ?', [email, senha]);

    if (rows.length > 0) {
      res.json({ userId: rows[0].id, nome: rows[0].name });
    } else {
      res.status(401).json({ error: 'Email ou senha incorretos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;
