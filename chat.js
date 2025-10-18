// Sistema de Chat em Tempo Real com Firebase - VERSÃO SIMPLIFICADA
let usuarioAtual = '';

function entrarNoChat() {
    const username = document.getElementById('username').value.trim();
    console.log('Tentando entrar com usuário:', username); // Debug
    
    if (!username) {
        alert("⚠️ Digite seu nome para entrar no chat!");
        return;
    }

    usuarioAtual = username;
    
    // Mostrar tela do chat
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    document.getElementById('usuario-logado').textContent = username;
    
    console.log('Usuário logado:', usuarioAtual); // Debug
    
    // Carregar mensagens
    carregarMensagens();
}

function enviarMensagem() {
    const input = document.getElementById('mensagem-input');
    const texto = input.value.trim();

    if (!texto) {
        alert("Digite uma mensagem!");
        return;
    }

    if (!usuarioAtual) {
        alert("Você precisa estar logado!");
        return;
    }

    console.log('Enviando mensagem:', texto); // Debug

    // Salvar mensagem no Firebase
    db.collection('mensagens').add({
        usuario: usuarioAtual,
        texto: texto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Mensagem enviada com sucesso!');
        input.value = '';
    }).catch(error => {
        console.error("Erro ao enviar mensagem:", error);
        alert("Erro ao enviar mensagem: " + error.message);
    });
}

function carregarMensagens() {
    console.log('Carregando mensagens...'); // Debug
    
    // Ouvir mensagens em tempo real
    db.collection('mensagens')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            console.log('Mensagens recebidas:', snapshot.size);
            
            const container = document.getElementById('mensagens');
            container.innerHTML = '';
            
            snapshot.forEach(doc => {
                const msg = doc.data();
                const div = document.createElement('div');
                div.className = 'mensagem-item';
                
                // Formatar hora
                let hora = 'Agora';
                if (msg.timestamp) {
                    hora = msg.timestamp.toDate().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                
                div.innerHTML = `
                    <div class="mensagem-header">
                        <strong>${msg.usuario}</strong>
                        <small>${hora}</small>
                    </div>
                    <div class="mensagem-texto">${msg.texto}</div>
                `;
                
                // Destacar suas próprias mensagens
                if (msg.usuario === usuarioAtual) {
                    div.style.background = '#e3f2fd';
                    div.style.borderLeft = '4px solid #2196f3';
                }
                
                container.appendChild(div);
            });
            
            // Rolagem automática
            container.scrollTop = container.scrollHeight;
        }, error => {
            console.error("Erro ao carregar mensagens:", error);
        });
}

function sair() {
    if (confirm("Sair do chat?")) {
        usuarioAtual = '';
        document.getElementById('chat-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('username').value = '';
    }
}

// Enviar com Enter
document.getElementById('mensagem-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensagem();
    }
});
