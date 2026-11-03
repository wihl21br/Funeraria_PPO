import { Database } from "bun:sqlite";
export const db = new Database("funeraria.db");
db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS falecidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        nascimento TEXT NOT NULL,
        falecimento TEXT NOT NULL,
        cliente INTEGER NOT NULL,
        status TEXT NOT NULL
    );
`);

db.run(`
    CREATE TABLE IF NOT EXISTS atendimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente INTEGER NOT NULL,
        falecido INTEGER NOT NULL,
        servico TEXT NOT NULL,
        data TEXT NOT NULL,
        hora TEXT NOT NULL,
        status TEXT NOT NULL,
        observacao TEXT
    );
`);