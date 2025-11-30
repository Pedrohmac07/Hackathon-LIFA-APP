import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
 console.log(`[REQUEST] ${req.method} ${req.path}`);
 next();
});

app.use(router);

app.listen(PORT, '0.0.0.0', () => {
 console.log(`Servidor LIFA rodando na porta ${PORT}`);
});
