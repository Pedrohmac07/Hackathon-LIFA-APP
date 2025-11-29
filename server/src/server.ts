import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Importa o arquivo index.ts da pasta routes
import { router } from './routes';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Servidor LIFA rodando na porta ${PORT}`);
  console.log(`📱 Conecte o App no IP da sua máquina (verifique com 'ip addr')`);
});
