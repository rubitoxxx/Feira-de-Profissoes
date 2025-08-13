document.addEventListener('DOMContentLoaded', () => {
    // Certifique-se de que _supabase está disponível globalmente antes de usá-lo
    if (typeof window._supabase === 'undefined') {
        console.error('Supabase client not initialized. Make sure supabaseClient.js is loaded before login.js');
        return;
    }

    // Alterado para 'ra_cpf' para corresponder ao novo input no index.html
    const raCpfInput = document.getElementById('ra_cpf');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const mensagemErro = document.getElementById('mensagemErro');

    // Verificação para garantir que o botão de login foi encontrado no DOM
    if (!loginButton) {
        console.error('Botão de login não encontrado. Verifique o ID do botão.');
        return;
    }

    // Adicionando evento de clique ao botão de login
    loginButton.addEventListener('click', async () => {
        // Limpando qualquer mensagem de erro anterior
        mensagemErro.textContent = ''; 
        
        // Pegando os valores de RA/CPF/Email e senha
        const raCpf = raCpfInput.value;
        const password = passwordInput.value;

        // Verificando se os campos não estão vazios
        if (!raCpf || !password) {
            mensagemErro.textContent = 'Por favor, preencha o campo de RA/E-mail/CPF e a senha.';
            return;
        }

        // Tentando realizar o login com o Supabase
        const { data, error } = await window._supabase.auth.signInWithPassword({
            email: raCpf, // Usando o mesmo campo 'ra_cpf' como e-mail para o Supabase
            password: password,
        });

        // Verificando se ocorreu algum erro
        if (error) {
            console.error('Erro no login:', error.message);
            mensagemErro.textContent = 'Dados de acesso inválidos. Tente novamente.';
        } else {
            console.log('Login realizado com sucesso:', data.user);
            alert('Login realizado com sucesso! Redirecionando...');
            // Redirecionando o usuário para a página mural.html após login bem-sucedido
            window.location.href = 'mural.html'; 
        }
    });
});