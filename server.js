const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/usuarios.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'usuarios.html'));
});

app.get('/testar-banco', (req, res) => {
  connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao conectar no banco' });
    res.json({ mensagem: 'Banco conectado com sucesso! ✅', resultado: results[0].resultado });
  });
});

app.post('/cadastrar', (req, res) => {
  const { nome, login, senha } = req.body;
  if (!nome || !login || !senha) return res.status(400).json({ erro: 'Preencha todos os campos!' });
  const sql = 'INSERT INTO seguranca_tbUsuarios (nome, login, senha) VALUES (?, ?, ?)';
  connection.query(sql, [nome, login, senha], (err) => {
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
  const sql = 'SELECT * FROM seguranca_tbUsuarios WHERE login = ? AND senha = ?';
  connection.query(sql, [login, senha], (err, results) => {
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
  let sql, params;
  if (senha) {
    sql = 'UPDATE seguranca_tbUsuarios SET nome = ?, login = ?, senha = ? WHERE usuario_id = ?';
    params = [nome, login, senha, id];
  } else {
    sql = 'UPDATE seguranca_tbUsuarios SET nome = ?, login = ? WHERE usuario_id = ?';
    params = [nome, login, id];
  }
  connection.query(sql, params, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Login já cadastrado!' });
      return res.status(500).json({ erro: 'Erro ao editar usuário!' });
    }
    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM seguranca_tbUsuarios WHERE usuario_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir usuário!' });
    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} ✅`);
});