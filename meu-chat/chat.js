// Sistema de Chat em Tempo Real com Firebase
let usuarioAtual = '';

function entrarNoChat() {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        document.getElementById('mensagem').textContent = "⚠️ Digite seu nome para entrar!";
        return;
    }

    if (username.length < 2) {
        document.getElementById('mensagem').textContent = "⚠️ Nome muito curto!";
        return;
    }

    usuarioAtual = username;
    
    // Mostrar tela do chat
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    document.getElementById('usuario-logado').textContent = username;
    
    // Carregar mensagens
    carregarMensagens();
    
    document.getElementById('mensagem').textContent = "✅ Conectado ao chat!";
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

    // Salvar mensagem no Firebase (todos veem)
    db.collection('mensagens').add({
        usuario: usuarioAtual,
        texto: texto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        data: new Date().toLocaleDateString('pt-BR')
    }).then(() => {
        // Mensagem enviada com sucesso
        input.value = '';
    }).catch(error => {
        console.error("Erro ao enviar mensagem:", error);
        alert("Erro ao enviar mensagem. Recarregue a página.");
    });
}

function carregarMensagens() {
    // Ouvir mensagens em tempo real - TODOS VEEM AS MESMAS MENSAGENS
    db.collection('mensagens')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
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
            
            // Rolagem automática para a última mensagem
            container.scrollTop = container.scrollHeight;
            
            // Atualizar contador de mensagens
            document.getElementById('contador-online').textContent = 
                Math.max(1, Math.floor(snapshot.size / 2));
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
        document.getElementById('mensagem').textContent = '';
    }
}

// Enviar mensagem com Enter
document.getElementById('mensagem-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensagem();
    }
});

// Focar no input quando entrar
function entrarNoChat() {
    // ... código anterior ...
    
    // Focar no input de mensagem
    setTimeout(() => {
        document.getElementById('mensagem-input').focus();
    }, 500);
}