// Sistema de Login com Local Storage

// Função para fazer login ou cadastro
function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mensagem = document.getElementById('mensagem');

    // Validar campos
    if (!username || !password) {
        mensagem.textContent = "Por favor, preencha todos os campos!";
        mensagem.style.color = "red";
        return;
    }

    // Buscar usuários salvos no Local Storage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    // Verificar se usuário já existe
    if (usuarios[username]) {
        // Tentativa de login
        if (usuarios[username] === password) {
            loginSucesso(username);
        } else {
            mensagem.textContent = "Senha incorreta!";
            mensagem.style.color = "red";
        }
    } else {
        // Cadastrar novo usuário
        usuarios[username] = password;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mensagem.textContent = "Conta criada com sucesso!";
        mensagem.style.color = "green";
        loginSucesso(username);
    }
}

// Função quando o login é bem-sucedido
function loginSucesso(username) {
    // Salvar usuário atual
    localStorage.setItem('usuarioAtual', username);
    
    // Mostrar tela do chat
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    document.getElementById('usuario-logado').textContent = username;
    
    // Carregar mensagens
    carregarMensagens();
}

// Função para sair
function sair() {
    localStorage.removeItem('usuarioAtual');
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('mensagem').textContent = '';
}

// Verificar se já está logado ao carregar a página
window.onload = function() {
    const usuarioAtual = localStorage.getItem('usuarioAtual');
    if (usuarioAtual) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        document.getElementById('usuario-logado').textContent = usuarioAtual;
        carregarMensagens();
    }
}