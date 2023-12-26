const btnCadastrar = document.getElementById('btn-cadastrar');
if (btnCadastrar) {
    btnCadastrar.addEventListener('click', cadastrarDespesa);
}

class BancoDados {

    constructor() {
        this.listaDespesas = this.carregarListaDespesas();
    }

    gravar(despesa) {
        const CHAVE = localStorage.length;

        const VALOR = JSON.stringify(despesa);
        localStorage.setItem(`${CHAVE + 1}`, VALOR);
    }

    carregarListaDespesas() {
        const QTDE_DESPESAS = localStorage.length;
        let listaDespesas = [];
        let elemento = null;
        for (let chave = 1; chave <= QTDE_DESPESAS + 10; chave++) {
            if (localStorage.getItem(chave)) {
                elemento = JSON.parse(localStorage.getItem(chave));
                elemento._id = chave;
                listaDespesas.push(elemento);
            }
        }
        return listaDespesas;
    }

    pesquisarDespesa = () => {
        const LISTA_DESPESAS = this.carregarListaDespesas();
        const valor = Number.parseFloat(document.getElementById('valor').value);
        const descricao = document.getElementById('descricao').value.trim().toLowerCase();
        const tipo = document.getElementById('tipo').value;
        const dia = document.getElementById('dia').value;
        const mes = document.getElementById('mes').value;
        const ano = document.getElementById('ano').value;

        let resultado = LISTA_DESPESAS;


        if (!isNaN(valor)) {
            resultado = resultado.filter((despesa) => despesa._valor === valor);
        }

        if (descricao !== '') {
            resultado = resultado.filter((despesa) => despesa._descricao.toLowerCase().indexOf(descricao) !== -1);
        }

        if (tipo !== '') {
            resultado = resultado.filter((despesa) => despesa._tipo === tipo);
        }

        if (dia !== '') {
            resultado = resultado.filter((despesa) => despesa._dia === dia);
        }

        if (mes !== '') {
            resultado = resultado.filter((despesa) => despesa._mes === mes);
        }

        if (ano !== '') {
            resultado = resultado.filter((despesa) => despesa._ano === ano);
        }

        limparTabela();
        if (ano === '' && mes === '' && dia === '' && tipo === '' && descricao === '' && isNaN(valor)) {
            preencherCampos(LISTA_DESPESAS);
        } else {
            preencherCampos(resultado);
        }

    }

    remover(id) {
        localStorage.removeItem(id);
    }
}

if (document.getElementById('body')) {
    const bodyHTML = document.getElementById('body');
    bodyHTML.onload = () => {
        const bancoDados = new BancoDados();

        preencherCampos(bancoDados.carregarListaDespesas());
}
};



const isDataValida = (ano, mes, dia) => {
    if (dia <= 31 && dia >= 1 && mes >= 1 && mes <= 12) {
        return !isNaN(new Date(`${ano}/${mes - 1}/${dia}`));
    }
    return false;
}
const isDescricaoValida = (descricao) => (descricao.length === 0) ? false : true;
const isTipoValido = (tipo) => tipo.toLowerCase() === 'tipo' ? false : true;
const isValorValido = (valor) => {
    if (typeof valor === 'string') {
        valor = valor.replace(/,/gi, '.');
    }
    if (valor === undefined || valor === '') {
        return false;
    }
    return !isNaN(Number.parseFloat(valor));

}

