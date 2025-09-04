document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const mainMenu = document.getElementById('main-menu');
    const newGameButton = document.getElementById('new-game-button');
    const backToMuralButton = document.getElementById('back-to-mural-button');
    const rankingBoardMenu = document.getElementById('ranking-board-menu');
function handleJump() {
    if (!isJumping) return;
    velocityY += gravity;
    characterY -= velocityY;
    if (characterY <= 0) {
        characterY = 0;
        isJumping = false;
        velocityY = 0;
        character.src = 'boneca_parado.png';
    }
    character.style.transform = `translateY(${characterY}px)`;
}

    // --- Variáveis de Estado do Jogo ---
    let gameState = 'menu';
    let score = 0;
    let gameSpeed = 4;
    let scoreInterval;
    let gameLoopInterval;
    let obstacleTimeoutId;

    // Variáveis para pulo
    let isJumping = false;
    let velocityY = 0;
    let characterY = 0;
    const gravity = -1.5;
    const jumpPower = 22;
    let groundHeight = 0;

    // Função para ajustar a altura do chão e a posição inicial do personagem
    const setGroundAndCharacterPosition = () => {
        groundHeight = ground.offsetHeight;
        character.style.bottom = `${groundHeight - 2}px`;
        characterY = 0;
        character.style.transform = `translateY(0px)`;
    };

    // --- LÓGICA DE CONTROLE DE TELAS ---
    function loadMenuRanking() {
        rankingBoardMenu.innerHTML = '<p>Carregando ranking...</p>';
        const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        if (ranking.length === 0) {
            rankingBoardMenu.innerHTML = '<p>Seja o primeiro a deixar sua marca!</p>';
            return;
        }
        const rankingList = document.createElement('ol');
        ranking.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>#${index + 1} ${entry.username}</span> <span>${String(entry.score).padStart(5, '0')}</span>`;
            rankingList.appendChild(listItem);
        });
        rankingBoardMenu.innerHTML = '';
        rankingBoardMenu.appendChild(rankingList);
    }

    function showMainMenu() {
        gameState = 'menu';
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        gameOverScreen.style.visibility = 'hidden';
        loadMenuRanking();
    }

    function showGame() {
        gameState = 'playing';
        mainMenu.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    }

    function saveScore(finalScore) {
        const username = prompt("Qual seu nome?");
        if (!username) return;
        const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        ranking.push({ username, score: finalScore });
        ranking.sort((a, b) => b.score - a.score); // Ordena por pontuação
        if (ranking.length > 10) {
            ranking.pop(); // Mantém apenas os 10 melhores
        }
        localStorage.setItem('ranking', JSON.stringify(ranking));
    }

    // ==========================================================
    // --- LÓGICA PRINCIPAL DO JOGO ---
    // ==========================================================
    function startGame() {
        gameState = 'playing';
        score = 0;
        gameSpeed = 4;
        scoreDisplay.textContent = String(score).padStart(5, '0');
        gameOverScreen.style.visibility = 'hidden';

        setGroundAndCharacterPosition();
        character.src = 'boneca_parado.png';

        clearTimeout(obstacleTimeoutId);
        clearInterval(scoreInterval);
        clearInterval(gameLoopInterval);

        scoreInterval = setInterval(updateScore, 100);
        gameLoopInterval = setInterval(gameLoop, 20);
        obstacleTimeoutId = setTimeout(spawnObstacle, 1500);
    }

     function handleJump() {
        if (!isJumping) return;
        velocityY += gravity;
        characterY -= velocityY;
        if (characterY <= 0) {
            characterY = 0;
            isJumping = false;
            velocityY = 0;
            character.src = 'boneca_parado.png';
        }
        character.style.transform = `translateY(${characterY}px)`;
    }

    function jump() {
        if (gameState !== 'playing') return;
        if (isJumping) return;
        isJumping = true;
        velocityY = jumpPower;
        character.src = 'boneca_pulando.png';
    }

    function spawnObstacle() {
        if (gameState !== 'playing') return;
        const obstacle = document.createElement('img');
        obstacle.src = 'boneca_obstaculo.png';
        obstacle.classList.add('obstacle');
        obstacle.style.right = '-50px';
        obstacle.style.bottom = `${groundHeight - 2}px`;
        gameContainer.appendChild(obstacle);

        const baseInterval = 1800;
        const randomVariation = 1200;
        const nextSpawnTime = (Math.random() * randomVariation + baseInterval) / (gameSpeed / 4);
        obstacleTimeoutId = setTimeout(spawnObstacle, nextSpawnTime);
    }

    function moveObstacles() {
        const gameContainerWidth = gameContainer.offsetWidth;
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            let obsRight = parseFloat(obstacle.style.right);
            obstacle.style.right = `${obsRight + gameSpeed}px`;
            if (obsRight > gameContainerWidth + obstacle.offsetWidth) {
                obstacle.remove();
            }
        });
    }

    function updateScore() {
        if (gameState !== 'playing') return;
        score++;
        scoreDisplay.textContent = String(score).padStart(5, '0');
    }

    function checkCollision() {
        // Implementação da verificação de colisões
        // Exemplo básico:
        const characterRect = character.getBoundingClientRect();
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                characterRect.right > obstacleRect.left &&
                characterRect.left < obstacleRect.right &&
                characterRect.bottom > obstacleRect.top &&
                characterRect.top < obstacleRect.bottom
            ) {
                handleGameOver();
            }
        });
    }

    function gameLoop() {
        handleJump();
        moveObstacles();
        checkCollision();
        // Aumenta a velocidade gradualmente
        if (gameSpeed < 12) {
            gameSpeed += 0.002;
        }
    }

    async function handleGameOver() {
        if (gameState === 'gameOver') return;
        gameState = 'gameOver';

        clearTimeout(obstacleTimeoutId);
        clearInterval(scoreInterval);
        clearInterval(gameLoopInterval);

        gameOverScreen.style.visibility = 'visible';

        saveScore(score);
        loadMenuRanking();
    }

    // --- Eventos de Input ---
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (gameState === 'playing') jump();
        }
    });

    newGameButton.addEventListener('click', showGame);
    restartButton.addEventListener('click', showMainMenu);
    backToMuralButton.addEventListener('click', () => {
        window.location.href = "mural.html";
    });

    // --- Início do Script ---
    showMainMenu();
});
