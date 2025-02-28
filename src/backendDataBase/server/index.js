import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importar rotas
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/email.js';
import turnosRoutes from './routes/turnos.js';
import colaboradoresRoutes from './routes/colaboradores.js';
import clientesRoutes from './routes/clientes.js';
import materiasPrimasRoutes from './routes/materiasprimas.js';
import corantesRoutes from './routes/corantes.js';
import maquinasRoutes from './routes/maquinas.js';
import figurasRoutes from './routes/figuras.js';
import encomendasRoutes from './routes/encomendas.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes);
app.use('/api/turno', turnosRoutes);
app.use('/api/colaborador', colaboradoresRoutes);
app.use('/api/cliente', clientesRoutes);
app.use('/api/materiasprima', materiasPrimasRoutes);
app.use('/api/corante', corantesRoutes);
app.use('/api/maquina', maquinasRoutes);
app.use('/api/figura', figurasRoutes);
app.use('/api/encomenda', encomendasRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});