const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = 3000

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
