const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book');
const Category = require('../models/Category');

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
            .populate('categorias', 'nome') // Popula as categorias associadas ao livro
            .limit(limite)
            .skip((pagina - 1) * limite);

        const total = await Book.countDocuments();

        // Mapeia os nomes das categorias para cada livro
        const booksComCategorias = books.map(book => ({
            _id: book._id,
            titulo: book.titulo,
            autor: book.autor,
            ano: book.ano,
            descricao: book.descricao,
            categorias: book.categorias.map(categoria => categoria.nome) // Extrai apenas os nomes das categorias
        }));

        res.send({
            data: booksComCategorias,
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
        const { titulo, autor, ano, descricao, categorias } = req.body;

        // Verificar se todas as categorias fornecidas existem
        const categoriasExistentes = await Category.find({ _id: { $in: categorias } });
        if (categoriasExistentes.length !== categorias.length) {
            return res.status(400).send({ error: 'Uma ou mais categorias fornecidas não foram encontradas.' });
        }

        const book = new Book({ titulo, autor, ano, descricao, categorias });
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(500).send({ msg: 'Erro ao salvar livro', error: err });
    }
});

// Atualizar livro
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { categorias } = req.body;

        // Verificar se todas as categorias fornecidas existem
        if (categorias) {
            const categoriasExistentes = await Category.find({ _id: { $in: categorias } });
            if (categoriasExistentes.length !== categorias.length) {
                return res.status(400).send({ error: 'Uma ou mais categorias fornecidas não foram encontradas.' });
            }
        }

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
