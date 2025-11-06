// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('pessoaForm');
const searchId = document.getElementById('searchId');
const tipoPessoaSelect = document.getElementById('tipo_pessoa');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const pessoasTableBody = document.getElementById('pessoasTableBody');
const messageContainer = document.getElementById('messageContainer');

// Inicialização: carregar lista de pessoas
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);

    // Mostrar checkboxes sempre
    document.querySelectorAll('.cliente, .funcionario').forEach(el => el.style.display = 'block');
});

// Event Listeners
btnBuscar.addEventListener('click', buscarPessoa);
btnIncluir.addEventListener('click', incluirPessoa);
btnAlterar.addEventListener('click', alterarPessoa);
btnExcluir.addEventListener('click', excluirPessoa);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

// Mostrar mensagens na tela
function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => messageContainer.innerHTML = '', 3000);
}

// Bloquear ou liberar campos do formulário
function bloquearCampos(bloquear) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id === 'id_pessoa' || input.id === 'searchId') {
            input.disabled = bloquear;
        } else {
            input.disabled = !bloquear;
        }
    });
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    currentPersonId = null;
}

// Mostrar ou esconder botões conforme parâmetros
function mostrarBotoes(buscar, incluir, alterar, excluir, salvar, cancelar) {
    btnBuscar.style.display = buscar ? 'inline-block' : 'none';
    btnIncluir.style.display = incluir ? 'inline-block' : 'none';
    btnAlterar.style.display = alterar ? 'inline-block' : 'none';
    btnExcluir.style.display = excluir ? 'inline-block' : 'none';
    btnSalvar.style.display = salvar ? 'inline-block' : 'none';
    btnCancelar.style.display = cancelar ? 'inline-block' : 'none';
}

