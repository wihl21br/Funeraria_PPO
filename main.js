
let clientes = [];
let falecidos = [];
let atendimentos = [];
let editando = 0;

function pegar(id) {
    return document.getElementById(id);
}

async function carregar() {
    clientes = await (await fetch("/api/clientes")).json();
    falecidos = await (await fetch("/api/falecidos")).json();
    atendimentos = await (await fetch("/api/atendimentos")).json();

    if (pegar("totalClientes")) {
        pegar("totalClientes").textContent = clientes.length;
        pegar("totalFalecidos").textContent = falecidos.length;
        pegar("totalAtendimentos").textContent = atendimentos.length;
    }

    atualizarOpcoes();
    mostrar();
}

function buscarNome(lista, id) {
    let item = lista.find(item => item.id == id);
    return item ? item.nome : "Não encontrado";
}

function atualizarOpcoes() {
    let clienteSelect = pegar("clienteResponsavel") || pegar("clienteAtendimento");

    if (clienteSelect) {
        let selecionado = clienteSelect.value;

        clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';

        for (let cliente of clientes) {
            let opcao = document.createElement("option");
            opcao.value = cliente.id;
            opcao.textContent = cliente.nome;
            clienteSelect.appendChild(opcao);
        }

        clienteSelect.value = selecionado;
    }

    let falecidoSelect = pegar("falecidoAtendimento");

    if (falecidoSelect) {
        let cliente = pegar("clienteAtendimento").value;
        falecidoSelect.innerHTML = '<option value="">Selecione um falecido</option>';

        for (let falecido of falecidos) {
            if (falecido.cliente == cliente) {
                let opcao = document.createElement("option");
                opcao.value = falecido.id;
                opcao.textContent = falecido.nome;
                falecidoSelect.appendChild(opcao);
            }
        }
    }
}

function criarRegistro(titulo, linhas, tipo, id) {
    let div = document.createElement("div");
    div.className = "registro";

    let h3 = document.createElement("h3");
    h3.textContent = titulo;
    div.appendChild(h3);

    for (let linha of linhas) {
        let p = document.createElement("p");
        p.textContent = linha;
        div.appendChild(p);
    }

    if (tipo == "clientes") {
        let relatorio = document.createElement("button");
        relatorio.textContent = "Relatório";
        relatorio.onclick = function() {
            gerarRelatorio(id);
        };
        div.appendChild(relatorio);
    }

    let editarBotao = document.createElement("button");
    editarBotao.textContent = "Editar";
    editarBotao.onclick = function() {
        editar(tipo, id);
    };

    let excluirBotao = document.createElement("button");
    excluirBotao.textContent = "Excluir";
    excluirBotao.className = "excluir";
    excluirBotao.onclick = function() {
        excluir(tipo, id);
    };

    div.append(editarBotao, excluirBotao);

    return div;
}

function mostrar() {
    if (pegar("listaClientes")) {
        let lista = pegar("listaClientes");
        let pesquisa = pegar("pesquisaCliente").value.toLowerCase();

        lista.innerHTML = "";

        for (let c of clientes) {
            if (c.nome.toLowerCase().includes(pesquisa)) {
                lista.appendChild(criarRegistro(
                    c.nome,
                    ["Telefone: " + c.telefone, "E-mail: " + c.email],
                    "clientes",
                    c.id
                ));
            }
        }
    }

    if (pegar("listaFalecidos")) {
        let lista = pegar("listaFalecidos");
        lista.innerHTML = "";

        for (let f of falecidos) {
            lista.appendChild(criarRegistro(
                f.nome,
                [
                    "Nascimento: " + f.nascimento,
                    "Falecimento: " + f.falecimento,
                    "Cliente: " + buscarNome(clientes, f.cliente),
                    "Status: " + f.status
                ],
                "falecidos",
                f.id
            ));
        }
    }

    if (pegar("listaAtendimentos")) {
        let lista = pegar("listaAtendimentos");
        lista.innerHTML = "";

        for (let a of atendimentos) {
            lista.appendChild(criarRegistro(
                a.servico,
                [
                    "Cliente: " + buscarNome(clientes, a.cliente),
                    "Falecido: " + buscarNome(falecidos, a.falecido),
                    "Data: " + a.data,
                    "Horário: " + a.hora,
                    "Status: " + a.status,
                    "Observação: " + a.observacao
                ],
                "atendimentos",
                a.id
            ));
        }
    }
}

