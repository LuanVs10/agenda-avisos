function abrirModal() {
  document.getElementById('overlay').classList.add('active');
}

function fecharModal() {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('erro').style.display = 'none';
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
}

function verSenha() {
  const input = document.getElementById('senha');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function fazerLogin() {
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!usuario || !senha) {
    document.getElementById('erro').style.display = 'block';
    return;
  }

  // Por enquanto aceita qualquer e-mail e senha
  // Futuramente: validar com o banco de dados
  window.location.href = 'dashboard.html';
}

document.getElementById('overlay').addEventListener('click', function(e) {
  if (e.target === this) fecharModal();
});