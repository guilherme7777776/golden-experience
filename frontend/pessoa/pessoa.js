

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

// Carregar lista de pessoas ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarPessoa);
btnIncluir.addEventListener('click', incluirPessoa);
btnAlterar.addEventListener('click', alterarPessoa);
btnExcluir.addEventListener('click', excluirPessoa);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
bloquearCampos(false);//libera pk e bloqueia os demais campos

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function bloquearCampos(bloquearPrimeiro) {
    const inputs = document.querySelectorAll('input, select,checkbox'); // Seleciona todos os inputs e selects do DOCUMENTO
    inputs.forEach((input, index) => {
        // console.log(`Input ${index}: ${input.name}, disabled: ${input.disabled}`);
        if (index === 0) {
            // Primeiro elemento - bloqueia se bloquearPrimeiro for true, libera se for false
            input.disabled = bloquearPrimeiro;
        } else {
            // Demais elementos - faz o oposto do primeiro
            input.disabled = !bloquearPrimeiro;
        }
    });
}

// Função para limpar formulário
function limparFormulario() {
    form.reset();
    
}


function mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar) {
    btnBuscar.style.display = btBuscar ? 'inline-block' : 'none';
    btnIncluir.style.display = btIncluir ? 'inline-block' : 'none';
    btnAlterar.style.display = btAlterar ? 'inline-block' : 'none';
    btnExcluir.style.display = btExcluir ? 'inline-block' : 'none';
    btnSalvar.style.display = btSalvar ? 'inline-block' : 'none';
    btnCancelar.style.display = btCancelar ? 'inline-block' : 'none';
}

// Função para formatar data para exibição
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para converter data para formato ISO
function converterDataParaISO(dataString) {
    if (!dataString) return null;
    return new Date(dataString).toISOString();
}
 
