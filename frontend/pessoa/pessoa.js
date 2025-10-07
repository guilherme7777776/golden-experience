// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
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

// Inicialização: carregar lista de pessoas
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
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
function bloquearCampos(bloquearId) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input, index) => {
        if (input.id === 'id_pessoa' || input.id === 'searchId') {
            input.disabled = bloquearId;
        } else {
            input.disabled = !bloquearId;
        }
    });
}

// Limpar formulário
function limparFormulario() {
    form.reset();
    currentPersonId = null;
}

// Mostrar ou esconder botões conforme parâmetros (true = mostrar)
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

// Salvar operação (incluir, alterar ou excluir)
async function salvarOperacao() {
    const formData = new FormData(form);
    const pessoa = {
        id_pessoa: formData.get('id_pessoa'),
        nome_pessoa: formData.get('nome_pessoa'),
        email_pessoa: formData.get('email_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        endereco_pessoa: formData.get('endereco_pessoa'),
        telefone_pessoa: formData.get('telefone_pessoa'),
        data_nascimento: formData.get('data_nascimento') || null,
    };
    console.log(pessoa)
    try {
        let response;
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/pessoa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pessoa),
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pessoa),
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

// Cancelar operação em andamento
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);
    bloquearCampos(false);
    searchId.focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Carregar e renderizar lista de pessoas
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

// Renderizar tabela com pessoas
function renderizarTabelaPessoas(pessoas) {
    pessoasTableBody.innerHTML = '';

    pessoas.forEach(pessoa => {
        let dataFormatada = '';
        if (pessoa.data_nascimento) {
            dataFormatada = new Date(pessoa.data_nascimento).toISOString().split('T')[0];
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="btn-id" onclick="selecionarPessoa(${pessoa.id_pessoa})">${pessoa.id_pessoa}</button></td>
            <td>${pessoa.nome_pessoa || ''}</td>
            <td>${pessoa.email_pessoa || ''}</td>
            <td>${pessoa.senha_pessoa || ''}</td>
            <td>${pessoa.endereco_pessoa || ''}</td>
            <td>${pessoa.telefone_pessoa || ''}</td>
            <td>${dataFormatada}</td>
        `;
        pessoasTableBody.appendChild(row);
    });
   
}

// Selecionar pessoa da tabela e buscar seus dados
async function selecionarPessoa(id) {
    searchId.value = id;
    await buscarPessoa();
}
