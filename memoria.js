// --- FUNÇÕES DE INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Lógica de inicialização sem Supabase
    currentUser = getUserFromLocalStorage(); // Obtemos o usuário do localStorage (perfil)
    carregarRankingMemoria();
});

const mainMenu = document.getElementById('main-menu-view');
const onlineLobby = document.getElementById('online-lobby-view');
const gameView = document.getElementById('game-view');
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const rankingBoard = document.getElementById('ranking-board');
const gameCodeDisplay = document.getElementById('game-code-display');
const movesDisplay = document.getElementById('game-moves');
const timerDisplay = document.getElementById('game-timer');

let currentUser = null; // Usuário logado
let gameMode = null; // 'computer' ou 'online'

const imagePaths = [
    'https://i.pinimg.com/736x/d6/a4/6a/d6a46a427e45922bfe5f0c0ea0165c31.jpg',
    'https://cdn.ome.lt/NFcSrPoyGkmpMAf20eH0CNaAf6M=/770x0/smart/uploads/conteudo/fotos/3606754-witcher_poster.jpg',
    'https://br.web.img3.acsta.net/c_310_420/pictures/22/09/23/20/14/0505071.jpg',
    'https://i.pinimg.com/736x/58/89/a9/5889a96bc7a1bf7b852f2453e2f1fd30.jpg',
    'https://aluluzinhaa.wordpress.com/wp-content/uploads/2021/11/arcane-netflix1.png',
    'https://i.pinimg.com/1200x/de/69/88/de6988b3335630e4771dc8a63b55c809.jpg',
    'https://i.pinimg.com/736x/7d/b3/75/7db375d9e6878fc66b96783f4ce5648e.jpg',
    'https://i.pinimg.com/1200x/74/35/c9/7435c903f81a91c8f949279f3e1025e0.jpg'
];

// --- Variáveis de Estado de Jogo ---
let currentMemoryGame = null; 
let localMemoryGameActive = false;
let localMemoryCards = []; 
let localFlippedCards = []; 
let localMatchedCards = []; 
let localMoves = 0;
let localTimer = 0;
let localTimerInterval = null;

// Função para obter usuário salvo pelo login/perfil
function getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('perfil')) || { username: 'Anônimo' };
}

// --- Carregar Ranking Local (usando localStorage) ---
async function carregarRankingMemoria() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingBoard.innerHTML = '';
    if (ranking.length === 0) {
        rankingBoard.innerHTML = '<p>Ninguém jogou Jogo da Memória ainda. Seja o primeiro!</p>';
        return;
    }
    
    const rankingList = document.createElement('ol');
    ranking.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>#${index + 1} ${score.username || 'Anônimo'}</span> <span>${score.time_in_seconds}s / ${score.moves} mov.</span>`; 
        rankingList.appendChild(listItem);
    });
    rankingBoard.appendChild(rankingList);
}

// --- Lógica do Jogo da Memória (Offline) ---
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function iniciarJogoMemoriaLocal() {
    gameView.style.display = 'block';
    onlineLobby.style.display = 'none';
    gameCodeDisplay.style.display = 'none';
    resetButton.style.display = 'block';
    resetButton.textContent = 'Reiniciar Jogo';
    resetButton.onclick = iniciarJogoMemoriaLocal;

    localMemoryGameActive = true;
    localFlippedCards = [];
    localMatchedCards = [];
    localMoves = 0;
    localTimer = 0;
    movesDisplay.textContent = `Movimentos: ${localMoves}`;
    timerDisplay.textContent = `Tempo: ${localTimer}s`;
    clearInterval(localTimerInterval);
    gameBoard.innerHTML = '';

    const gameSymbols = [...imagePaths, ...imagePaths];
    shuffle(gameSymbols);

    localMemoryCards = gameSymbols.map((symbolPath, index) => ({
        id: index,
        symbol: symbolPath,
        flipped: false,
        matched: false
    }));
    
    localMemoryCards.forEach(cardData => {
        gameBoard.appendChild(createMemoryCardElement(cardData, 'local'));
    });

    localTimerInterval = setInterval(() => {
        localTimer++;
        timerDisplay.textContent = `Tempo: ${localTimer}s`;
    }, 1000);
    statusDisplay.textContent = 'Comece a jogar!';
}

