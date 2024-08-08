const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book')

const router = express.Router();

// Listar livros
router.get('/', async (req, res) => {
    const limite = parseInt(req.query.limite) || 10; // Define o limite de registros por página
    const pagina = parseInt(req.query.pagina) || 1;  // Define a página atual

    // Valida se o limite é 5, 10 ou 30
    if (![5, 10, 30].includes(limite)) {
        return res.status(400).send({ error: 'Limite inválido. Use 5, 10 ou 30.' });
    }

    try {
        const books = await Book.find()
            .limit(limite)
            .skip((pagina - 1) * limite);
        const total = await Book.countDocuments();

        res.send({
            data: books,
            total,
            pagina,
            limite
        });
    } catch (err) {
        res.status(500).send({ error: 'Erro ao buscar livros' });
    }
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
