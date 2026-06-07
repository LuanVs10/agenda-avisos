# Agenda de Avisos

Sistema web para registrar e organizar avisos importantes que precisam ser comunicados aos funcionários ou membros de uma organização, com datas e destinatários.

---

## Acesso online

**Sistema:** [agenda-avisos.onrender.com](https://agenda-avisos.onrender.com)

> O sistema está hospedado no Render (plano gratuito). Na primeira abertura pode demorar até 50 segundos para carregar.

---

## Tecnologias utilizadas

- **Node.js** — runtime do backend
- **Express** — framework para criação da API REST
- **MySQL** — banco de dados relacional
- **Clever Cloud** — hospedagem do banco de dados
- **Render** — hospedagem do backend
- **HTML, CSS e JavaScript** — frontend

---

## Estrutura do projeto

```
agenda-avisos/
├── public/
│   ├── index.html        # Página inicial
│   ├── dashboard.html    # Painel principal
│   ├── usuarios.html     # CRUD de usuários
│   ├── pessoas.html      # CRUD de pessoas
│   ├── avisos.html       # CRUD de avisos
│   ├── tipos-aviso.html  # CRUD de tipos de aviso
│   ├── style.css         # Estilos globais
│   ├── script.js         # JavaScript do cliente
│   └── img/              # Imagens
├── server.js             # Servidor Express + rotas da API
├── db.js                 # Conexão com o banco de dados
├── .env                  # Variáveis de ambiente (não versionado)
└── package.json          # Dependências do projeto
```

---

## Funcionalidades

- Cadastro e login de usuários com validação
- CRUD completo de usuários
- CRUD completo de pessoas (destinatários)
- CRUD completo de tipos de aviso
- CRUD completo de avisos com destinatário e tipo
- Interface responsiva com menu lateral

---

## Banco de dados

Banco MySQL hospedado no **Clever Cloud**, com as seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `seguranca_tbUsuarios` | Usuários do sistema |
| `cadastro_tbPessoas` | Pessoas que recebem avisos |
| `tbAvisos` | Avisos cadastrados |
| `dominio_tbAvisoTipo` | Tipos de aviso |
| `dominio_tbPessoaTipo` | Tipos de pessoa |

---

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Autenticação do usuário |
| POST | `/cadastrar` | Cadastro de usuário |
| GET | `/usuarios` | Listar usuários |
| PUT | `/usuarios/:id` | Editar usuário |
| DELETE | `/usuarios/:id` | Excluir usuário |
| GET | `/pessoas` | Listar pessoas |
| POST | `/pessoas` | Cadastrar pessoa |
| PUT | `/pessoas/:id` | Editar pessoa |
| DELETE | `/pessoas/:id` | Excluir pessoa |
| GET | `/avisos` | Listar avisos |
| POST | `/avisos` | Cadastrar aviso |
| PUT | `/avisos/:id` | Editar aviso |
| DELETE | `/avisos/:id` | Excluir aviso |
| GET | `/tipos-aviso` | Listar tipos de aviso |
| POST | `/tipos-aviso` | Cadastrar tipo |
| PUT | `/tipos-aviso/:id` | Editar tipo |
| DELETE | `/tipos-aviso/:id` | Excluir tipo |

---

## 👨‍💻 Desenvolvedor

**Luan Victor Souza Alves** — Projeto acadêmico · 2026
