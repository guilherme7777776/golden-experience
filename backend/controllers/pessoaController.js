const { query } = require('../database');
const path = require('path');

exports.abrirCrudPessoa = (req, res) => {
  console.log("abrir  crud")
  res.sendFile(path.join(__dirname, '../../frontend/pessoa/pessoa.html'));
}

exports.listarPessoas = async (req, res) => {
  console.log("wiogfhiwhegefiohoerwg");
  try {
    const result = await query('SELECT * FROM CLIENTE ORDER BY id_pessoa');
    res.json(result.rows);
    
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor1' });
    
  }
}

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
    const idPessoaNum = Number(id_pessoa);
    // Validação básica
    if (!nome_pessoa || !email_pessoa || !senha_pessoa || !data_nascimento) {
      return res.status(400).json({
        error: 'id_pessoa, nome, email e senha são obrigatórios'
      });
    }

    // Validação de id_pessoa numérico
    if (typeof idPessoaNum !== 'number' || !Number.isInteger(idPessoaNum)) {
      return res.status(400).json({ error: 'id_pessoa deve ser um número inteiro válido' });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_pessoa)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    const result = await query(
      `INSERT INTO PESSOA (
          id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, 
          endereco_pessoa, telefone_pessoa, data_nascimento
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        
      [id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, endereco_pessoa, telefone_pessoa, data_nascimento]
    );
    
    // Inserir na tabela CLIENTE, usando o mesmo id_pessoa
    await query(
      `INSERT INTO CLIENTE (id_pessoa) VALUES ($1)`,
      [id_pessoa]
    );
    

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);

    if (error.code === '23505') {
      // Pode ser id_pessoa ou email duplicado
      return res.status(400).json({
        error: 'id_pessoa ou email já estão em uso'
      });
    }

    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor2' });
  }
}

exports.obterPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    
    if (isNaN(id_pessoa)) {
      
      return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });
    }
    

    const result = await query(
      'SELECT * FROM CLIENTE JOIN PESSOA ON CLIENTE.id_pessoa = PESSOA.id_pessoa WHERE CLIENTE.id_pessoa = $1'
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
}

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
      return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });
    }

    // Validação de email se fornecido
    if (email_pessoa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_pessoa)) {
        return res.status(400).json({
          error: 'Formato de email inválido'
        });
      }
    }

    // Verifica se a pessoa existe
    const existingPersonResult = await query(
      'SELECT * FROM PESSOA WHERE id_pessoa = $1',
      [id_pessoa]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_pessoa: nome_pessoa !== undefined ? nome_pessoa : currentPerson.nome_pessoa,
      email_pessoa: email_pessoa !== undefined ? email_pessoa : currentPerson.email_pessoa,
      senha_pessoa: senha_pessoa !== undefined ? senha_pessoa : currentPerson.senha_pessoa,
      endereco_pessoa: endereco_pessoa !== undefined ? endereco_pessoa : currentPerson.endereco_pessoa,
      telefone_pessoa: telefone_pessoa !== undefined ? telefone_pessoa : currentPerson.telefone_pessoa,
      data_nascimento: data_nascimento !== undefined ? data_nascimento : currentPerson.data_nascimento
    };

    const updateResult = await query(
      `UPDATE PESSOA
       SET nome_pessoa = $1, email_pessoa = $2, senha_pessoa = $3, endereco_pessoa = $4, telefone_pessoa = $5, data_nascimento = $6
       WHERE id_pessoa = $7 RETURNING *`,
      [
        updatedFields.nome_pessoa,
        updatedFields.email_pessoa,
        updatedFields.senha_pessoa,
        updatedFields.endereco_pessoa,
        updatedFields.telefone_pessoa,
        updatedFields.data_nascimento,
        id_pessoa
      ]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Email já está em uso por outra pessoa'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor4' });
  }
}

exports.deletarPessoa = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);

    if (isNaN(id_pessoa)) {
      return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });
    }

    // Verifica se a pessoa existe
    const existingPersonResult = await query(
      'SELECT * FROM CLIENTE JOIN PESSOA ON CLIENTE.id_pessoa = PESSOA.id_pessoa WHERE CLIENTE.id_pessoa = $1'
      [id_pessoa]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    await query('DELETE FROM PESSOA WHERE id_pessoa = $1', [id_pessoa]);

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar pessoa com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor5' });
  }
}

// Buscar pessoa por email
exports.obterPessoaPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await query(
      'SELECT * FROM PESSOA WHERE email_pessoa = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor6' });
  }
}

// Atualizar somente senha
exports.atualizarSenha = async (req, res) => {
  try {
    const id_pessoa = parseInt(req.params.id);
    const { senha_atual, nova_senha } = req.body;

    if (isNaN(id_pessoa)) {
      return res.status(400).json({ error: 'id_pessoa deve ser um número válido' });
    }

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias'
      });
    }

    // Verifica se a pessoa existe e a senha atual está correta
    const personResult = await query(
      'SELECT * FROM PESSOA WHERE id_pessoa = $1',
      [id_pessoa]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    const person = personResult.rows[0];

    // Atenção: Aqui você deve comparar senhas com hash, essa é uma verificação simples
    if (person.senha_pessoa !== senha_atual) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    const updateResult = await query(
      'UPDATE PESSOA SET senha_pessoa = $1 WHERE id_pessoa = $2 RETURNING id_pessoa, nome_pessoa, email_pessoa, endereco_pessoa, telefone_pessoa', 'data_nascimento',
      [nova_senha, id_pessoa]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor7' });
  }
}

