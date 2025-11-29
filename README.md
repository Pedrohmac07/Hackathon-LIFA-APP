# LIFA - Financial Assistant App

A financial management application that leverages AI to provide personalized insights and reports for users' financial transactions. [1](#0-0) 

## Features

- **Transaction Management**: Track income and expenses with categorization
- **AI-Powered Insights**: Generate quick financial insights using Groq AI
- **Financial Reports**: Get personalized monthly financial analysis and recommendations
- **MySQL Database**: Reliable data storage for user transactions

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MySQL with connection pooling [2](#0-1) 
- **AI Integration**: Groq SDK with Llama 3.3 model [3](#0-2) 
- **Environment**: dotenv for configuration management

## Setup

### Prerequisites
- Node.js
- MySQL Server
- Groq API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=lifa_db
   GROQ_API_KEY=your_groq_api_key
   ```

4. Set up the MySQL database `lifa_db`

5. Start the server

## API Endpoints

### AI Routes

#### Generate Quick Insight
- **POST** `/ai/generate-insight`
- Generates a quick financial insight for a transaction
- **Body**: `{ descricao, valor, categoria }` [4](#0-3) 

#### Generate Financial Report
- **POST** `/ai/generate-report`
- Creates a comprehensive monthly financial report
- **Body**: `{ userId }` [5](#0-4) 

## Database Schema

The application uses a `transactions` table with the following structure:
- `user_id`: User identifier
- `type`: Transaction type ('entrada' for income, 'saida' for expenses)
- `value`: Transaction amount
- `category`: Transaction category [6](#0-5) 

## Notes

This README is based on the available server-side code. The project appears to be a hackathon project focused on financial management with AI integration. Additional components like frontend, authentication, and full database schema may exist but are not visible in the current context. [7](#0-6)

### Citations

**File:** server/src/routes/ai.routes.ts (L8-8)
```typescript
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
```

**File:** server/src/routes/ai.routes.ts (L11-25)
```typescript
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
```

**File:** server/src/routes/ai.routes.ts (L28-69)
```typescript
router.post('/generate-report', async (req: Request, res: Response) => {
 try {
  const { userId } = req.body;

  // Busca dados
  const [rows]: any = await pool.query('SELECT type, SUM(value) as total FROM transactions WHERE user_id = ? GROUP BY type', [userId]);
  const receitas = rows.find((r: any) => r.type === 'entrada')?.total || 0;
  const despesas = rows.find((r: any) => r.type === 'saida')?.total || 0;
  const saldo = receitas - despesas;

  const [rowsCat]: any = await pool.query("SELECT category, SUM(value) as total FROM transactions WHERE user_id = ? AND type = 'saida' GROUP BY category ORDER BY total DESC LIMIT 3", [userId]);
  const topGastos = rowsCat.map((c: any) => `${c.category}: R$${c.total}`).join(', ');

  // Prompt Refinado: PROIBIDO PLACEHOLDERS
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
```

**File:** server/src/database.ts (L1-14)
```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
 host: process.env.DB_HOST || 'localhost',
 user: process.env.DB_USER || 'root',
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME || 'lifa_db',
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0
});
```
