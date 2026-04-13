function abrirModal(tipo) {
  fecharModais();
  if (tipo === 'login') {
    document.getElementById('overlayLogin').classList.add('active');
  } else {
    document.getElementById('overlayCadastro').classList.add('active');
  }
}

function fecharModais() {
  document.getElementById('overlayLogin').classList.remove('active');
  document.getElementById('overlayCadastro').classList.remove('active');
  document.getElementById('erroLogin').textContent = '';
  document.getElementById('erroCadastro').textContent = '';
  document.getElementById('loginUsuario').value = '';
  document.getElementById('loginSenha').value = '';
  document.getElementById('cadastroNome').value = '';
  document.getElementById('cadastroLogin').value = '';
  document.getElementById('cadastroSenha').value = '';
}

function verSenha(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function entrar() {
  const login = document.getElementById('loginUsuario').value.trim();
  const senha = document.getElementById('loginSenha').value.trim();

  if (!login || !senha) {
    document.getElementById('erroLogin').textContent = 'Preencha todos os campos!';
    return;
  }

  const resposta = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    document.getElementById('erroLogin').textContent = dados.erro;
  } else {
    window.location.href = 'dashboard.html';
  }
}

async function cadastrar() {
  const nome = document.getElementById('cadastroNome').value.trim();
  const login = document.getElementById('cadastroLogin').value.trim();
  const senha = document.getElementById('cadastroSenha').value.trim();

  if (!nome || !login || !senha) {
    document.getElementById('erroCadastro').textContent = 'Preencha todos os campos!';
    return;
  }

  const resposta = await fetch('/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, login, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    document.getElementById('erroCadastro').textContent = dados.erro;
  } else {
    fecharModais();
    abrirModal('login');
    alert('Cadastro realizado! Faça login agora.');
  }
}

// Fechar ao clicar fora
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('overlay')) fecharModais();
});