# 🌐 Mural Rubix — Rede Social com Gamificação e Supabase

[![Badge - HTML](https://img.shields.io/badge/HTML5-orange?style=for-the-badge&logo=html5)]()
[![Badge - CSS](https://img.shields.io/badge/CSS3-blue?style=for-the-badge&logo=css3)]()
[![Badge - JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript)]()
[![Badge - Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)]()
[![Badge - Status](https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge)]()

> **Adaptação para a Feira de Profissões do ISEPE Rondon**: O Mural Rubix, inicialmente desenvolvido como projeto acadêmico, foi adaptado para a feira, permitindo a interação entre estudantes e profissionais através de um sistema gamificado de moedas virtuais e integração full-stack com Supabase.

https://rubitoxxx.github.io/Feira-de-Profissoes/
---

## 📌 Visão Geral

O **Mural Rubix** é uma plataforma de rede social web responsiva que foi adaptada para a **Feira de Profissões do ISEPE Rondon**, proporcionando aos estudantes a oportunidade de interagir, aprender sobre diferentes profissões e participar de atividades gamificadas. A plataforma permite aos usuários criar postagens, comentar, gerenciar seus perfis e acumular **RubixCoins 🪙** como recompensa por sua participação.

Desenvolvido com **JavaScript puro**, o sistema é integrado ao **Supabase** (PostgreSQL + Auth + Storage) para autenticação e persistência de dados, garantindo a segurança e a escalabilidade da aplicação. O projeto também inclui um aplicativo Android (Kotlin) para fornecer acesso otimizado aos participantes da feira por meio de dispositivos móveis.

---

## 🚀 Acesse o Projeto

- 🌍 Website: [https://rubitoxxx.github.io/rubix/](https://rubitoxxx.github.io/rubix/)
- 📱 APK Android: *Anexado no portfólio*
- 📹 Demonstração em vídeo: *Anexado no portfólio*

---

## 🛠️ Tecnologias Utilizadas

### 🖥️ Frontend Web

- HTML5, CSS3, JavaScript ES6+
- Sem frameworks JS (Vanilla JS)
- Supabase JS SDK

### 🧩 Backend (BaaS - Supabase)

- **Auth**: Gerenciamento completo de usuários
- **Database**: PostgreSQL para dados de perfis, posts, moedas, comentários
- **Storage**: Armazenamento de imagens

### 📱 Aplicativo Android

- Linguagem: Kotlin
- IDE: Android Studio
- Componente: `WebView` (espelha o site)

---

## 🧠 Funcionalidades

### 🔐 Autenticação
- Login, cadastro, logout
- Sistema seguro com Supabase Auth

### 🧍 Perfis
- Visualização e edição de dados
- Upload de foto de perfil
- Recompensa com RubixCoins por ações

### 📝 Publicações e Comentários
- Criar e apagar posts com texto/imagem
- Comentar em posts e apagar comentários próprios

### 📰 Feed Global
- Posts exibidos em ordem cronológica (mais recentes primeiro)

### 🕹️ Gamificação com RubixCoins
- Ganho e gasto de moedas por ações no sistema
- Custos e recompensas implementados para engajamento

### 🏆 Ranking
- Exibição do Top 3 usuários com mais moedas
- Página dedicada com ranking completo

---

## 📂 Estrutura do Projeto

rubix/
├── index.html # Tela de login
├── mural.html # Feed principal
├── perfil.html # Perfil do usuário
├── ranking.html # Ranking de usuários
├── style.css # Estilos personalizados
├── js/
│ ├── supabaseClient.js # Conexão e config Supabase
│ ├── utils.js # Funções auxiliares
│ ├── login.js # Lógica de login
│ └── mural.js # Carregamento do feed

---

## 📱 Android (WebView Wrapper)

- Estrutura padrão do Android Studio
- `MainActivity.kt`: gerencia o WebView
- Acesso ao site sem necessidade de navegador externo
- Interface mobile herdada do CSS responsivo

---

## 💡 Desafios Superados

- Gerenciamento de estado sem frameworks (com JS assíncrono e Supabase como “source of truth”)
- Prevenção de saldos negativos com lógica segura de transações
- Feedback visual durante operações assíncronas
- Modularização de JS para manutenibilidade

---

## 📈 Resultados Alcançados

- Rede social funcional com gamificação
- Integração full-stack com Supabase
- Responsividade e versão Android
- Estrutura modular e organizada

---

## 🔮 Futuras Melhorias

- App Android nativo com Retrofit e acesso a câmera
- Feed e notificações em tempo real com Supabase Realtime
- Novos usos para RubixCoins (login diário, likes, customização)
- Testes automatizados com Jest/Vitest

---

## 🙋‍♂️ Autor

**Rubens Gabriel e Silva Santos**  
📫 [rubensgabrielesilvasantos@gmail.com](mailto:rubensgabrielesilvasantos@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/rubens-gabriel-221679263)  
💻 [GitHub](https://github.com/rubitoxxx)

---

> **Adaptação para a Feira de Profissões do ISEPE Rondon**: Este projeto foi transformado para promover a interação entre estudantes e profissionais, com a utilização de gamificação e incentivo à participação ativa. 🚀
