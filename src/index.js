const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const routes = require('./routes'); // Novo arquivo que organiza as rotas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

// Rotas e documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes); // Uso das rotas centralizadas

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
