import { Router, Request, Response } from 'express';
import { pool } from '../database';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate-insight', async (req: Request, res: Response) => {
 try {
  const { descricao, valor, categoria } = req.body;
  const completion = await groq.chat.completions.create({
   messages: [
    { role: "system", content: "Você é a LIFA, consultora financeira profissional. Responda JSON." },
    { role: "user", content: `Analise: ${descricao}, R$ ${valor}, ${categoria}. JSON: { "insight": "...", "action": "..." }` }
   ],
   model: "llama-3.3-70b-versatile",
   temperature: 0.3,
   response_format: { type: "json_object" }
  });
  res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
 } catch (e) { res.json({ insight: "Erro na análise.", action: null }); }
});

router.post('/generate-report', async (req: Request, res: Response) => {
 try {
  const { userId } = req.body;

  const [rows]: any = await pool.query('SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type', [userId]);
  const receitas = rows.find((r: any) => r.type === 'entrada')?.total || 0;
  const despesas = rows.find((r: any) => r.type === 'saida')?.total || 0;
  const saldo = receitas - despesas;

  const [rowsCat]: any = await pool.query("SELECT category, SUM(value) as total FROM transactions WHERE user_id = ? AND type = 'saida' GROUP BY category ORDER BY total DESC LIMIT 3", [userId]);
  const topGastos = rowsCat.map((c: any) => `${c.category}: R$${c.total}`).join(', ');

  const prompt = `
      Você é a LIFA, uma consultora financeira pessoal.
      Analise os dados reais do mês deste usuário:
      - Entradas: R$ ${receitas}
      - Saídas: R$ ${despesas}
      - Saldo: R$ ${saldo}
      - Maiores gastos: ${topGastos}

      Gere um relatório analítico direto e personalizado.
      
      REGRAS OBRIGATÓRIAS:
      1. NÃO coloque cabeçalhos como "Relatório Financeiro", "Data", "Assinatura" ou placeholders como "[Inserir nome]".
      2. Comece diretamente falando sobre o resultado (Déficit ou Superávit).
      3. Use **negrito** (entre asteriscos) para destacar valores e categorias importantes.
      4. Se o saldo for negativo, dê uma bronca educada e profissional. Se for positivo, parabenize.
      5. Termine com uma dica prática baseada nos maiores gastos.
      6. Use parágrafos curtos.
    `;

  const completion = await groq.chat.completions.create({
   messages: [{ role: "user", content: prompt }],
   model: "llama-3.3-70b-versatile",
   temperature: 0.5,
  });

  res.json({ report: completion.choices[0]?.message?.content });
 } catch (e) { res.status(500).json({ error: "Erro no relatório" }); }
});

export default router;
