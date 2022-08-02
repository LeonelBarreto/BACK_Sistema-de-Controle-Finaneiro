const { query } = require('../database/conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret');

const validacaoToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado!'});
    };

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, 'senhaSeguraParaToken');

        const { rows, rowCount } = await query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if ( rowCount <= 0) {
            return res.status(401).json({ mensagem: 'Não autorizado!'});
        };

        const [usuario] = rows;

        const { senha: _, ...dadosUsuario } = usuario;

        req.usuario = dadosUsuario;

        next();

    } catch (error) {
        return res.status(500).json(error.message);
    };
};

module.exports = validacaoToken;