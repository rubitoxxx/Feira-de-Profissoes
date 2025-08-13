const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 100; // Posição inicial do jogador
let playerY = 350; // Posição inicial do jogador (no chão)
let playerWidth = 50;
let playerHeight = 50;
let gravity = 0.5;
let jumpStrength = -12;
let isJumping = false;
let isFalling = false;
let score = 0;

let ballX = playerX + 25;
let ballY = playerY + 25;
let ballRadius = 10;
let ballSpeedX = 5;
let ballSpeedY = -5;

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Função para desenhar a bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}

// Função para atualizar a posição do jogador
function updatePlayerPosition() {
    if (isJumping) {
        playerY += jumpStrength;
        jumpStrength += gravity;
    }

    if (playerY >= 350) {
        playerY = 350;
        isJumping = false;
        jumpStrength = -12;
    }
}

// Função para atualizar a posição da bola
function updateBallPosition() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Colisão com a cesta (simulada)
    if (ballX > 550 && ballX < 580 && ballY > 150 && ballY < 170) {
        score++;
        resetBall();
    }
}

// Função para desenhar o fundo e a cesta
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#32CD32";
    ctx.fillRect(550, 150, 30, 20); // Desenha a cesta
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Pontos: " + score, 10, 30);
}

// Função para resetar a bola após um acerto
function resetBall() {
    ballX = playerX + 25;
    ballY = playerY + 25;
    ballSpeedX = 5;
    ballSpeedY = -5;
}

// Função para controlar o pulo do jogador
window.addEventListener("keydown", (event) => {
    if (event.key === " " && !isJumping) { // Pular com a tecla espaço
        isJumping = true;
    }
});

// Função de animação do jogo
function gameLoop() {
    drawBackground();
    drawPlayer();
    drawBall();
    updatePlayerPosition();
    updateBallPosition();
    requestAnimationFrame(gameLoop);
}

gameLoop();
