const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = 3000

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI;




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

// Listar livros
app.get('/', async (req, res) => {
    const book = await Book.find()
    res.send(book)
})

// Adicionar livro
app.post('/', async (req, res) => {
    try{
        const book = new Book({
            titulo: req.body.titulo,
            autor: req.body.autor,
            ano: req.body.ano,
            descricao: req.body.descricao
        })
        await book.save()
        res.send(book)
    }catch(err){
        res.status(500).send({msg: 'Erro ao salvar livro ', error: err})
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