// Função para buscar pessoa por ID
async function buscarPessoa() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }
    

    bloquearCampos(false);
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa/${id}`);
        console.log(response, "resposte")
        
        console.log('ID:', id);
        console.log('URL:', `${API_BASE_URL}/pessoa/${id}`);

        if (response.ok) {
            const pessoa = await response.json();
            preencherFormulario(pessoa);
            console.log(1);

            mostrarBotoes(false, false, true, true, false, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Pessoa encontrada!', 'success');

        } else if (response.status === 404) {
            console.log(12);
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Pessoa não encontrada. Você pode incluir uma nova pessoa.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar pessoa');
        }
    } catch (error) {
        console.log(123);
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar pessoa', 'error');
    }
}

// Função para preencher formulário com dados da pessoa
function preencherFormulario(pessoa) {
    
    currentPersonId = pessoa.id_pessoa;
    searchId.value = pessoa.id_pessoa;
    document.getElementById('id_pessoa').value = pessoa.id_pessoa || '';
    document.getElementById('nome_pessoa').value = pessoa.nome_pessoa || '';
    document.getElementById('email_pessoa').value = pessoa.email_pessoa || '';
    document.getElementById('senha_pessoa').value = pessoa.senha_pessoa || '';
    document.getElementById('endereco_pessoa').value = pessoa.endereco_pessoa || '';
    document.getElementById('telefone_pessoa').value = pessoa.telefone_pessoa || '';
    document.getElementById('data_nascimento').value = pessoa.data_nascimento || '';



    // Formatação da data para input type="date"
    if (pessoa.data_nascimento) {
        const data = new Date(pessoa.data_nascimento);
        const dataFormatada = data.toISOString().split('T')[0];
        document.getElementById('data_nascimento').value = dataFormatada;
    } else {
        document.getElementById('data_nascimento').value = '';
    }
}


// Função para incluir pessoa
async function incluirPessoa() {

    mostrarMensagem('Digite os dados!', 'success');
    currentPersonId = searchId.value;

    // console.log('Incluir nova pessoa - currentPersonId: ' + currentPersonId);
    limparFormulario();
    searchId.value = currentPersonId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_pessoa').focus();
    operacao = 'incluir';
    // console.log('fim nova pessoa - currentPersonId: ' + currentPersonId);
}

// Função para alterar pessoa
async function alterarPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_pessoa').focus();
    operacao = 'alterar';
}

// Função para excluir pessoa
async function excluirPessoa() {
    mostrarMensagem('Excluindo pessoa...', 'info');
    currentPersonId = searchId.value;
    
    
    //bloquear searchId
    searchId.disabled = true;
    bloquearCampos(false); // libera os demais campos
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)           
    operacao = 'excluir';
}
console.log()
async function salvarOperacao() {
    const formData = new FormData(form);
    
    const pessoa = {
        id_pessoa: currentPersonId,
        nome_pessoa: formData.get('nome_pessoa'),
        email_pessoa: formData.get('email_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        endereco_pessoa: formData.get('endereco_pessoa'),
        telefone_pessoa: formData.get('telefone_pessoa'),
        data_nascimento: formData.get('data_nascimento')
        
    };
    
    console.log(pessoa,"AAAAAAAAAAAAAAAAAAAA")
    try {
        let responsePessoa;

        if (operacao === 'incluir') {
            
            responsePessoa = await fetch(`${API_BASE_URL}/pessoa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pessoa)
                
               
            });

        } else if (operacao === 'alterar') {
            responsePessoa = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pessoa)
            });

        } else if (operacao === 'excluir') {
            responsePessoa = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'DELETE'
            });
        }

        if (responsePessoa.ok && (operacao === 'incluir' || operacao === 'alterar')) {
            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            carregarPessoas();
            try {
                const response = await fetch(`${API_BASE_URL}/pessoa`);
                console.log("weghouiwhegiow",response);
        
                if (response.ok) {
                    const pessoas = await response.json();
                    renderizarTabelaPessoas(pessoas);
                } else {
                    throw new Error('Erro ao carregar pessoas');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
            }

        } else if (operacao !== 'excluir') {
            const error = await responsePessoa.json();
            mostrarMensagem(error.error || 'Erro ao incluir ou alterar pessoa', 'error');

        } else {
            mostrarMensagem('Pessoa excluída com sucesso!', 'success');
            limparFormulario();
            carregarPessoas();
            
            try {
                const response = await fetch(`${API_BASE_URL}/pessoa`);
                
        
                if (response.ok) {
                    const pessoas = await response.json();
                    renderizarTabelaPessoas(pessoas);
                } else {
                    throw new Error('Erro ao carregar pessoas');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
            }
        }

    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir, alterar ou excluir a pessoa', 'error');
    }

    mostrarBotoes(true, false, false, false, false, false); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false); // libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
}

// Função para cancelar operação
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
    mostrarMensagem('Operação cancelada', 'info');
}
function obterIdValido() {
    const valor = document.getElementById('id_pessoa')?.value || document.getElementById('searchId')?.value;

    if (!valor) return null;

    const id = parseInt(valor, 10);
    if (isNaN(id) || id <= 0) return null;

    return id;
}

// Função para carregar lista de pessoas
async function carregarPessoas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa`);
        console.log("weghouiwhegiow",response);

        if (response.ok) {
            const pessoas = await response.json();
            renderizarTabelaPessoas(pessoas);
        } else {
            throw new Error('Erro ao carregar pessoas');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
    }
}

// Função para renderizar tabela de pessoas
function renderizarTabelaPessoas(pessoas) {
    
    pessoasTableBody.innerHTML = '';
    
    
    pessoas.forEach(pessoa => {
        let data = new Date(pessoa.data_nascimento);
        let dataFormatada = data.toISOString().split('T')[0]; // "1990-01-15"
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <button class="btn-id" onclick="selecionarPessoa(${pessoa.id_pessoa})">
                            ${pessoa.id_pessoa}
                        </button>
                    </td>
                    <td>${pessoa.nome_pessoa}</td>
                    <td>${pessoa.email_pessoa}</td>
                    <td>${pessoa.senha_pessoa}</td>
                    <td>${pessoa.endereco_pessoa}</td>
                    <td>${pessoa.telefone_pessoa}</td> 
                    <td>${dataFormatada}</td>                
                `;
        pessoasTableBody.appendChild(row);
    });
    
    
}

// Função para selecionar pessoa da tabela
async function selecionarPessoa(id) {
    searchId.value = id;
    await buscarPessoa();
}


