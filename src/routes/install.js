const express = require('express')
const Category = require('../models/Category');
const Book = require('../models/Book');

const router = express.Router()

//rota para inserir dados no MongoDB
router.get('/', async (req, res) => {
    // #swagger.tags = ['Install']
    // #swagger.summary = 'Instala todas as dependências no banco de dados'
    try {
        const categorias = [
            { nome: 'Ficção Científica' },
            { nome: 'Fantasia' },
            { nome: 'Terror' },
            { nome: 'Romance' },
            { nome: 'Aventura' }
        ];
        var categoriasInseridas = await Category.insertMany(categorias);

        const livros = [
            { titulo: 'O mágico de Oz', 
            autor: 'L. Frank Baum', ano: 2023, 
            descricao: 'Um mundo de cores, magia e aventura espera pela garotinha Dorothy, que chega em Oz por acidente quando um grande furacão carrega sua casa até essa terra longínqua. Os habitantes deste lugar tão especial logo recebem a menina como uma heroína capaz de combater bruxas malvadas, mas tudo o que Dorothy mais deseja é voltar à sua terra para reencontrar os tios.', 
            categorias: [categoriasInseridas[0]._id] },
            { titulo: 'A Guerra dos Tronos : As Crônicas de Gelo e Fogo', 
            autor: 'George R. R. Martin ', 
            ano: 2029, 
            descricao: 'A guerra dos tronos é o primeiro livro da série best-seller internacional As Crônicas de Gelo e Fogo, que deu origem à adaptação de sucesso da HBO, Game of Thrones.', 
            categorias: [categoriasInseridas[1]._id] },
            { titulo: 'Frankenstein', 
            autor: 'Mary Shelley', 
            ano: 1818, 
            descricao: 'Frankenstein é uma obra que dispensa apresentações. Escrito quando Mary Shelley tinha apenas 18 anos, o livro conjuga pela primeira vez uma narrativa de ficção com a ideia de ciência e prenuncia várias perguntas sem respostas fáceis, justificando por que sua criatura emblemática se espraia pelo imaginário popular há mais de dois séculos.', 
            categorias: [categoriasInseridas[2]._id] },
            { titulo: 'É Assim que Acaba: 1', 
            autor: 'Colleen Hoover', 
            ano: 2018, 
            descricao: 'Em É assim que acaba , Colleen Hoover nos apresenta Lily, uma jovem que se mudou de uma cidadezinha do Maine para Boston, se formou em marketing e abriu a própria floricultura. ', 
            categorias: [categoriasInseridas[3]._id] },
            { titulo: 'O cavaleiro preso na armadura', 
            autor: 'Robert Fisher', 
            ano: 2020, 
            descricao: 'O cavaleiro mais corajoso do reino. Um homem sempre pronto para qualquer batalha, disposto a defender sua honra e prestar ajuda a quem precise. ', categorias: [categoriasInseridas[4]._id] }
        ];
        await Book.insertMany(livros);
        

        res.send({ message: 'Banco de dados inicializado com sucesso!' });
    } catch (err) {
    res.status(500).send({ error: 'Erro ao inicializar banco de dados.', details: err.message });
}
});

module.exports = router