let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let falecidos = JSON.parse(localStorage.getItem("falecidos")) || [];
let atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];

let idCliente = Number(localStorage.getItem("idCliente")) || 1;
let idFalecido = Number(localStorage.getItem("idFalecido")) || 1;
let idAtendimento = Number(localStorage.getItem("idAtendimento")) || 1;

function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("falecidos", JSON.stringify(falecidos));
  localStorage.setItem("atendimentos", JSON.stringify(atendimentos));
  localStorage.setItem("idCliente", idCliente);
  localStorage.setItem("idFalecido", idFalecido);
  localStorage.setItem("idAtendimento", idAtendimento);
}

if (document.getElementById("formCliente")) {
  document.getElementById("formCliente").addEventListener("submit", function (event) {
      event.preventDefault();
      let cliente = {
        id: idCliente,
        nome: document.getElementById("nomeCliente").value,
        telefone: document.getElementById("telefoneCliente").value,
        email: document.getElementById("emailCliente").value,
      };

      clientes.push(cliente);
      idCliente++;
      salvar();

      document.getElementById("formCliente").reset();
      mostrarClientes();
    });

  document.getElementById("pesquisaCliente").addEventListener("keyup", mostrarClientes);
  mostrarClientes();
}

function mostrarClientes() {
  if (!document.getElementById("listaClientes")) {
    return;
  }

  let lista = document.getElementById("listaClientes");
  let pesquisa = document.getElementById("pesquisaCliente").value.toLowerCase();

  lista.innerHTML = "";

  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].nome.toLowerCase().includes(pesquisa)) {
      lista.innerHTML += `
                <div class="registro">
                    <h3>${clientes[i].nome}</h3>
                    <p>Telefone: ${clientes[i].telefone}</p>
                    <p>E-mail: ${clientes[i].email}</p>
                    <button class="relatorio" onclick="relatorioCliente(${clientes[i].id})">
                        Relatório
                    </button>
                    <button class="excluir" onclick="excluirCliente(${clientes[i].id})">
                        Excluir
                    </button>

                </div>
            `;
    }
  }
}

function excluirCliente(id) {
  if (confirm("Deseja excluir este cliente?")) {
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].id == id) {
        clientes.splice(i, 1);

        break;
      }
    }
    salvar();
    mostrarClientes();
  }
}

if (document.getElementById("formFalecido")) {
  atualizarClientes();

  document.getElementById("formFalecido").addEventListener("submit", function (event) {
      event.preventDefault();
      let falecido = {
        id: idFalecido,
        nome: document.getElementById("nomeFalecido").value,
        nascimento: document.getElementById("nascimentoFalecido").value,
        falecimento: document.getElementById("falecimentoFalecido").value,
        cliente: document.getElementById("clienteResponsavel").value,
        status: document.getElementById("statusFalecido").value,
      };

      falecidos.push(falecido);
      idFalecido++;
      salvar();
      document.getElementById("formFalecido").reset();
      mostrarFalecidos();
    });
  mostrarFalecidos();
}


function atualizarClientes() {
  let select = document.getElementById("clienteResponsavel");

  if (!select) {
    select = document.getElementById("clienteAtendimento");
  }

  if (!select) {
    return;
  }

  select.innerHTML = '<option value="">Selecione um cliente</option>';

  for (let i = 0; i < clientes.length; i++) {
    select.innerHTML += `
      <option value="${clientes[i].id}">
        ${clientes[i].nome}
      </option>
    `;
  }
}


function mostrarFalecidos() {
  if (!document.getElementById("listaFalecidos")) {
    return;
  }

  let lista = document.getElementById("listaFalecidos");
  lista.innerHTML = "";
  for (let i = 0; i < falecidos.length; i++) {
    let nomeCliente = "";

    for (let j = 0; j < clientes.length; j++) {
      if (clientes[j].id == falecidos[i].cliente) {
        nomeCliente = clientes[j].nome;
      }
    }

    lista.innerHTML += `
            <div class="registro">
                <h3>${falecidos[i].nome}</h3>
                <p>Nascimento: ${falecidos[i].nascimento}</p>
                <p>Falecimento: ${falecidos[i].falecimento}</p>
                <p>Cliente: ${nomeCliente}</p>
                <p>Status: ${falecidos[i].status}</p>
                <button class="excluir" onclick="excluirFalecido(${falecidos[i].id})">
                    Excluir
                </button>

            </div>
        `;
  }
}

