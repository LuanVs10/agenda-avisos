const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Páginas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/usuarios.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'usuarios.html')));
app.get('/pessoas.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pessoas.html')));
app.get('/tipos-aviso.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tipos-aviso.html')));
app.get('/avisos.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'avisos.html')));

// Testar banco
app.get('/testar-banco', (req, res) => {
  connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao conectar no banco' });
    res.json({ mensagem: 'Banco conectado com sucesso! ✅', resultado: results[0].resultado });
  });
});

// ==================== USUÁRIOS ====================
app.post('/cadastrar', (req, res) => {
  const { nome, login, senha } = req.body;
  if (!nome || !login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  connection.query('INSERT INTO seguranca_tbUsuarios (nome, login, senha) VALUES (?, ?, ?)', [nome, login, senha], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Login já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário!' });
    }
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  connection.query('SELECT * FROM seguranca_tbUsuarios WHERE login = ? AND senha = ?', [login, senha], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao realizar login!' });
    if (results.length === 0) return res.status(401).json({ erro: 'Usuário ou senha incorretos!' });
    res.json({ mensagem: 'Login realizado com sucesso!', usuario: results[0].nome });
  });
});

app.get('/usuarios', (req, res) => {
  connection.query('SELECT usuario_id, nome, login FROM seguranca_tbUsuarios', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários!' });
    res.json(results);
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { nome, login, senha } = req.body;
  const { id } = req.params;
  if (!nome || !login) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  const sql = senha
    ? 'UPDATE seguranca_tbUsuarios SET nome=?, login=?, senha=? WHERE usuario_id=?'
    : 'UPDATE seguranca_tbUsuarios SET nome=?, login=? WHERE usuario_id=?';
  const params = senha ? [nome, login, senha, id] : [nome, login, id];
  connection.query(sql, params, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Login já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao editar usuário!' });
    }
    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  connection.query('DELETE FROM seguranca_tbUsuarios WHERE usuario_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir usuário!' });
    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  });
});

// ==================== TIPO DE PESSOA ====================
app.get('/tipos-pessoa', (req, res) => {
  connection.query('SELECT * FROM dominio_tbPessoaTipo', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar tipos!' });
    res.json(results);
  });
});

// ==================== PESSOAS ====================
app.get('/pessoas', (req, res) => {
  connection.query(`
    SELECT p.*, t.descricao as tipo_descricao
    FROM cadastro_tbPessoas p
    LEFT JOIN dominio_tbPessoaTipo t ON p.pessoa_tipo_id = t.pessoa_tipo_id
  `, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar pessoas!' });
    res.json(results);
  });
});

app.post('/pessoas', (req, res) => {
  const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
  if (!nome || !cpf) return res.status(400).json({ erro: 'Preencha os campos obrigatórios!' });
  connection.query(
    'INSERT INTO cadastro_tbPessoas (nome, cpf, nascimento, telefone, pessoa_tipo_id) VALUES (?, ?, ?, ?, ?)',
    [nome, cpf, nascimento || null, telefone || null, pessoa_tipo_id || null],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'CPF já cadastrado!' });
        return res.status(500).json({ erro: 'Erro ao cadastrar pessoa!' });
      }
      res.json({ mensagem: 'Pessoa cadastrada com sucesso!' });
    }
  );
});

app.put('/pessoas/:id', (req, res) => {
  const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
  if (!nome || !cpf) return res.status(400).json({ erro: 'Preencha os campos obrigatórios!' });
  connection.query(
    'UPDATE cadastro_tbPessoas SET nome=?, cpf=?, nascimento=?, telefone=?, pessoa_tipo_id=? WHERE pessoa_id=?',
    [nome, cpf, nascimento || null, telefone || null, pessoa_tipo_id || null, req.params.id],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'CPF já cadastrado!' });
        return res.status(500).json({ erro: 'Erro ao editar pessoa!' });
      }
      res.json({ mensagem: 'Pessoa atualizada com sucesso!' });
    }
  );
});

app.delete('/pessoas/:id', (req, res) => {
  connection.query('DELETE FROM cadastro_tbPessoas WHERE pessoa_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir pessoa!' });
    res.json({ mensagem: 'Pessoa excluída com sucesso!' });
  });
});

// ==================== TIPOS DE AVISO ====================
app.get('/tipos-aviso', (req, res) => {
  connection.query('SELECT * FROM dominio_tbAvisoTipo', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar tipos!' });
    res.json(results);
  });
});

app.post('/tipos-aviso', (req, res) => {
  const { descricao } = req.body;
  if (!descricao) return res.status(400).json({ erro: 'Preencha a descrição!' });
  connection.query('INSERT INTO dominio_tbAvisoTipo (descricao) VALUES (?)', [descricao], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Tipo já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao cadastrar tipo!' });
    }
    res.json({ mensagem: 'Tipo cadastrado com sucesso!' });
  });
});

app.put('/tipos-aviso/:id', (req, res) => {
  const { descricao } = req.body;
  if (!descricao) return res.status(400).json({ erro: 'Preencha a descrição!' });
  connection.query('UPDATE dominio_tbAvisoTipo SET descricao=? WHERE aviso_tipo_id=?', [descricao, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao editar tipo!' });
    res.json({ mensagem: 'Tipo atualizado com sucesso!' });
  });
});

app.delete('/tipos-aviso/:id', (req, res) => {
  connection.query('DELETE FROM dominio_tbAvisoTipo WHERE aviso_tipo_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir tipo!' });
    res.json({ mensagem: 'Tipo excluído com sucesso!' });
  });
});

// ==================== AVISOS ====================
app.get('/avisos', (req, res) => {
  connection.query(`
    SELECT a.*, p.nome as pessoa_nome, t.descricao as tipo_descricao
    FROM tbAvisos a
    LEFT JOIN cadastro_tbPessoas p ON a.pessoa_id = p.pessoa_id
    LEFT JOIN dominio_tbAvisoTipo t ON a.aviso_tipo_id = t.aviso_tipo_id
  `, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar avisos!' });
    res.json(results);
  });
});

app.post('/avisos', (req, res) => {
  const { aviso, pessoa_id, aviso_tipo_id, observacao } = req.body;
  if (!aviso) return res.status(400).json({ erro: 'Preencha o aviso!' });
  connection.query(
    'INSERT INTO tbAvisos (aviso, pessoa_id, aviso_tipo_id, observacao, atualizado_em) VALUES (?, ?, ?, ?, NOW())',
    [aviso, pessoa_id || null, aviso_tipo_id || null, observacao || null],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar aviso!' });
      res.json({ mensagem: 'Aviso cadastrado com sucesso!' });
    }
  );
});

app.put('/avisos/:id', (req, res) => {
  const { aviso, pessoa_id, aviso_tipo_id, observacao } = req.body;
  if (!aviso) return res.status(400).json({ erro: 'Preencha o aviso!' });
  connection.query(
    'UPDATE tbAvisos SET aviso=?, pessoa_id=?, aviso_tipo_id=?, observacao=?, atualizado_em=NOW() WHERE aviso_id=?',
    [aviso, pessoa_id || null, aviso_tipo_id || null, observacao || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Erro ao editar aviso!' });
      res.json({ mensagem: 'Aviso atualizado com sucesso!' });
    }
  );
});

app.delete('/avisos/:id', (req, res) => {
  connection.query('DELETE FROM tbAvisos WHERE aviso_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir aviso!' });
    res.json({ mensagem: 'Aviso excluído com sucesso!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} ✅`));