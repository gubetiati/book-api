const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const bookRoutes = require('./routes/books')
const User = require('./models/User')

dotenv.config();

const app = express();
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_SENHA = process.env.ADMIN_SENHA

app.use(bodyParser.json())

// Conectar ao MongoDB
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Conectado ao MongoDB')
        // Criar administrador padrão
        let admin = await User.findOne({ email: ADMIN_EMAIL })
        if (!admin) {
            admin = new User({ nome: 'Administrador', email: ADMIN_EMAIL, senha: ADMIN_SENHA, isAdmin: true })
            await admin.save()
            console.log('Administrador padrão criado.')
        }
    }).catch((err) => {
        console.error('Erro ao conectar ao MongoDB ', err)
    });

// Rotas
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/books', bookRoutes)

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