function excluirFalecido(id) {
  if (confirm("Deseja excluir este registro?")) {
    for (let i = 0; i < falecidos.length; i++) {
      if (falecidos[i].id == id) {
        falecidos.splice(i, 1);
        break;
      }
    }
    salvar();
    mostrarFalecidos();
  }
}

if (document.getElementById("formAtendimento")) {
  atualizarClientes();
  atualizarFalecidos();

  document.getElementById("formAtendimento").addEventListener("submit", function (event) {
      event.preventDefault();

      let atendimento = {
        id: idAtendimento,
        cliente: document.getElementById("clienteAtendimento").value,
        falecido: document.getElementById("falecidoAtendimento").value,
        servico: document.getElementById("servico").value,
        data: document.getElementById("dataAtendimento").value,
        hora: document.getElementById("horaAtendimento").value,
        status: document.getElementById("statusAtendimento").value,
        observacao: document.getElementById("observacao").value,
      };

      atendimentos.push(atendimento);
      idAtendimento++;
      salvar();

      document.getElementById("formAtendimento").reset();
      mostrarAtendimentos();
    });
  mostrarAtendimentos();
}

function atualizarFalecidos() {
  let select = document.getElementById("falecidoAtendimento");

  if (!select) {
    return;
  }

  select.innerHTML = '<option value="">Selecione um falecido</option>';
  for (let i = 0; i < falecidos.length; i++) {
    select.innerHTML += `
            <option value="${falecidos[i].id}">
                ${falecidos[i].nome}
            </option>
        `;
  }
}

function mostrarAtendimentos() {
  if (!document.getElementById("listaAtendimentos")) {
    return;
  }

  let lista = document.getElementById("listaAtendimentos");
  lista.innerHTML = "";

  for (let i = 0; i < atendimentos.length; i++) {
    let nomeCliente = "";
    let nomeFalecido = "";

    for (let j = 0; j < clientes.length; j++) {
      if (clientes[j].id == atendimentos[i].cliente) {
        nomeCliente = clientes[j].nome;
      }
    }

    for (let j = 0; j < falecidos.length; j++) {
      if (falecidos[j].id == atendimentos[i].falecido) {
        nomeFalecido = falecidos[j].nome;
      }
    }

    lista.innerHTML += `
            <div class="registro">

                <h3>${atendimentos[i].servico}</h3>

                <p>Cliente: ${nomeCliente}</p>

                <p>Falecido: ${nomeFalecido}</p>

                <p>Data: ${atendimentos[i].data}</p>

                <p>Horário: ${atendimentos[i].hora}</p>

                <p>Status: ${atendimentos[i].status}</p>

                <p>Observação: ${atendimentos[i].observacao}</p>

                <button class="excluir" onclick="excluirAtendimento(${atendimentos[i].id})">
                    Excluir
                </button>

            </div>
        `;
  }
}

function excluirAtendimento(id) {
  if (confirm("Deseja excluir este atendimento?")) {
    for (let i = 0; i < atendimentos.length; i++) {
      if (atendimentos[i].id == id) {
        atendimentos.splice(i, 1);

        break;
      }
    }

    salvar();

    mostrarAtendimentos();
  }
}

function relatorioCliente(id) {
  let cliente;

  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].id == id) {
      cliente = clientes[i];
    }
  }

  let texto = "";
  texto += "RELATÓRIO DO CLIENTE\n\n";
  texto += "Nome: " + cliente.nome + "\n";
  texto += "Telefone: " + cliente.telefone + "\n";
  texto += "E-mail: " + cliente.email + "\n\n";

  texto += "FALECIDO:\n";
  for (let i = 0; i < falecidos.length; i++) {
    if (falecidos[i].cliente == id) {
      texto += "- " + falecidos[i].nome + "\n";
    }
  }

  texto += "\nATENDIMENTOS:\n";

  for (let i = 0; i < atendimentos.length; i++) {
    if (atendimentos[i].cliente == id) {
      texto +=
        "- " + atendimentos[i].servico + " - " + atendimentos[i].status + "\n";
    }
  }

  alert(texto);
}
if (document.getElementById("totalClientes")) {
  document.getElementById("totalClientes").innerText = clientes.length;
  document.getElementById("totalFalecidos").innerText = falecidos.length;
  document.getElementById("totalAtendimentos").innerText = atendimentos.length;
}
