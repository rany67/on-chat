// Sistema de Mensagens do Chat

// Função para enviar mensagem
function enviarMensagem() {
    const input = document.getElementById('mensagem-input');
    const texto = input.value.trim();
    const usuario = localStorage.getItem('usuarioAtual');

    if (!texto) return;

    // Criar mensagem
    const mensagem = {
        usuario: usuario,
        texto: texto,
        timestamp: new Date().toLocaleTimeString()
    };

    // Salvar mensagem no Local Storage
    salvarMensagem(mensagem);

    // Limpar input e atualizar chat
    input.value = '';
    carregarMensagens();
}

// Função para salvar mensagem
function salvarMensagem(mensagem) {
    const mensagens = JSON.parse(localStorage.getItem('mensagens')) || [];
    mensagens.push(mensagem);
    localStorage.setItem('mensagens', JSON.stringify(mensagens));
}

// Função para carregar mensagens
function carregarMensagens() {
    const container = document.getElementById('mensagens');
    const mensagens = JSON.parse(localStorage.getItem('mensagens')) || [];
    
    container.innerHTML = '';
    
    mensagens.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'mensagem-item';
        div.innerHTML = `
            <strong>${msg.usuario}:</strong> ${msg.texto}
            <small style="color: #666; float: right;">${msg.timestamp}</small>
        `;
        container.appendChild(div);
    });
    
    // Rolagem automática para a última mensagem
    container.scrollTop = container.scrollHeight;
}

// Enviar mensagem com Enter
document.getElementById('mensagem-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensagem();
    }
});

// Carregar mensagens a cada 2 segundos (atualização automática)
setInterval(carregarMensagens, 2000);