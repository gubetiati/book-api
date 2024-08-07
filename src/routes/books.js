const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book')

const router = express.Router();

// Listar livros
router.get('/', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

// Adicionar livro
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(500).send({ msg: 'Erro ao salvar livro', error: err });
    }
});

// Atualizar livro
router.put('/:id',  authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(book);
    } catch (err) {
        res.status(500).send({ msg: 'Erro ao atualizar livro', error: err });
    }
});

// Deletar livro
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.send(book);
    } catch (err) {
        res.status(500).send({ msg: 'Erro ao deletar livro', error: err });
    }
});

module.exports = router;
