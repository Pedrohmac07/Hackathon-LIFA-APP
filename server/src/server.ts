import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importa o arquivo index.ts da pasta routes
import { router } from './routes';

dotenv.config();

const app = express();

// CORREÇÃO AQUI: Forçamos ser um Number para o TypeScript não reclamar
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Usa as rotas que organizamos
app.use(router);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Servidor LIFA rodando na porta ${PORT}`);
  // Mostra o IP para facilitar sua vida
  console.log(`📱 Conecte o App no IP da sua máquina (verifique com 'ip addr')`);
});
