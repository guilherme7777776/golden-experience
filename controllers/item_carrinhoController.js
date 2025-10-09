const { query } = require('../database');
const path = require('path');

exports.abrirCrudItemCarrinho = (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/item_carrinho/item_carrinho.html'));
}

// Listar todos itens do carrinho (pode ser perigoso listar todos sem filtro, mas vamos manter)
exports.listarItensCarrinho = async (req, res) => {
  try {
    const result = await query('SELECT * FROM item_carrinho ORDER BY id_carrinho');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar itens do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Criar novo item no carrinho
exports.criarItemCarrinho = async (req, res) => {
  try {
    const { id_carrinho, id_produto, quantidade } = req.body;

    if (!id_carrinho || !id_produto || !quantidade) {
      return res.status(400).json({ error: 'Campos obrigatórios: id_carrinho, id_produto, quantidade.' });
    }

    const result = await query(
      'INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade) VALUES ($1, $2, $3) RETURNING *',
      [id_carrinho, id_produto, quantidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar item do carrinho:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'ID do carrinho ou produto não existe.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// Obter itens de um carrinho específico
exports.obterItensDoCarrinho = async (req, res) => {
  try {
    const { idCarrinho } = req.params;

    const result = await query(
      `SELECT ic.id_item, ic.id_carrinho, ic.id_produto, p.nome, ic.quantidade
       FROM item_carrinho ic
       JOIN produto p ON ic.id_produto = p.id_produto
       WHERE ic.id_carrinho = $1
       ORDER BY ic.id_item`,
      [idCarrinho]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum item encontrado para este carrinho.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao obter itens do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// Obter item específico pelo id_item
exports.obterItemCarrinho = async (req, res) => {
  try {
    const { id_item } = req.params;
    const idItemNum = parseInt(id_item);
    if (isNaN(idItemNum)) {
      return res.status(400).json({ error: 'ID do item deve ser um número válido' });
    }

    const result = await query(
      `SELECT ic.id_item, ic.id_carrinho, ic.id_produto, p.nome, ic.quantidade
       FROM item_carrinho ic
       JOIN produto p ON ic.id_produto = p.id_produto
       WHERE ic.id_item = $1`,
      [idItemNum]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter item do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Atualizar item do carrinho pelo id_item
exports.atualizarItemCarrinho = async (req, res) => {
  try {
    const { id_item } = req.params;
    const idItemNum = parseInt(id_item);
    if (isNaN(idItemNum)) {
      return res.status(400).json({ error: 'ID do item deve ser um número válido' });
    }

    const { quantidade } = req.body;
    if (quantidade === undefined) {
      return res.status(400).json({ error: 'Campo quantidade é obrigatório para atualização.' });
    }

    // Verifica se existe
    const exists = await query('SELECT * FROM item_carrinho WHERE id_item = $1', [idItemNum]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado' });
    }

    // Atualiza quantidade
    const updated = await query(
      'UPDATE item_carrinho SET quantidade = $1 WHERE id_item = $2 RETURNING *',
      [quantidade, idItemNum]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Deletar item do carrinho pelo id_item
exports.deletarItemCarrinho = async (req, res) => {
  try {
    const { id_item } = req.params;
    const idItemNum = parseInt(id_item);
    if (isNaN(idItemNum)) {
      return res.status(400).json({ error: 'ID do item deve ser um número válido' });
    }

    // Verifica existência
    const exists = await query('SELECT * FROM item_carrinho WHERE id_item = $1', [idItemNum]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado' });
    }

    // Deleta
    const deleted = await query('DELETE FROM item_carrinho WHERE id_item = $1', [idItemNum]);

    if (deleted.rowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Falha ao deletar item do carrinho' });
    }
  } catch (error) {
    console.error('Erro ao deletar item do carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
