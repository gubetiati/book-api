const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book');
const Category = require('../models/Category');

const router = express.Router();

//rota para listar livros
router.get('/', async (req, res) => {
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Lista todos os livros cadastrados'
    const limite = parseInt(req.query.limite) || 10; //define o limite de registros por página
    const pagina = parseInt(req.query.pagina) || 1;  //define a página atual

    // Valida se o limite é 5, 10 ou 30
    if (![5, 10, 30].includes(limite)) {
        return res.status(400).send({ error: 'Limite inválido. Use 5, 10 ou 30.' });
    }

    try {
        const books = await Book.find()
            .populate('categorias', 'nome') //popula as categorias associadas ao livro
            .limit(limite)
            .skip((pagina - 1) * limite);

        const total = await Book.countDocuments();

        //mapeia os nomes das categorias para cada livro
        const booksComCategorias = books.map(book => ({
            _id: book._id,
            titulo: book.titulo,
            autor: book.autor,
            ano: book.ano,
            descricao: book.descricao,
            categorias: book.categorias.map(categoria => categoria.nome) //extrai apenas os nomes das categorias
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

//rota para adicionar livro
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Adiciona um novo livro'
    try {
        const { titulo, autor, ano, descricao, categorias } = req.body;

        //verifica se todas as categorias fornecidas existem
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

//rota para atualizar livro
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Atualiza dados de um livro'
    try {
        const { categorias } = req.body;

        //verifica se todas as categorias fornecidas existem
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

//rota para deletar livro
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Deleta livro'
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.send(book);
    } catch (err) {
        res.status(500).send({ msg: 'Erro ao deletar livro', error: err });
    }
});

module.exports = router;