class Despesa {
    /**
     * 
     * @param {number} ano 
     * @param {number} mes 
     * @param {number} dia 
     * @param {number} tipo 
     * @param {string} descricao 
     * @param {number} valor 
     */
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this._ano = ano;
        this._mes = mes;
        this._dia = dia;
        this._tipo = tipo;
        this._descricao = descricao;
        this._valor = valor;
    }

    isDadosValidos() {
        for (let chave in this) {
            if (this[chave] === null || this[chave] === '') {
                return false;
            }

            if (chave === '_tipo') {
                return this[chave] !== 'Tipo';
            }
        }
        return true;
    }


    get ano() {
        return this._ano;
    }

    set ano(ano) {
        if (ano > 0) {
            this._ano = ano;
        }
    }

    get mes() {
        return this._mes;
    }

    set mes(mes) {
        if (mes >= 1 && mes <= 12) {
            this._mes = mes;
        }
    }

    get dia() {
        return this._dia;
    }

    set dia(dia) {
        if (dia > 0 && dia < 30) {
            this._dia = dia;
        }
    }

    get tipo() {
        return this._tipo;
    }

    set tipo(tipo) {
        this._tipo = tipo;
    }

    get descricao() {
        return this._descricao;
    }

    set descricao(descricao) {
        this._descricao = descricao;
    }

    get valor() {
        return this._valor;
    }

    set valor(valor) {
        if (valor >= 0) {
            this._valor = valor;
        }
    }
}
/**
 * 
 * @param {string[]} campos Campos que se deseja remover o conteúdo presente 
 */
function limparCamposFormulario(campos = null) {
    for (campo of campos) {
        campo.value = '';
    }
}

// Mostra os campos inválidos do modal
function mensagemErro(titulo, mensagem = 'erro', id) {
    if (!document.getElementById(id)) {
        const paragrafo = document.createElement('p');
        paragrafo.setAttribute('id', `${id}`);
        paragrafo.innerHTML = `<span id='${id}-titulo'>${titulo}</span>: ${mensagem}`;
        const modalBody = document.getElementById('modal-body-resultado');
        modalBody.appendChild(paragrafo);
        document.getElementById(`${id}-titulo`).style.color = 'red';

    }

}
// Remove as mensagens de erro do modal
function removerMensagemErro() {
    let elemento = null;
    const ERROS = ['data-modal', 'valor-modal', 'tipo-modal', 'descricao-modal'];
    const modalBody = document.getElementsByClassName('modal-body')[0];

    ERROS.forEach((valor) => {
        elemento = document.getElementById(valor);
        if (elemento) {
            modalBody.removeChild(elemento);
        }
    });
}

function mostrarModal(modal = null) {
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.removeAttribute('arial-hidden');
}

function esconderModal(modal = null) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('arial-hidden', 'true');
}

/**
 * 
 * @param {object} componenteModal Componente do modal que deseja ser inserido o conteúdol 
 * @param {string} conteudo Contéudo no formato string que desejado que seja inserido dentro componente do modal
 */
function definirConteudoComponenteModal(componenteModal, conteudo) {
    componenteModal.innerHTML = conteudo;
}

/**
 * 
 * @param {object} componenteModal  Componente do modal que deseja ser inserido as classes
 * @param {string[]} classes Array de classes no formato string desejado para o componente do modal
 */
function definirClassesComponenteModal(componenteModal, classes) {
    if (Array.isArray(classes)) {
        componenteModal.classList.add(...classes);
    }
}

