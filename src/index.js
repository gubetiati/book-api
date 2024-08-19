const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());

//conectar ao MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

//rotas e documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes); //uso das rotas centralizadas

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
