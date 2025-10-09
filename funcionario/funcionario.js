// ========================
// Configuração da API
// ========================
const API_BASE_URL = 'http://localhost:3001';
let currentFuncionarioId = null;
let operacao = null;

// ========================
// Elementos do DOM
// ========================
const form = document.getElementById('pessoaForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const pessoasTableBody = document.getElementById('pessoasTableBody');
const messageContainer = document.getElementById('messageContainer');

// ========================
// Inicialização
// ========================
document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionarios();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
});

// ========================
// Event Listeners
// ========================
btnBuscar.addEventListener('click', buscarFuncionario);
btnIncluir.addEventListener('click', incluirFuncionario);
btnAlterar.addEventListener('click', alterarFuncionario);
btnExcluir.addEventListener('click', excluirFuncionario);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

// ========================
// Funções Auxiliares
// ========================
function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => messageContainer.innerHTML = '', 3000);
}

function bloquearCampos(bloquearId) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.id === 'id_pessoa' || input.id === 'searchId') {
            input.disabled = bloquearId;
        } else {
            input.disabled = !bloquearId;
        }
    });
}

function limparFormulario() {
    form.reset();
    currentFuncionarioId = null;
}

function mostrarBotoes(buscar, incluir, alterar, excluir, salvar, cancelar) {
    btnBuscar.style.display = buscar ? 'inline-block' : 'none';
    btnIncluir.style.display = incluir ? 'inline-block' : 'none';
    btnAlterar.style.display = alterar ? 'inline-block' : 'none';
    btnExcluir.style.display = excluir ? 'inline-block' : 'none';
    btnSalvar.style.display = salvar ? 'inline-block' : 'none';
    btnCancelar.style.display = cancelar ? 'inline-block' : 'none';
}

// ========================
// Funções CRUD
// ========================

// Buscar funcionário pelo ID
async function buscarFuncionario() {
    
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/funcionario/${id}`);
        if (response.ok) {
            const funcionario = await response.json();
            preencherFormulario(funcionario);
            mostrarBotoes(false, false, true, true, false, true);
            bloquearCampos(false);
            mostrarMensagem('Funcionário encontrado!', 'success');
        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false);
            bloquearCampos(false);
            mostrarMensagem('Funcionário não encontrado. Você pode incluir um novo.', 'info');
        } else {
            throw new Error('Erro ao buscar funcionário');
        }
    } catch (error) {
        console.error(error);
        mostrarMensagem('Erro ao buscar funcionário', 'error');
    }
}

// Preencher formulário com dados do funcionário
function preencherFormulario(funcionario) {
    currentFuncionarioId = funcionario.id_pessoa;
    searchId.value = funcionario.id_pessoa || '';
    document.getElementById('id_pessoa').value = funcionario.id_pessoa || '';
    document.getElementById('nome_pessoa').value = funcionario.nome_pessoa || '';
    document.getElementById('email_pessoa').value = funcionario.email_pessoa || '';
    document.getElementById('senha_pessoa').value = funcionario.senha_pessoa || '';
    document.getElementById('endereco_pessoa').value = funcionario.endereco_pessoa || '';
    document.getElementById('telefone_pessoa').value = funcionario.telefone_pessoa || '';
    document.getElementById('salario').value = funcionario.salario || '';
    document.getElementById('carga_horaria').value = funcionario.carga_horaria || '';
    if (funcionario.data_nascimento) {
        document.getElementById('data_nascimento').value = new Date(funcionario.data_nascimento).toISOString().split('T')[0];
    } else {
        document.getElementById('data_nascimento').value = '';
    }
}

// Iniciar inclusão de novo funcionário
function incluirFuncionario() {
    mostrarMensagem('Digite os dados do novo funcionário!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'incluir';
}

// Iniciar alteração de funcionário existente
function alterarFuncionario() {
    mostrarMensagem('Edite os dados do funcionário!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);
    document.getElementById('nome_pessoa').focus();
    operacao = 'alterar';
}

// Iniciar exclusão de funcionário
function excluirFuncionario() {
    mostrarMensagem('Confirme a exclusão!', 'info');
    bloquearCampos(false);
    mostrarBotoes(false, false, false, false, true, true);
    operacao = 'excluir';
}

// Salvar operação (incluir, alterar ou excluir)
async function salvarOperacao() {
    const formData = new FormData(form);
    const funcionario = {
        id_pessoa: document.getElementById('searchId').value,
        nome_pessoa: formData.get('nome_pessoa'),
        email_pessoa: formData.get('email_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        endereco_pessoa: formData.get('endereco_pessoa'),
        telefone_pessoa: formData.get('telefone_pessoa'),
        data_nascimento: formData.get('data_nascimento') || null,
        salario: parseFloat(formData.get('salario')) || 0,
        carga_horaria: parseFloat(formData.get('carga_horaria')) || 0
    };

    try {
        let response;
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/funcionario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(funcionario),
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/funcionario/${currentFuncionarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(funcionario),
            });
        } else if (operacao === 'excluir') {
            response = await fetch(`${API_BASE_URL}/funcionario/${currentFuncionarioId}`, { method: 'DELETE' });
        }

        if (response.ok) {
            mostrarMensagem(`Operação ${operacao} realizada com sucesso!`, 'success');
            limparFormulario();
            carregarFuncionarios();
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

// Cancelar operação em andamento
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
    searchId.focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Carregar e renderizar lista de funcionários
async function carregarFuncionarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/funcionario`);
        if (!response.ok) throw new Error('Erro ao carregar funcionários');
        const funcionarios = await response.json();
        renderizarTabelaFuncionarios(funcionarios);
    } catch (error) {
        console.error(error);
        mostrarMensagem('Erro ao carregar lista de funcionários', 'error');
    }
}

function renderizarTabelaFuncionarios(funcionarios) {
    pessoasTableBody.innerHTML = '';

    funcionarios.forEach(funcionario => {
        let dataFormatada = '';
        if (funcionario.data_nascimento) {
            dataFormatada = new Date(funcionario.data_nascimento).toISOString().split('T')[0];
        }

        const row = document.createElement('tr');

        const idButton = document.createElement('button');
        idButton.textContent = funcionario.id_pessoa;
        idButton.classList.add('btn-id');

        // Desativa botão se não for funcionário ou gerente
        if (funcionario.tipo === 'Cliente') { 
            idButton.style.cursor = 'not-allowed';
            idButton.style.backgroundColor = 'gray';
            idButton.style.borderColor = 'gray';
            idButton.style.color = 'white';
            idButton.style.opacity = '0.9';
        } else {
            idButton.onclick = () => selecionarFuncionario(funcionario.id_pessoa);
        }

        const cells = [
            idButton,
            funcionario.nome_pessoa || '',
            funcionario.email_pessoa || '',
            funcionario.senha_pessoa || '',
            funcionario.endereco_pessoa || '',
            funcionario.telefone_pessoa || '',
            dataFormatada,
            funcionario.salario || '',
            funcionario.carga_horaria || '',
            funcionario.tipo // Cliente, Funcionário ou Gerente
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


// Selecionar funcionário da tabela e buscar seus dados
async function selecionarFuncionario(id) {
    searchId.value = id;
    await buscarFuncionario();
}
