const { query } = require('../database/conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.'})
    };

    try {
        const usuario = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (usuario.rowCount > 0) {
            return res.status(400).json({ mensagem: 'O e-mail já está cadastrado.'});
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *';
        const paramCadastro = [nome, email, senhaCriptografada];
        const usuarioCadastrado = await query(queryCadastro, paramCadastro);

        if (usuarioCadastrado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        };

        const { senha: _, ...cadastro } = usuarioCadastrado.rows[0];

        return res.status(201).json(cadastro);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};


const detalharPerfilUsuario = async (req, res) => {
    return res.json(req.usuario);
};

const atualizarPerfilUsuario = async (req, res) => {
    const { usuario } = req;
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.'})
    };

    try {
        const usuarioEncontrado = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (usuario.rowCount > 0 && usuarioEncontrado.rows[0].id !== usuario.id) {
            return res.status(400).json({ mensagem: 'O e-mail já está cadastrado.'});
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizacao = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 where id = $4';
        const paramAtualizacao = [nome, email, senhaCriptografada, usuario.id];
        const usuarioAtualizado = await query(queryAtualizacao, paramAtualizacao);

        if (usuarioAtualizado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        };

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

module.exports = {
    cadastrarUsuario,
    detalharPerfilUsuario,
    atualizarPerfilUsuario
};