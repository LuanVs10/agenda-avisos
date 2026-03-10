const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send("Projeto Agenda de Avisos - Luan Victor 🚀");
});

app.get('/testar-banco', (req, res) => {
  connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao conectar no banco' });
    }
    res.json({ mensagem: 'Banco conectado com sucesso! ✅', resultado: results[0].resultado });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} ✅`);
});