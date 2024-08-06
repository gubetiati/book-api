const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = 3000

dotenv.config()

// Conectar ao MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB')
    }).catch((err) => {
        console.error('Erro ao conectar ao MongoDB ', err)
    })

const app = express()
app.use(bodyParser.json())

// Modelo
const Book = mongoose.model('Book', {
    titulo: String,
    autor: String,
    ano: Number,
    descricao: String
})

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
