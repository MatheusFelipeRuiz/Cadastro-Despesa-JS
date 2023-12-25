const btnCadastrar = document.getElementById('btn-cadastrar');
btnCadastrar.addEventListener('click', cadastrarDespesa);

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
            if (this[chave] === null || this[chave] === '' || this[chave] === null) {
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

// Mostra os campos inválidos do modal
function mensagemErro(titulo, mensagem = 'erro', id) {
    if (!document.getElementById(id)) {
        const paragrafo = document.createElement('p');
        paragrafo.setAttribute('id', `${id}`);
        paragrafo.innerHTML = `<span id='${id}-titulo'>${titulo}</span>: ${mensagem}`;
        const modalBody = document.getElementById('modal-body-erro');
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



function cadastrarDespesa() {

    const ano = document.getElementById('ano');
    const mes = document.getElementById('mes');
    const dia = document.getElementById('dia');
    const tipo = document.getElementById('tipo');
    const descricao = document.getElementById('descricao');
    const valor = document.getElementById('valor');

    const despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value.trim(), valor.value);

    if (despesa.isDadosValidos()) {
        gravar(despesa);
        const modalDespesa = document.getElementById('modal-sucesso-cadastro');
        const btnFecharModal = document.getElementsByClassName('btn-voltar-modal');
        
        const data = document.createElement('h4');
        data.setAttribute('class','center');
        data.innerHTML = `Data: ${despesa.dia}/${despesa.mes}/${despesa.ano}`;
        const paragrafo = document.createElement('p');
        paragrafo.innerHTML = `Despesa de R$ ${despesa.valor.toLocaleString('pt-BR', {
           maximumFractionDigits: 2,
           minimumFractionDigits: 2 
        })} reais cadastrada com sucesso!`;



        const modalBody = document.getElementById('modal-body-sucesso');

        for (botao of btnFecharModal) {
            botao.addEventListener('click', () => {
                modalDespesa.classList.remove('show');
                modalDespesa.style.display = 'none';
                modalDespesa.setAttribute('arial-hidden', 'true');

                // Removendo o parágrafo de cadastro
                modalBody.removeChild(paragrafo);        
            });
        }
        modalBody.appendChild(data);
        modalBody.appendChild(paragrafo);

        // Mostrar o modal de sucesso
        modalDespesa.classList.add('show');
        modalDespesa.style.display = 'block';
        modalDespesa.removeAttribute('arial-hidden');

    } else {
        const modalDespesa = document.getElementById('modal-erro-cadastro');
        const btnFecharModal = document.getElementsByClassName('btn-voltar-modal');

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
                modalDespesa.classList.remove('show');
                modalDespesa.style.display = 'none';
                modalDespesa.setAttribute('arial-hidden', 'true');
                removerMensagemErro();
            });
            // Mostra o modal de erro
            modalDespesa.classList.add('show');
            modalDespesa.style.display = 'block';
            modalDespesa.removeAttribute('arial-hidden');
        }

    }

}

// Grava a despesa cadastrada no locastorage
function gravar(despesa) {
    const CHAVE = localStorage.length;

    const VALOR = JSON.stringify(despesa);
    localStorage.setItem(`${CHAVE + 1}`, VALOR);
}

const qtde_registros = localStorage.length;