async function enviar(tipo, dados) {
    let endereco = "/api/" + tipo;
    let metodo = "POST";

    if (editando) {
        endereco += "/" + editando;
        metodo = "PUT";
    }

    let resposta = await fetch(endereco, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    let resultado = await resposta.json();

    alert(resultado.mensagem || resultado.erro);

    if (resposta.ok) {
        editando = 0;
        document.querySelector("form").reset();
        document.querySelector("form button").textContent = "Cadastrar";
        await carregar();
    }
}

async function excluir(tipo, id) {
    if (!confirm("Deseja excluir este registro?")) return;

    let resposta = await fetch("/api/" + tipo + "/" + id, {
        method: "DELETE"
    });

    let resultado = await resposta.json();

    alert(resultado.mensagem || resultado.erro);

    await carregar();
}

function editar(tipo, id) {
    let lista = tipo == "clientes" ? clientes :
                tipo == "falecidos" ? falecidos : atendimentos;

    let item = lista.find(registro => registro.id == id);

    if (!item) return;

    editando = id;

    if (tipo == "clientes") {
        pegar("nomeCliente").value = item.nome;
        pegar("telefoneCliente").value = item.telefone;
        pegar("emailCliente").value = item.email;
    }

    if (tipo == "falecidos") {
        pegar("nomeFalecido").value = item.nome;
        pegar("nascimentoFalecido").value = item.nascimento;
        pegar("falecimentoFalecido").value = item.falecimento;
        pegar("clienteResponsavel").value = item.cliente;
        pegar("statusFalecido").value = item.status;
    }

    if (tipo == "atendimentos") {
        pegar("clienteAtendimento").value = item.cliente;
        atualizarOpcoes();
        pegar("falecidoAtendimento").value = item.falecido;
        pegar("servico").value = item.servico;
        pegar("dataAtendimento").value = item.data;
        pegar("horaAtendimento").value = item.hora;
        pegar("statusAtendimento").value = item.status;
        pegar("observacao").value = item.observacao;
    }

    document.querySelector("form button").textContent = "Salvar alteração";
    window.scrollTo(0, 0);
}

function gerarRelatorio(id) {
    let cliente = clientes.find(c => c.id == id);

    if (!cliente) return;

    let texto = "RELATÓRIO DO CLIENTE\n\n";

    texto += "Nome: " + cliente.nome + "\n";
    texto += "Telefone: " + cliente.telefone + "\n";
    texto += "E-mail: " + cliente.email + "\n";

    texto += "\nFALECIDOS\n";

    for (let f of falecidos) {
        if (f.cliente == id) {
            texto += f.nome + " | " + f.falecimento + "\n";
        }
    }

    texto += "\nATENDIMENTOS\n";

    for (let a of atendimentos) {
        if (a.cliente == id) {
            texto += a.servico + " | " + a.data + " | " + a.status + "\n";
        }
    }

    alert(texto);
}



if (pegar("formCliente")) {
    pegar("formCliente").addEventListener("submit", function(event) {
        event.preventDefault();

        enviar("clientes", {
            nome: pegar("nomeCliente").value,
            telefone: pegar("telefoneCliente").value,
            email: pegar("emailCliente").value
        });
    });

    pegar("pesquisaCliente").addEventListener("input", mostrar);
}


if (pegar("formFalecido")) {
    pegar("formFalecido").addEventListener("submit", function(event) {
        event.preventDefault();

        enviar("falecidos", {
            nome: pegar("nomeFalecido").value,
            nascimento: pegar("nascimentoFalecido").value,
            falecimento: pegar("falecimentoFalecido").value,
            cliente: pegar("clienteResponsavel").value,
            status: pegar("statusFalecido").value
        });
    });
}


if (pegar("formAtendimento")) {
    pegar("clienteAtendimento").addEventListener("change", atualizarOpcoes);

    pegar("formAtendimento").addEventListener("submit", function(event) {
        event.preventDefault();

        enviar("atendimentos", {
            cliente: pegar("clienteAtendimento").value,
            falecido: pegar("falecidoAtendimento").value,
            servico: pegar("servico").value,
            data: pegar("dataAtendimento").value,
            hora: pegar("horaAtendimento").value,
            status: pegar("statusAtendimento").value,
            observacao: pegar("observacao").value
        });
    });
}

carregar();
