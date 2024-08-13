# Book-API

**Descrição:** API REST para gerenciamento de usuários, livros, e categorias com funcionalidades de recomendação personalizada de livros.

## Índice

- [Introdução](#introdução)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Introdução

Este projeto é uma API desenvolvida com Node.js e Express que permite a gestão de usuários, livros e categorias. Ele inclui funcionalidades de autenticação, CRUD (Create, Read, Update, Delete), e um sistema de recomendação de livros com base nos livros já lidos pelos usuários.

## Funcionalidades

- Cadastro, autenticação e gerenciamento de usuários.
- Gerenciamento de livros e categorias.
- Sistema de recomendação de livros baseado nas categorias dos livros que o usuário já leu.
- Documentação da API utilizando Swagger.
- Operações CRUD restritas a usuários autenticados e com permissões adequadas.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **MongoDB e Mongoose**
- **JWT (JSON Web Tokens) para autenticação**
- **Swagger para documentação da API**
- **Dotenv para gerenciamento de variáveis de ambiente**
