let clientes = [];
let falecidos = [];
let atendimentos = [];
let editando = 0;

function pegar(id) {
    return document.getElementById(id);
}
function buscarNome(lista, id) {
    for (let item of lista) {
        if (item.id == id) return item.nome;
    }
    return "Não encontrado";
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

function atualizarOpcoes() {
    let select = pegar("clienteResponsavel") || pegar("clienteAtendimento");
    if (select) {
        let selecionado = select.value;
        select.innerHTML = '<option value="">Selecione um cliente</option>';
        for (let cliente of clientes) {
            select.innerHTML += `<option value="${cliente.id}">${proteger(cliente.nome)}</option>`;
        }
        select.value = selecionado;
    }
    let falecidoSelect = pegar("falecidoAtendimento");
    if (falecidoSelect) {
        let selecionado = falecidoSelect.value;
        falecidoSelect.innerHTML = '<option value="">Selecione um falecido</option>';
        for (let falecido of falecidos) {
            if (falecido.cliente == pegar("clienteAtendimento").value) {
                falecidoSelect.innerHTML += `<option value="${falecido.id}">${proteger(falecido.nome)}</option>`;
            }
        }
        falecidoSelect.value = selecionado;
    }
}

function botoes(tipo, id) {
    return `<button onclick="editar('${tipo}', ${id})">Editar</button>
            <button class="excluir" onclick="excluir('${tipo}', ${id})">Excluir</button>`;
}
function mostrar() {
    if (pegar("listaClientes")) {
        let pesquisa = pegar("pesquisaCliente").value.toLowerCase();
        pegar("listaClientes").innerHTML = "";
        for (let c of clientes) {
            if (c.nome.toLowerCase().includes(pesquisa)) {
                pegar("listaClientes").innerHTML += `<div class="registro">
                    <h3>${proteger(c.nome)}</h3><p>Telefone: ${proteger(c.telefone)}</p>
                    <p>E-mail: ${proteger(c.email)}</p>
                    <button class="relatorio" onclick="relatorio(${c.id})">Relatório</button>
                    ${botoes("clientes", c.id)}</div>`;
            }
        }
    }
    if (pegar("listaFalecidos")) {
        pegar("listaFalecidos").innerHTML = "";
        for (let f of falecidos) {
            pegar("listaFalecidos").innerHTML += `<div class="registro">
                <h3>${proteger(f.nome)}</h3><p>Nascimento: ${proteger(f.nascimento)}</p>
                <p>Falecimento: ${proteger(f.falecimento)}</p>
                <p>Cliente: ${proteger(buscarNome(clientes, f.cliente))}</p>
                <p>Status: ${proteger(f.status)}</p>${botoes("falecidos", f.id)}</div>`;
        }
    }
    if (pegar("listaAtendimentos")) {
        pegar("listaAtendimentos").innerHTML = "";
        for (let a of atendimentos) {
            pegar("listaAtendimentos").innerHTML += `<div class="registro">
                <h3>${proteger(a.servico)}</h3>
                <p>Cliente: ${proteger(buscarNome(clientes, a.cliente))}</p>
                <p>Falecido: ${proteger(buscarNome(falecidos, a.falecido))}</p>
                <p>Data: ${proteger(a.data)} - ${proteger(a.hora)}</p>
                <p>Status: ${proteger(a.status)}</p>
                <p>Observação: ${proteger(a.observacao)}</p>
                ${botoes("atendimentos", a.id)}</div>`;
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
        await carregar();
    }
}

async function excluir(tipo, id) {
    if (!confirm("Deseja excluir este registro?")) return;
    let resposta = await fetch("/api/" + tipo + "/" + id, { method: "DELETE" });
    let resultado = await resposta.json();
    alert(resultado.mensagem || resultado.erro);
    await carregar();
}

function editar(tipo, id) {
    let lista = tipo == "clientes" ? clientes : tipo == "falecidos" ? falecidos : atendimentos;
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

function relatorio(id) {
    let cliente = clientes.find(c => c.id == id);
    if (!cliente) return;
    let texto = "RELATÓRIO DO CLIENTE\n\n";
    texto += "Nome: " + cliente.nome + "\nTelefone: " + cliente.telefone + "\nE-mail: " + cliente.email + "\n";
    texto += "\nFALECIDOS\n";
    for (let f of falecidos) {
        if (f.cliente == id) texto += f.nome + " | " + f.nascimento + " | " + f.falecimento + " | " + f.status + "\n";
    }
    texto += "\nATENDIMENTOS\n";
    for (let a of atendimentos) {
        if (a.cliente == id) texto += a.servico + " | " + buscarNome(falecidos, a.falecido) + " | " + a.data + " " + a.hora + " | " + a.status + " | " + a.observacao + "\n";
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