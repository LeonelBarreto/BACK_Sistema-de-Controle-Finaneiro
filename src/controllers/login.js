const { query } = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Por favor, insira o e-mail e a senha.'});
    };

    try {
        const { rows, rowCount } = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if ( rowCount <= 0) {
            return res.status(400).json({ mensagem: 'E-mail ou senha está incorreto.'});
        };

        const [usuario] = rows;

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'E-mail ou senha está incorreto.'});
        };

        const token = jwt.sign({id: usuario.id}, 'senhaSeguraParaToken', { expiresIn: '8h '});

        const { senha: _, ...dadosUsuario } = usuario;

        return res.statos(200).json({
            usuario: dadosUsuario,
            token
        });       

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

module.exports = {
    login
}