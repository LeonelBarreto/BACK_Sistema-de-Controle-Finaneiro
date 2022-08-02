const { query } = require("express");

const listarTransacoes = async (req, res) => {
    const { usuario } = req;
    const { filtro } = req.query;

    if (filtro && !Array.isArray(filtro)) {
        return res.status(400).json({ mensagem: 'O filtro precisa ser um array.'});
    };

    try {
        let queryLike = '';
        let arrayFiltro;

        if (filtro) {
            arrayFiltro = filtro.map((item) => `%${item}%`);
            queryLike += `and c.descricao ilike any($2)`;
        };

        const queryTransacoes = `
            select t.*, c.descricao as categoria_nome from transacoes t
            left join categorias c
            on t.categoria_id = c.id
            where t.usuario_id = $1
            ${queryLike}
        `;

        const paramFiltro = filtro ? [usuario.id, arrayFiltro] : [usuario.id];


        const transacoes = await query(queryTransacoes, paramFiltro);

        return res.status(200).json(transacoes.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

const detalharTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rows, rowCount } = await query('SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não foi encontrada!'});
        };

        const [transacao] = rows;

        return res.status(200).json(transacao);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

const registrarTransacao = async (req, res) => {
    const { usuario } = req;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'É obrigatório o preenchimento de todos os campos.' });
    };

    if (tipo !== 'entrada' && tipo !== 'saída') {
        return res.status(400).json({ mensagem: 'O tipo precisa ser: entrada ou saída.' });
    };

    try {
        const categoria = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'Categoria não existe.' })
        };

        const queryCadastro = 'INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) returning *';
        const paramCadastro = [descricao, valor, data, categoria_id, tipo, usuario.id];
        const { rows, rowCount } = await query(queryCadastro, paramCadastro);

        if (rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        };

        const [transacao] = rows;

        transacao.categoria_nome = categoria.rows[0].descricao;

        return res.status(201).json(transacao);        
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

const atualizarTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'É obrigatório o preenchimento de todos os campos.' });
    };

    if (tipo !== 'entrada' && tipo !== 'saída') {
        return res.status(400).json({ mensagem: 'O tipo precisa ser: entrada ou saída.' });
    };
    
    try {
        const transacao = await query('SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2', [usuario.id, id]);
    
        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe!'});
        };

        const categoria = await query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe.' })
        };

        const queryAtualizacao = 'UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5, usuario_id = $6 WHERE id = $7';
        const paramAtualizacao = [descricao, valor, data, categoria_id, tipo, id];
        const transacaoAtualizada = await query(queryAtualizacao, paramAtualizacao);

        if (transacaoAtualizada.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        };

        return res.status(204).send();        
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});    
    };

};

const deletarTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const transacao = await query('SELECT * FROM transacoes WHERE usuario_id = $1 AND id = $2', [usuario.id, id]);
    
        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe!'});
        };
        
        const transacaoExcluida = await query('DELETE * FROM transacoes WHERE id = $1', [id]);
        
        if (transacaoExcluida.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        };

        return res.status(204).send();        
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});    
    };
};

const consultarExtrato = async (req, res) => {
    const { usuario } = req;

    
    try {
        const queryExtrato = 'SELECT sum(valor) AS saldo FROM transacoes WHERE usuario_id = $1 AND tipo = $2';
        const saldoEntrada = await query(queryExtrato, [usuario.id, 'entrada']);
        const saldoSaída = await query(queryExtrato, [usuario.id, 'saída']);

        return res.json({
            entrada: Number(saldoEntrada.rows[0].saldo) ?? 0,
            saída: Number(saldoSaída.rows[0].saldo) ?? 0,
        });
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});    
    };
};

module.exports = {
    listarTransacoes,
    detalharTransacao,
    registrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    consultarExtrato
};