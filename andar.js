document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const newGameButton = document.getElementById('new-game-button');
    const backToMuralButton = document.getElementById('back-to-mural-button');
    const rankingBoardMenu = document.getElementById('ranking-board-menu');

    const gameContainer = document.getElementById('game-container');
    const character = document.getElementById('character');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const ground = document.getElementById('ground');
    gameContainer.addEventListener('touchstart', jump);

    let gameState = 'menu';
    let score = 0;
    let gameSpeed = 4;
    let scoreInterval;
    let gameLoopInterval;
    let obstacleTimeoutId;

    let isJumping = false;
    let velocityY = 0;
    const gravity = 0.6;
    const jumpPower = -15;
    let characterY = 0;
    let groundHeight = 0;

    const setGroundAndCharacterPosition = () => {
        groundHeight = ground.offsetHeight;
        character.style.bottom = `${groundHeight - 2}px`;
        characterY = 0;
        character.style.transform = `translateY(${characterY}px)`;
    };

    function showMainMenu() {
        gameState = 'menu';
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        gameOverScreen.style.visibility = 'hidden';
    }

    function showGame() {
        mainMenu.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    }

    function startGame() {
        gameState = 'playing';
        score = 0;
        gameSpeed = 4;
        scoreDisplay.textContent = String(score).padStart(5, '0');
        gameOverScreen.style.visibility = 'hidden';

        document.querySelectorAll('.obstacle').forEach(obs => obs.remove());

        setGroundAndCharacterPosition();
        character.src = 'boneco_parado.png';

        if (gameContainer) {
            gameContainer.style.animation = 'none';
            void gameContainer.offsetWidth;
            gameContainer.style.animation = `bgMove ${20 / gameSpeed}s linear infinite`;
        }
        if (ground) {
            ground.style.animation = 'none';
            void ground.offsetWidth;
            ground.style.animationPlayState = 'running';
        }

        clearTimeout(obstacleTimeoutId);
        clearInterval(scoreInterval);
        clearInterval(gameLoopInterval);

        scoreInterval = setInterval(updateScore, 100);
        gameLoopInterval = setInterval(gameLoop, 20);
        obstacleTimeoutId = setTimeout(spawnObstacle, 1500);
    }

    function gameLoop() {
        if (gameState !== 'playing') return;
        handleJump();
        moveObstacles();
        checkCollision();
    }

    function handleJump() {
        if (!isJumping) return;
        velocityY += gravity;
        characterY += velocityY;

        if (characterY > 0) {
            characterY = 0;
            isJumping = false;
            velocityY = 0;
            character.src = 'boneco_parado.png';
        }
        character.style.transform = `translateY(${characterY}px)`;
    }

    function jump() {
        if (gameState !== 'playing') return;
        if (!isJumping) {
            isJumping = true;
            velocityY = jumpPower;
            character.src = 'boneco_pulando.png';
        }
    }

    function spawnObstacle() {
        if (gameState !== 'playing') return;
        const obstacle = document.createElement('img');
        obstacle.src = 'capivara.png';
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

        if (score > 0 && score % 100 === 0) {
            gameSpeed += 0.5;
            if (gameContainer) {
                 gameContainer.style.animationDuration = `${20 / gameSpeed}s`;
            }
        }
    }

    function checkCollision() {
        const charRect = character.getBoundingClientRect();
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            const obsRect = obstacle.getBoundingClientRect();
            if (charRect.right > obsRect.left &&
                charRect.left < obsRect.right &&
                charRect.bottom > obsRect.top &&
                charRect.top < obsRect.bottom) {
                handleGameOver();
            }
        });
    }
    
    function handleGameOver() {
        if (gameState === 'gameOver') return;
        gameState = 'gameOver';

        clearTimeout(obstacleTimeoutId);
        clearInterval(scoreInterval);
        clearInterval(gameLoopInterval);

        gameOverScreen.style.visibility = 'visible';

        if (gameContainer) {
            gameContainer.style.animationPlayState = 'paused';
        }
        if (ground) {
        }
    }

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

    window.addEventListener('resize', setGroundAndCharacterPosition);
    setGroundAndCharacterPosition();

    showMainMenu();
});
