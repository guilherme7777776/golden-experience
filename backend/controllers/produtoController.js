const { query } = require('../database');
const path = require('path');

exports.abrirCrudProduto = (req, res) => {
  console.log("abrir  crud")
  res.sendFile(path.join(__dirname, '../../frontend/produto/produto.html'));
}
// LISTAR
exports.listarProdutos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM produto ORDER BY id_produto');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// OBTER POR ID
exports.obterProduto = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await query('SELECT * FROM produto WHERE id_produto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// CRIAR
exports.criarProduto = async (req, res) => {
  const { id_produto, nome, preco, f_id_pessoa } = req.body;
  try {
    const verificaFuncionario = await query(
      'SELECT * FROM FUNCIONARIO WHERE id_pessoa = $1',
      [f_id_pessoa]
    );

    if (verificaFuncionario.rows.length === 0) {
      return res.status(400).json({ error: 'O ID informado não pertence a um funcionário.' });
    }
    const result = await query(
      'INSERT INTO produto (id_produto, nome, preco, f_id_pessoa) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_produto, nome, preco, f_id_pessoa]
    );
    console.log(result,"HFOWGEIOFGHWOEIGFOIWEHFOIHWEOIFHIOWEF");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// ATUALIZAR
exports.atualizarProduto = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, f_id_pessoa } = req.body;

  try {
    const result = await query(
      'UPDATE produto SET nome = $1, preco = $2, f_id_pessoa = $3 WHERE id_produto = $4 RETURNING *',
      [nome, preco, f_id_pessoa, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETAR
exports.deletarProduto = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await query('DELETE FROM produto WHERE id_produto = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
