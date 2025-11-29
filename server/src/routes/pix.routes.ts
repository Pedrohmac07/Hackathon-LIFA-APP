import { Router, Request, Response } from 'express';
import { pool } from '../database';

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { senderId, email, amount } = req.body;
    const value = parseFloat(amount);

    if (value <= 0) return res.status(400).json({ error: 'Valor inválido' });

    const [senderRows]: any = await pool.query('SELECT balance, name FROM users WHERE id = ?', [senderId]);
    const sender = senderRows[0];
    if (sender.balance < value) return res.status(400).json({ error: 'Saldo insuficiente' });

    const [receiverRows]: any = await pool.query('SELECT id, name, balance FROM users WHERE email = ?', [email]);
    if (receiverRows.length === 0) return res.status(404).json({ error: 'E-mail não encontrado' });
    const receiver = receiverRows[0];

    if (receiver.id === senderId) return res.status(400).json({ error: 'Não pode transferir para si mesmo' });

    await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [value, senderId]);
    await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [value, receiver.id]);

    await pool.query(
      `INSERT INTO transactions (user_id, type, value, description, category) VALUES (?, 'saida', ?, ?, 'Transferência')`,
      [senderId, value, `Pix para ${receiver.name}`]
    );
    await pool.query(
      `INSERT INTO transactions (user_id, type, value, description, category) VALUES (?, 'entrada', ?, ?, 'Transferência')`,
      [receiver.id, value, `Pix recebido de ${sender.name}`]
    );

    await pool.query(`INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Pix Enviado', ?, 'info')`,
      [senderId, `Você enviou R$ ${value} para ${receiver.name}`]);

    await pool.query(`INSERT INTO notifications (user_id, title, message, type) VALUES (?, 'Pix Recebido', ?, 'success')`,
      [receiver.id, `Você recebeu R$ ${value} de ${sender.name}`]);

    res.json({ message: 'Pix realizado com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar Pix' });
  }
});

export default router;
