// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book API',
    description: 'API para gerenciar livros e categorias, incluindo funcionalidades de autenticação.',
  },
  host: 'localhost:3000', // Atualize com o host correto se estiver em produção
  schemes: ['http'],
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Insira o token JWT no formato: Bearer <token>"
    },
  },
  definitions: {
    Book: {
      title: 'A Guerra dos Tronos : As Crônicas de Gelo e Fogo',
      autor: 'George R. R. Martin',
      ano: 2019,
      descricao: 'A guerra dos tronos é o primeiro livro da série best-seller internacional As Crônicas de Gelo e Fogo, que deu origem à adaptação de sucesso da HBO, Game of Thrones.',
      categorias: ['66ba66b242402ddc44368c56']
    },
    Category: {
      nome: 'Fantasia',
    },
    User: {
      nome: 'John Doe',
      email: 'john.doe@example.com',
      senha: '123456',
      isAdmin: false,
    }
  },
};

const output = './swagger-output.json';
const endpoints = ['./index.js'];

swaggerAutogen(output, endpoints, doc).then(() => {
  require('./index');
});
