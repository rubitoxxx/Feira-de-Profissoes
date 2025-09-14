document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const loginButton = document.getElementById('login-button');
    const mensagemErro = document.getElementById('mensagemErro');

    if (!loginButton) {
        console.error('Botão de login não encontrado.');
        return;
    }

    // Máscara de telefone
    function aplicarMascaraTelefone(event) {
        let telefone = event.target.value.replace(/\D/g, '');
        if (telefone.length > 11) telefone = telefone.substring(0, 11);

        if (telefone.length <= 2) {
            telefone = telefone.replace(/(\d{2})(\d{0,})/, '($1) $2');
        } else if (telefone.length <= 6) {
            telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,})/, '($1) $2-$3');
        } else {
            telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        event.target.value = telefone;
    }
    telefoneInput.addEventListener('input', aplicarMascaraTelefone);

    // Evento de login
    loginButton.addEventListener('click', () => {
        mensagemErro.textContent = ''; 
        
        const nome = nomeInput.value.trim();
        const telefone = telefoneInput.value.trim();

        if (!nome || !telefone) {
            mensagemErro.textContent = 'Por favor, preencha nome e telefone.';
            return;
        }

        // Cria usuário
        const usuario = {
            username: nome,
            telefone: telefone,
            avatarUrl: "https://img.freepik.com/vetores-premium/icone-de-perfil-de-avatar-padrao-imagem-de-usuario-de-midia-social-icone-de-avatar-cinza-silhueta-de-perfil-em-branco-ilustracao-vetorial_561158-3383.jpg"
        };

        // Salva no localStorage
        localStorage.setItem("perfil", JSON.stringify(usuario));

        // Registrar o acesso no localStorage
        const acessos = JSON.parse(localStorage.getItem("acessos")) || [];
        acessos.push({ nome: nome, telefone: telefone, data_acesso: new Date().toISOString() });

        // Salva os acessos no localStorage
        localStorage.setItem("acessos", JSON.stringify(acessos));

        alert('Login realizado com sucesso! Redirecionando...');
        window.location.href = 'mural.html'; 
    });
});
