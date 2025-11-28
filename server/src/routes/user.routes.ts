import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

// ... rota /user/:id continua igual ...
router.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, name as nome, email, balance as saldo, credit_score as score_credito FROM users WHERE id = ?';
    const [rows]: any = await pool.query(sql, [req.params.id]);
    if (rows.length > 0) return res.json(rows[0]);
    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no banco' });
  }
});

// 👇 AQUI ESTÁ A CORREÇÃO DO PIX VERMELHO
router.get('/feed/:userId', async (req, res) => {
  try {
    // Adicionei 'type' no SELECT
    const sql = `
      SELECT id, type, description, value, category, transaction_date 
      FROM transactions 
      WHERE user_id = ? 
      ORDER BY transaction_date DESC
    `;
    const [rows]: any = await pool.query(sql, [req.params.userId]);

    const feed = rows.map((row: any) => ({
      id: `trans-${row.id}`,
      type: 'TRANSACTION',
      data: {
        realType: row.type, // <--- Mandando a verdade ('entrada' ou 'saida')
        estabelecimento: row.description,
        valor: row.value,
        categoria: row.category,
        data: row.transaction_date
      }
    }));

    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar feed' });
  }
});

// ... rota /stats continua igual ...
router.get('/stats/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const [rowsTotais]: any = await pool.query('SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type', [userId]);
    let receitas = 0, despesas = 0;
    rowsTotais.forEach((row: any) => {
      if (row.type === 'entrada') receitas = Number(row.total);
      if (row.type === 'saida') despesas = Number(row.total);
    });
    const [rowsCat]: any = await pool.query("SELECT category, SUM(value) as total FROM transactions WHERE user_id = ? AND type = 'saida' GROUP BY category ORDER BY total DESC LIMIT 5", [userId]);
    const categorias = rowsCat.map((row: any) => ({
      nome: row.category,
      valor: Number(row.total),
      porcentagem: despesas > 0 ? (Number(row.total) / despesas) * 100 : 0
    }));
    res.json({ receitas, despesas, saldo_mes: receitas - despesas, categorias });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
});

export default router;
