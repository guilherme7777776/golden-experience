const { query } = require('../database');
const path = require('path');

// ========================
// ABRIR PÁGINA CRUD
// ========================
exports.abrirCrudPessoa = (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pessoa/pessoa.html'));
};

// ========================
// LISTAR TODAS AS PESSOAS
// ========================
exports.listarPessoas = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        P.ID_PESSOA,
        COALESCE(C.NOME_CLIENTE, F.NOME_FUNC) AS NOME_PESSOA,
        COALESCE(C.EMAIL_CLIENTE, F.EMAIL_FUNC) AS EMAIL_PESSOA,
        COALESCE(C.SENHA_CLIENTE, F.SENHA_FUNC) AS SENHA_PESSOA,
        COALESCE(C.ENDERECO_CLIENTE, F.ENDERECO_FUNC) AS ENDERECO_PESSOA,
        COALESCE(C.TELEFONE_CLIENTE, F.TELEFONE_FUNC) AS TELEFONE_PESSOA,
        COALESCE(C.DATA_NASCIMENTO, F.DATA_NASCIMENTO) AS DATA_NASCIMENTO,
        CASE 
          WHEN C.ID_PESSOA IS NOT NULL THEN 'CLIENTE'
          WHEN F.ID_PESSOA IS NOT NULL THEN 'FUNCIONARIO'
        END AS TIPO
      FROM PESSOA P
      LEFT JOIN CLIENTE C ON P.ID_PESSOA = C.ID_PESSOA
      LEFT JOIN FUNCIONARIO F ON P.ID_PESSOA = F.ID_PESSOA
      ORDER BY P.ID_PESSOA;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================
// OBTER PESSOA POR ID
// ========================
exports.obterPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });

    const result = await query(`
      SELECT 
        P.ID_PESSOA,
        COALESCE(C.NOME_CLIENTE, F.NOME_FUNC) AS NOME_PESSOA,
        COALESCE(C.EMAIL_CLIENTE, F.EMAIL_FUNC) AS EMAIL_PESSOA,
        COALESCE(C.SENHA_CLIENTE, F.SENHA_FUNC) AS SENHA_PESSOA,
        COALESCE(C.ENDERECO_CLIENTE, F.ENDERECO_FUNC) AS ENDERECO_PESSOA,
        COALESCE(C.TELEFONE_CLIENTE, F.TELEFONE_FUNC) AS TELEFONE_PESSOA,
        COALESCE(C.DATA_NASCIMENTO, F.DATA_NASCIMENTO) AS DATA_NASCIMENTO,
        CASE 
          WHEN C.ID_PESSOA IS NOT NULL THEN 'CLIENTE'
          WHEN F.ID_PESSOA IS NOT NULL THEN 'FUNCIONARIO'
        END AS TIPO
      FROM PESSOA P
      LEFT JOIN CLIENTE C ON P.ID_PESSOA = C.ID_PESSOA
      LEFT JOIN FUNCIONARIO F ON P.ID_PESSOA = F.ID_PESSOA
      WHERE P.ID_PESSOA = $1;
    `, [id_pessoa]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Pessoa não encontrada' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/// CRIAR NOVA PESSOA
exports.criarPessoa = async (req, res) => {
  try {
    const {
      id_pessoa,
      tipo,
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento,
      // Campos específicos
      renda_cliente,
      data_cadastro,
      salario,
      carga_horaria,
      id_cargo
    } = req.body;

    if (!nome_pessoa || !email_pessoa || !senha_pessoa || !tipo) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }

    await query('INSERT INTO PESSOA (ID_PESSOA) VALUES ($1)', [parseInt(id_pessoa)]);

    if (tipo === 'CLIENTE') {
      const result = await query(
        `INSERT INTO CLIENTE (
          ID_PESSOA, NOME_CLIENTE, EMAIL_CLIENTE, SENHA_CLIENTE, ENDERECO_CLIENTE, TELEFONE_CLIENTE, DATA_NASCIMENTO, RENDA_CLIENTE, DATA_CADASTRO
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento, renda_cliente, data_cadastro]
      );
      return res.status(201).json(result.rows[0]);
    } else if (tipo === 'FUNCIONARIO') {
      const result = await query(
        `INSERT INTO FUNCIONARIO (
          ID_PESSOA, NOME_FUNC, EMAIL_FUNC, SENHA_FUNC, ENDERECO_FUNC, TELEFONE_FUNC, DATA_NASCIMENTO, SALARIO, CARGA_HORARIA, ID_CARGO
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento, salario, carga_horaria, id_cargo]
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ATUALIZAR PESSOA
exports.atualizarPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    const {
      tipo,
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento,
      // Campos específicos
      renda_cliente,
      data_cadastro,
      salario,
      carga_horaria,
      id_cargo
    } = req.body;

    if (tipo === 'CLIENTE') {
      const result = await query(
        `UPDATE CLIENTE SET 
          NOME_CLIENTE=$1, EMAIL_CLIENTE=$2, SENHA_CLIENTE=$3, ENDERECO_CLIENTE=$4, TELEFONE_CLIENTE=$5, DATA_NASCIMENTO=$6, RENDA_CLIENTE=$7, DATA_CADASTRO=$8
         WHERE ID_PESSOA=$9 RETURNING *`,
        [nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento, renda_cliente, data_cadastro, id_pessoa]
      );
      return res.json(result.rows[0]);
    } else if (tipo === 'FUNCIONARIO') {
      const result = await query(
        `UPDATE FUNCIONARIO SET 
          NOME_FUNC=$1, EMAIL_FUNC=$2, SENHA_FUNC=$3, ENDERECO_FUNC=$4, TELEFONE_FUNC=$5, DATA_NASCIMENTO=$6, SALARIO=$7, CARGA_HORARIA=$8, ID_CARGO=$9
         WHERE ID_PESSOA=$10 RETURNING *`,
        [nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento, salario, carga_horaria, id_cargo, id_pessoa]
      );
      return res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================
// DELETAR PESSOA
// ========================
exports.deletarPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });

    await query(`DELETE FROM CLIENTE WHERE ID_PESSOA=$1`, [id_pessoa]);
    await query(`DELETE FROM FUNCIONARIO WHERE ID_PESSOA=$1`, [id_pessoa]);
    await query(`DELETE FROM PESSOA WHERE ID_PESSOA=$1`, [id_pessoa]);

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
