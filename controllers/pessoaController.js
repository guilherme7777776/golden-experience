const { query } = require('../database');
const path = require('path');

console.log("VEJA A REPETIÇÃO DO RENDERIZAR TABELA PRODUTO")
// ========================
// ABRIR PÁGINA CRUD
// ========================
exports.abrirCrudPessoa = (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pessoa/pessoa.html'));
};

// ========================
// LISTAR TODAS AS PESSOAS (CLIENTES)
// ========================
exports.listarPessoas = async (req, res) => {
  try {
    const result = await query(`
     SELECT
      p.id_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.nome_cliente
          ELSE f.nome_func
      END AS nome_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.email_cliente
          ELSE NULL
      END AS email_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.senha_cliente
          ELSE NULL
      END AS senha_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.endereco_cliente
          ELSE NULL
      END AS endereco_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.telefone_cliente
          ELSE NULL
      END AS telefone_pessoa,
      CASE
          WHEN c.id_pessoa IS NOT NULL THEN c.data_nascimento
          ELSE NULL
      END AS data_nascimento
    FROM PESSOA p
    LEFT JOIN CLIENTE c ON p.id_pessoa = c.id_pessoa
    LEFT JOIN FUNCIONARIO f ON p.id_pessoa = f.id_pessoa
    ORDER BY p.id_pessoa;

    `);
    
    res.json(result.rows);
    console.log(result)
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor1' });
  }
};

// ========================
// CRIAR NOVA PESSOA (CLIENTE)
// ========================
exports.criarPessoa = async (req, res) => {
  try {
    const {
      id_pessoa,
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento
    } = req.body;

    // Validação básica
    if (!nome_pessoa || !email_pessoa || !senha_pessoa || !data_nascimento) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }
    console.log(id_pessoa)
    // Validação de ID como inteiro

    const idInt = parseInt(id_pessoa);
    if (isNaN(idInt)) {
      return res.status(400).json({ error: 'id_pessoa deve ser um número inteiro válido' });
    }
    console.log(idInt)
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_pessoa)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

  
    if (senha_pessoa.length < 8) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 8 caracteres' });
    }
   
    await query('INSERT INTO PESSOA (id_pessoa) VALUES ($1)', [idInt]);

   
    const result = await query(
      `INSERT INTO CLIENTE (
          id_pessoa, nome_cliente, email_cliente, senha_cliente, endereco_cliente, telefone_cliente, data_nascimento
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [idInt, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'id_pessoa ou email já estão em uso' });
    }

    res.status(500).json({ error: 'Erro interno do servidor2' });
  }
};


// ========================
// OBTER PESSOA POR ID
// ========================
exports.obterPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) {
      return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });
    }

    const result = await query(
      `SELECT 
         p.id_pessoa,
         c.nome_cliente AS nome_pessoa,
         c.email_cliente AS email_pessoa,
         c.senha_cliente AS senha_pessoa,
         c.endereco_cliente AS endereco_pessoa,
         c.telefone_cliente AS telefone_pessoa,
         c.data_nascimento
       FROM cliente c
       JOIN pessoa p ON c.id_pessoa = p.id_pessoa
       WHERE p.id_pessoa = $1`,
      [id_pessoa]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor3' });
  }
};

// ========================
// ATUALIZAR PESSOA
// ========================
exports.atualizarPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    const {
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento
    } = req.body;

    if (isNaN(id_pessoa)) {
      return res.status(400).json({ error: 'id_pessoa inválido' });
    }

    const existing = await query(`SELECT * FROM PESSOA WHERE id_pessoa = $1`, [id_pessoa]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    const person = existing.rows[0];

    const updated = {
      nome_pessoa: nome_pessoa ?? person.nome_pessoa,
      email_pessoa: email_pessoa ?? person.email_pessoa,
      senha_pessoa: senha_pessoa ?? person.senha_pessoa,
      endereco_pessoa: endereco_pessoa ?? person.endereco_pessoa,
      telefone_pessoa: telefone_pessoa ?? person.telefone_pessoa,
      data_nascimento: data_nascimento ?? person.data_nascimento
    };

    const result = await query(
      `UPDATE CLIENTE SET 
        nome_cliente = $1, email_cliente = $2, senha_cliente = $3, 
        endereco_cliente = $4, telefone_cliente = $5, data_nascimento = $6
       WHERE id_pessoa = $7 RETURNING *`,
      [updated.nome_pessoa, updated.email_pessoa, updated.senha_pessoa, updated.endereco_pessoa, updated.telefone_pessoa, updated.data_nascimento, id_pessoa]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email já em uso' });
    }
    res.status(500).json({ error: 'Erro interno do servidor4' });
  }
};

// ========================
// DELETAR PESSOA
// ========================
exports.deletarPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });

    const existing = await query(`SELECT * FROM PESSOA WHERE id_pessoa = $1`, [id_pessoa]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Pessoa não encontrada' });

    await query(`DELETE FROM PESSOA WHERE id_pessoa = $1`, [id_pessoa]);
    await query(`DELETE FROM CLIENTE WHERE id_pessoa = $1`, [id_pessoa]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor5' });
  }
};

// ========================
// ATUALIZAR SENHA
// ========================
exports.atualizarSenha = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    const { senha_atual, nova_senha } = req.body;

    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });
    if (!senha_atual || !nova_senha) return res.status(400).json({ error: 'Senha atual e nova são obrigatórias' });

    const result = await query(`SELECT * FROM PESSOA WHERE id_pessoa = $1`, [id_pessoa]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Pessoa não encontrada' 
    });

    const person = result.rows[0];
    if (person.senha_pessoa !== senha_atual) return res.status(400).json({ error: 'Senha atual incorreta' });

    const updateResult = await query(
      `UPDATE PESSOA SET senha_pessoa = $1 WHERE id_pessoa = $2 RETURNING id_pessoa, nome_pessoa, email_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento`,
      [nova_senha, id_pessoa]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor6' });
  }
};
