const { query } = require("express");

const listarCategorias = async (req, res) => {
    try {
        const categorias = await query('SELECT * FROM categorias');
        
        return res.status(200).json(categorias.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

module.exports = { listarCategorias };