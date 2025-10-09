const { query } = require('../database');
const path = require('path');

console.log("VEJA A REPETIÇÃO DO RENDERIZAR TABELA PRODUTO")

// ========================
// ABRIR PÁGINA CRUD
// ========================
exports.abrirCrudFuncionario = (req, res) => {
  console.log('Rota abrirCrudFuncionario acessada')
  res.sendFile(path.join(__dirname, '../../frontend/funcionario/funcionario.html'));
};

// ========================
// LISTAR TODAS AS PESSOAS (CLIENTES)
// ========================
exports.listarFuncionarios = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.id_pessoa,
             COALESCE(c.nome_cliente, f.nome_func) AS nome_pessoa,
             f.email_func AS email_pessoa,
             f.senha_func AS senha_pessoa,
             f.endereco_func AS endereco_pessoa,
             f.telefone_func AS telefone_pessoa,
             f.data_nascimento AS data_nascimento,
             f.salario,
             f.carga_horaria,
             CASE 
                 WHEN g.id_pessoa IS NOT NULL THEN 'Gerente'
                 WHEN f.id_pessoa IS NOT NULL THEN 'Funcionário'
                 WHEN c.id_pessoa IS NOT NULL THEN 'Cliente'
                 ELSE 'Desconhecido'
             END AS tipo
      FROM PESSOA p
      LEFT JOIN CLIENTE c ON p.id_pessoa = c.id_pessoa
      LEFT JOIN FUNCIONARIO f ON p.id_pessoa = f.id_pessoa
      LEFT JOIN GERENTE g ON f.id_pessoa = g.id_pessoa
      ORDER BY p.id_pessoa;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};




// ========================
// CRIAR FUNCIONÁRIO
// ========================
exports.criarFuncionario = async (req, res) => {
  try {
    const {
      id_pessoa,
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento,
      salario,
      carga_horaria
    } = req.body;

    if (!nome_pessoa || !email_pessoa || !senha_pessoa || !data_nascimento || !salario || !carga_horaria) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }

    const idInt = parseInt(id_pessoa);
    if (isNaN(idInt)) return res.status(400).json({ error: 'id_pessoa deve ser um número inteiro válido' });

    await query('INSERT INTO PESSOA (id_pessoa) VALUES ($1)', [idInt]);

    const result = await query(
      `INSERT INTO FUNCIONARIO 
        (id_pessoa, nome_func, email_func, senha_func, endereco_func, telefone_func, data_nascimento, salario, carga_horaria)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [idInt, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento, salario, carga_horaria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'id_pessoa ou email já estão em uso' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================
// OBTER FUNCIONÁRIO POR ID
// ========================
exports.obterFuncionario = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });

    const result = await query(
      `SELECT 
        p.id_pessoa,
        f.nome_func AS nome_pessoa,
        f.email_func AS email_pessoa,
        f.senha_func AS senha_pessoa,
        f.endereco_func AS endereco_pessoa,
        f.telefone_func AS telefone_pessoa,
        f.data_nascimento,
        f.salario,
        f.carga_horaria
       FROM FUNCIONARIO f
       JOIN PESSOA p ON f.id_pessoa = p.id_pessoa
       WHERE p.id_pessoa = $1`,
      [id_pessoa]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================
// ATUALIZAR FUNCIONÁRIO
// ========================
exports.atualizarFuncionario = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    const {
      nome_pessoa,
      email_pessoa,
      senha_pessoa,
      endereco_pessoa,
      telefone_pessoa,
      data_nascimento,
      salario,
      carga_horaria
    } = req.body;

    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });

    const existing = await query(`SELECT * FROM FUNCIONARIO WHERE id_pessoa = $1`, [id_pessoa]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });

    const person = existing.rows[0];

    const result = await query(
      `UPDATE FUNCIONARIO SET 
        nome_func=$1, email_func=$2, senha_func=$3, endereco_func=$4, 
        telefone_func=$5, data_nascimento=$6, salario=$7, carga_horaria=$8
       WHERE id_pessoa=$9 RETURNING *`,
      [
        nome_pessoa ?? person.nome_func,
        email_pessoa ?? person.email_func,
        senha_pessoa ?? person.senha_func,
        endereco_pessoa ?? person.endereco_func,
        telefone_pessoa ?? person.telefone_func,
        data_nascimento ?? person.data_nascimento,
        salario ?? person.salario,
        carga_horaria ?? person.carga_horaria,
        id_pessoa
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    if (error.code === '23505') return res.status(400).json({ error: 'Email já em uso' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// ========================
// DELETAR FUNCIONÁRIO
// ========================
exports.deletarFuncionario = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    if (isNaN(id_pessoa)) return res.status(400).json({ error: 'id_pessoa inválido' });

    const existing = await query(`SELECT * FROM FUNCIONARIO WHERE id_pessoa=$1`, [id_pessoa]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });

    await query(`DELETE FROM FUNCIONARIO WHERE id_pessoa=$1`, [id_pessoa]);
    await query(`DELETE FROM PESSOA WHERE id_pessoa=$1`, [id_pessoa]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};