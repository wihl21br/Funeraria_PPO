import { db } from "./db";
import principal from "./index.html"
const srv = Bun.serve({
    port: 3000,
    routes: {
        "/": principal,

        "/api/:tipo": {
            GET: (req) => {
                const tipo = req.params.tipo;
                const dados = db.query(`SELECT * FROM ${tipo}`).all();
                return Response.json(dados);
            },
            POST: async (req) => {
                const tipo = req.params.tipo;
                const d: any = await req.json();
                if (tipo === "clientes") {
                    db.query("INSERT INTO clientes (nome, telefone, email) VALUES ($nome, $telefone, $email)").run({
                        $nome: d.nome, $telefone: d.telefone, $email: d.email
                    });
                } else if (tipo === "falecidos") {
                    db.query("INSERT INTO falecidos (nome, nascimento, falecimento, cliente, status) VALUES ($nome, $nascimento, $falecimento, $cliente, $status)").run({
                        $nome: d.nome, $nascimento: d.nascimento, $falecimento: d.falecimento, $cliente: d.cliente, $status: d.status
                    });
                } else if (tipo === "atendimentos") {
                    db.query("INSERT INTO atendimentos (cliente, falecido, servico, data, hora, status, observacao) VALUES ($cliente, $falecido, $servico, $data, $hora, $status, $observacao)").run({
                        $cliente: d.cliente, $falecido: d.falecido, $servico: d.servico, $data: d.data, $hora: d.hora, $status: d.status, $observacao: d.observacao
                    });
                }
                return Response.json({ mensagem: "Cadastrado com sucesso!" });
            }
        },
        "/api/:tipo/:id": {
            PUT: async (req) => {
                const tipo = req.params.tipo;
                const id = req.params.id;
                const d: any = await req.json();

                if (tipo === "clientes") {
                    db.query("UPDATE clientes SET nome = $nome, telefone = $telefone, email = $email WHERE id = $id").run({
                        $nome: d.nome, $telefone: d.telefone, $email: d.email, $id: id
                    });
                } else if (tipo === "falecidos") {
                    db.query("UPDATE falecidos SET nome = $nome, nascimento = $nascimento, falecimento = $falecimento, cliente = $cliente, status = $status WHERE id = $id").run({
                        $nome: d.nome, $nascimento: d.nascimento, $falecimento: d.falecimento, $cliente: d.cliente, $status: d.status, $id: id
                    });
                } else if (tipo === "atendimentos") {
                    db.query("UPDATE atendimentos SET cliente = $cliente, falecido = $falecido, servico = $servico, data = $data, hora = $hora, status = $status, observacao = $observacao WHERE id = $id").run({
                        $cliente: d.cliente, $falecido: d.falecido, $servico: d.servico, $data: d.data, $hora: d.hora, $status: d.status, $observacao: d.observacao, $id: id
                    });
                }

                return Response.json({ mensagem: "Atualizado com sucesso!" });
            },
            DELETE: (req) => {
                const tipo = req.params.tipo;
                const id = req.params.id;

                db.query(`DELETE FROM ${tipo} WHERE id = $id`).run({ $id: id });
                return Response.json({ mensagem: "Excluído com sucesso!" });
            }
        }
    },
   async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        const filePath = path === "/" ? "/index.html" : path;
        const file = Bun.file("." + filePath);
        if (await file.exists()) {
            return new Response(file);
        }
        return new Response("Não encontrado", { status: 404 });
    }
});

console.log(`Servidor rodando em ${srv.url}`);