// Buscar pessoa pelo ID
async function buscarPessoa() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/pessoa/${id}`);
        if (response.ok) {
            const pessoa = await response.json();
            preencherFormulario(pessoa);
            mostrarBotoes(false, false, true, true, false, true);
            bloquearCampos(false);
            mostrarMensagem('Pessoa encontrada!', 'success');
        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false);
            bloquearCampos(false);
            mostrarMensagem('Pessoa não encontrada. Você pode incluir uma nova pessoa.', 'info');
        } else {
            throw new Error('Erro ao buscar pessoa');
        }
    } catch (error) {
        console.error(error);
        mostrarMensagem('Erro ao buscar pessoa', 'error');
    }
}

// Preencher formulário com dados da pessoa
function preencherFormulario(pessoa) {
    currentPersonId = pessoa.id_pessoa;
    searchId.value = pessoa.id_pessoa || '';
    document.getElementById('id_pessoa').value = pessoa.id_pessoa || '';
    document.getElementById('nome_pessoa').value = pessoa.nome_pessoa || '';
    document.getElementById('email_pessoa').value = pessoa.email_pessoa || '';
    document.getElementById('senha_pessoa').value = pessoa.senha_pessoa || '';
    document.getElementById('endereco_pessoa').value = pessoa.endereco_pessoa || '';
    document.getElementById('telefone_pessoa').value = pessoa.telefone_pessoa || '';
    if (pessoa.data_nascimento) {
        document.getElementById('data_nascimento').value = new Date(pessoa.data_nascimento).toISOString().split('T')[0];
    } else {
        document.getElementById('data_nascimento').value = '';
    }

    // Marcar checkboxes de acordo com o tipo
    document.getElementById('checkboxCliente').checked = pessoa.tipo_pessoa === 'CLIENTE';
    document.getElementById('checkboxFuncionario').checked = pessoa.tipo_pessoa === 'FUNCIONARIO';

    // Preencher campos específicos
    document.getElementById('renda_cliente').value = pessoa.renda_cliente || '';
    document.getElementById('data_cadastro_cliente').value = pessoa.data_cadastro || '';
    document.getElementById('salario_funcionario').value = pessoa.salario || '';
    document.getElementById('porcentagem_comissao_funcionario').value = pessoa.carga_horaria || '';
    document.getElementById('cargo_id_cargo').value = pessoa.id_cargo || '';
}

// Iniciar inclusão de nova pessoa
function incluirPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'incluir';
}

// Iniciar alteração de pessoa existente
function alterarPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'alterar';
}

// Iniciar exclusão de pessoa
function excluirPessoa() {
    mostrarMensagem('Confirme a exclusão!', 'info');
    bloquearCampos(false);
    mostrarBotoes(false, false, false, false, true, true);
    operacao = 'excluir';
}

// Salvar operação (incluir, alterar, excluir)
async function salvarOperacao() {
    const formData = new FormData(form);

    // Determinar tipo com base na checkbox
    let tipoPessoa = null;
    if (document.getElementById('checkboxCliente').checked) tipoPessoa = 'CLIENTE';
    if (document.getElementById('checkboxFuncionario').checked) tipoPessoa = 'FUNCIONARIO';

    const pessoa = {
        id_pessoa: document.getElementById('searchId').value,
        nome_pessoa: formData.get('nome_pessoa'),
        email_pessoa: formData.get('email_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        endereco_pessoa: formData.get('endereco_pessoa'),
        telefone_pessoa: formData.get('telefone_pessoa'),
        data_nascimento: formData.get('data_nascimento') || null,
        tipo_pessoa: tipoPessoa,
        // Campos de CLIENTE
        renda_cliente: formData.get('renda_cliente') || null,
        data_cadastro: formData.get('data_cadastro_cliente') || null,
        // Campos de FUNCIONARIO
        salario: formData.get('salario_funcionario') || null,
        carga_horaria: formData.get('porcentagem_comissao_funcionario') || null,
        id_cargo: formData.get('cargo_id_cargo') || null
    };

    try {
        let response;
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/pessoa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pessoa)
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pessoa)
            });
        } else if (operacao === 'excluir') {
            response = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, { method: 'DELETE' });
        }

        if (response.ok) {
            mostrarMensagem(`Operação ${operacao} realizada com sucesso!`, 'success');
            limparFormulario();
            carregarPessoas();
            mostrarBotoes(true, false, false, false, false, false);
            bloquearCampos(false);
            searchId.focus();
        } else {
            const err = await response.json();
            mostrarMensagem(err.error || 'Erro na operação', 'error');
        }
    } catch (error) {
        console.error(error);
        mostrarMensagem('Erro na operação', 'error');
    }
}

// Cancelar operação
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
    searchId.focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Carregar lista de pessoas
async function carregarPessoas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa`);
        if (!response.ok) throw new Error('Erro ao carregar pessoas');
        const pessoas = await response.json();
        renderizarTabelaPessoas(pessoas);
    } catch (error) {
        console.error(error);
        mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
    }
}

// Renderizar tabela de pessoas
function renderizarTabelaPessoas(pessoas) {
    pessoasTableBody.innerHTML = '';

    pessoas.forEach(pessoa => {
        const row = document.createElement('tr');

        const dataFormatada = pessoa.data_nascimento
            ? new Date(pessoa.data_nascimento).toISOString().split('T')[0]
            : '';

        const idButton = document.createElement('button');
        idButton.textContent = pessoa.id_pessoa;
        idButton.classList.add('btn-id');

        if (pessoa.tipo_pessoa === 'FUNCIONARIO') {
            idButton.style.cursor = 'not-allowed';
            idButton.style.backgroundColor = 'gray';
            idButton.style.borderColor = 'gray';
            idButton.style.color = 'white';
            idButton.style.opacity = '0.9';
        } else {
            idButton.onclick = () => selecionarPessoa(pessoa.id_pessoa);
        }

        const cells = [
            idButton,
            pessoa.nome_pessoa || '',
            pessoa.email_pessoa || '',
            pessoa.senha_pessoa || '',
            pessoa.endereco_pessoa || '',
            pessoa.telefone_pessoa || '',
            dataFormatada,
            pessoa.tipo_pessoa || ''
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            if (cell instanceof HTMLElement) td.appendChild(cell);
            else td.textContent = cell;
            row.appendChild(td);
        });

        pessoasTableBody.appendChild(row);
    });
}

// Selecionar pessoa da tabela
async function selecionarPessoa(id) {
    searchId.value = id;
    await buscarPessoa();
}