function createMemoryCardElement(cardData, mode) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardId = cardData.id;

    if (cardData.flipped) cardElement.classList.add('flipped');
    if (cardData.matched) cardElement.classList.add('matched');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = '?';
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const imgElement = document.createElement('img');
    imgElement.src = cardData.symbol;
    imgElement.alt = "Memory Card";
    cardBack.appendChild(imgElement);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);

    const canPlay = (mode === 'local' && localMemoryGameActive);
    if (canPlay && !cardData.matched && !cardData.flipped) {
        cardElement.addEventListener('click', () => {
            if (mode === 'local') flipMemoryCardLocal(cardData.id);
        });
    }

    return cardElement;
}

function flipMemoryCardLocal(cardId) {
    if (localFlippedCards.length === 2) return;
    const card = localMemoryCards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    card.flipped = true;
    localFlippedCards.push(cardId);
    
    const cardElement = gameBoard.querySelector(`.card[data-card-id='${cardId}']`);
    if (cardElement) cardElement.classList.add('flipped');

    if (localFlippedCards.length === 2) {
        localMoves++;
        movesDisplay.textContent = `Movimentos: ${localMoves}`;
        checkForMemoryMatchLocal();
    }
}

function checkForMemoryMatchLocal() {
    const [id1, id2] = localFlippedCards;
    const card1 = localMemoryCards.find(c => c.id === id1);
    const card2 = localMemoryCards.find(c => c.id === id2);

    if (card1.symbol === card2.symbol) {
        card1.matched = true;
        card2.matched = true;
        localMatchedCards.push(id1, id2);
        gameBoard.querySelector(`.card[data-card-id='${id1}']`).classList.add('matched');
        gameBoard.querySelector(`.card[data-card-id='${id2}']`).classList.add('matched');
        localFlippedCards = [];
        if (localMatchedCards.length === localMemoryCards.length) {
            endMemoryGameLocal();
        }
    } else {
        setTimeout(() => {
            card1.flipped = false;
            card2.flipped = false;
            gameBoard.querySelector(`.card[data-card-id='${id1}']`).classList.remove('flipped');
            gameBoard.querySelector(`.card[data-card-id='${id2}']`).classList.remove('flipped');
            localFlippedCards = [];
        }, 1000);
    }
}

async function endMemoryGameLocal() {
    localMemoryGameActive = false;
    clearInterval(localTimerInterval);
    statusDisplay.textContent = `Parabéns! Você completou em ${localMoves} movimentos e ${localTimer} segundos!`;
    await registrarRecordeMemoria(localTimer, localMoves);
    resetButton.textContent = 'Jogar Novamente';
    await carregarRankingMemoria();
}

async function registrarRecordeMemoria(time, moves) {
    if (!currentUser) return;

    const playerName = currentUser.username || 'Anônimo';

    const record = { username: playerName, time_in_seconds: time, moves: moves };
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push(record);

    localStorage.setItem('ranking', JSON.stringify(ranking));

    console.log(`Recorde registrado para ${playerName}`);
    statusDisplay.innerHTML = `Pontuação registrada!`;
    await carregarRankingMemoria();
}

function selecionarModo(modo) {
    gameMode = modo;

    if (modo === 'computer') {
        mainMenu.style.display = 'none';
        iniciarJogoMemoriaLocal();
    } 
    else if (modo === 'online') {
        mainMenu.style.display = 'none';
        onlineLobby.style.display = 'block';
        statusDisplay.textContent = 'Aguardando jogo online...';
    }
}

function criarNovoJogoMemoria() {
    alert("Função de criar jogo online ainda não implementada!");
}

function entrarEmJogoMemoria() {
    alert("Função de entrar em jogo online ainda não implementada!");
}

function voltarParaMenuPrincipal() {
    onlineLobby.style.display = 'none';
    mainMenu.style.display = 'block';
}