function cadastrarDespesa() {

    const ano = document.getElementById('ano');
    const mes = document.getElementById('mes');
    const dia = document.getElementById('dia');
    const tipo = document.getElementById('tipo');
    const descricao = document.getElementById('descricao');
    const valor = document.getElementById('valor');

    const despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value.trim(), Number.parseFloat(valor.value));
    // Elementos do Modal
    const modalDespesa = document.getElementById('modal-resultado');
    const modalTitulo = document.getElementsByClassName('modal-title')[0];
    const modalBody = document.getElementsByClassName('modal-body')[0];
    const btnFecharModal = document.getElementsByClassName('btn-voltar-modal');

    let classes = [];
    const bd = new BancoDados();

    if (despesa.isDadosValidos()) {

        const data = document.createElement('h4');
        data.setAttribute('class', 'center');
        data.innerHTML = `Data: ${despesa.dia}/${despesa.mes}/${despesa.ano}`;
        const paragrafo = document.createElement('p');

        paragrafo.innerHTML = `Despesa de R$ ${despesa.valor.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        })} reais cadastrada com sucesso!`;

        classes = ['text-success', 'font-weight-bold', 'text-uppercase'];
        definirConteudoComponenteModal(modalTitulo, `Despesa cadastrada com sucesso`);
        definirClassesComponenteModal(modalTitulo, classes);

        for (botao of btnFecharModal) {
            botao.addEventListener('click', () => {
                esconderModal(modalDespesa);
                // Removendo o parágrafo de cadastro
                modalBody.removeChild(data);
                modalBody.removeChild(paragrafo);
                modalTitulo.classList.remove(...classes);
            });
        }
        modalBody.appendChild(data);
        modalBody.appendChild(paragrafo);
        mostrarModal(modalDespesa);
        limparCamposFormulario([ano, mes, dia, tipo, descricao, valor]);
        bd.gravar(despesa);
    } else {

        classes = ['text-danger', 'font-weight-bold', 'text-uppercase'];
        definirClassesComponenteModal(modalTitulo, classes);
        definirConteudoComponenteModal(modalTitulo, `Erro no cadastro da despesa`);

        if (!isDataValida(despesa.ano, despesa.mes, despesa.dia)) {
            mensagemErro('Data Inválida', 'Por verifique se todos os campos estão corretos', 'data-modal');
        }
        if (!isValorValido(despesa.valor)) {
            mensagemErro('Valor Inválido', 'Por favor digite um valor válido', 'valor-modal');
        }

        if (!isTipoValido(despesa.tipo)) {
            mensagemErro('Tipo Inválido', 'Por favor selecione um tipo!', 'tipo-modal');
        }

        if (!isDescricaoValida(despesa.descricao)) {
            mensagemErro('Descrição inválida', 'Por favor preencha a descrição', 'descricao-modal')
        }


        for (botao of btnFecharModal) {
            // Fechar o modal de erro
            botao.addEventListener('click', () => {
                esconderModal(modalDespesa);
                removerMensagemErro();
                modalTitulo.classList.remove(...classes);
            });
        }
        mostrarModal(modalDespesa);
    }

}


const btnPesquisar = document.getElementById('btn-pesquisar');
if (btnPesquisar) {
    btnPesquisar.addEventListener('click', new BancoDados().pesquisarDespesa);
}


function limparTabela() {
    document.getElementsByTagName('tbody')[0].innerHTML = '';
}



function definirTipoDespesa(despesa) {
    let tipo_despesa = '';

    switch (despesa._tipo) {
        case '1':
            tipo_despesa = 'Alimentação';
            break;
        case '2':
            tipo_despesa = 'Educação';
            break;
        case '3':
            tipo_despesa = 'Lazer';
            break;
        case '4':
            tipo_despesa = 'Saúde';
            break;
        case '5':
            tipo_despesa = 'Transporte';
            break;
    }
    return tipo_despesa;

}

function preencherCampos(listaDespesas) {
    const tabelaCorpo = document.getElementsByTagName('tbody')[0];
    let linha = null;
    const BD = new BancoDados();
    if (Array.isArray(listaDespesas)) {
        listaDespesas.forEach((despesa) => {
            linha = tabelaCorpo.insertRow();
            linha.insertCell(0).innerHTML = `${despesa._dia}/${despesa._mes}/${despesa._ano}`;;
            linha.insertCell(1).innerHTML = `${definirTipoDespesa(despesa)}`;
            linha.insertCell(2).innerHTML = `${despesa._descricao}`;
            linha.insertCell(3).innerHTML = `R$ ${despesa._valor.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} reais`;
            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('btn', 'btn-danger');
            btnExcluir.innerHTML = `<i class="fas fa-trash"> </>`;
            btnExcluir.setAttribute('id', despesa._id);
            btnExcluir.addEventListener('click', () => {
                BD.remover(btnExcluir.getAttribute('id'));
                limparTabela();
                preencherCampos(BD.carregarListaDespesas());
            });
            linha.insertCell(4).append(btnExcluir);
        });
    }
}


