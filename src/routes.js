const express = require('express');
const validacaoToken = require('./middleware/authenticationToken');
const { login } = require('./controllers/login');
const { cadastrarUsuario, detalharPerfilUsuario, atualizarPerfilUsuario } = require('./controllers/usuarios');
const { listarCategorias } = require('./controllers/categorias');
const { listarTransacoes, detalharTransacao, registrarTransacao, atualizarTransacao, deletarTransacao, consultarExtrato } = require('./controllers/transacoes');

const routes = express();


routes.post('/usuario', cadastrarUsuario);
routes.post('/login', login);

routes.use(validacaoToken);

routes.get('/usuario', detalharPerfilUsuario);
routes.put('/usuario', atualizarPerfilUsuario);

routes.get('/categoria', listarCategorias);

routes.get('/transacao', listarTransacoes);
routes.get('/transacao/extrato', consultarExtrato);
routes.get('/transacao/:id', detalharTransacao);
routes.post('/transacao', registrarTransacao);
routes.put('/transacao/:id', atualizarTransacao);
routes.delete('/transacao/:id', deletarTransacao);

module.exports = routes;