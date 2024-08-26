const dog = document.getElementById('dog');
const obstacle = document.getElementById('obstacle');
const gameOverText = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const prizeMessage = document.getElementById('prize-message');
let isJumping = false;
let gameOver = false;
let prizeMessageTimeout; // Variable para almacenar el temporizador del mensaje de premio

function restartGame() {
    gameOver = false;
    gameOverText.style.display = 'none'; // Ocultar el mensaje de fin de juego
    obstacle.style.animation = 'moveObstacle 2s linear infinite'; // Reiniciar la animación del obstáculo
    dog.classList.remove('dead'); // Eliminar la clase 'dead' para reiniciar la animación
    dog.style.transform = 'translateY(0)'; // Restablecer la posición del perrito
    dog.style.bottom = '100px'; // Restablecer la posición vertical del perrito
    obstacle.style.right = '-50px'; // Restablecer la posición inicial del obstáculo
    prizeMessage.style.display = 'none'; // Ocultar el mensaje del premio
    clearTimeout(prizeMessageTimeout); // Limpiar el temporizador del mensaje de premio
    requestAnimationFrame(gameLoop); // Reiniciar el bucle del juego
}

document.body.addEventListener('click', () => {
    if (!isJumping && !gameOver) {
        isJumping = true;
        dog.style.transform = 'translateY(-150px)';
        setTimeout(() => {
            dog.style.transform = 'translateY(0)';
            isJumping = false;
        }, 450);
    }
});

restartButton.addEventListener('click', restartGame);

function detectCollision() {
    const dogRect = dog.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dogRect.bottom > obstacleRect.top &&
        dogRect.top < obstacleRect.bottom &&
        dogRect.right > obstacleRect.left &&
        dogRect.left < obstacleRect.right
    ) {
        gameOver = true;
        obstacle.style.animation = 'none'; // Detener el obstáculo
        dog.classList.remove('dead'); // Quitar la clase 'dead' si ya estaba
        void dog.offsetWidth; // Trigger reflow para reiniciar la animación
        dog.classList.add('dead'); // Aplicar la clase 'dead' para iniciar la animación
        gameOverText.style.display = 'block'; // Mostrar mensaje de fin de juego
    }
}

function showPrizeMessageIfNeeded() {
    const dogRect = dog.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Mostrar el mensaje de premio solo si el perrito está en el aire
    // y el obstáculo está cerca de donde se encuentra el perrito
    if (isJumping && !gameOver) {
        if (
            dogRect.right > obstacleRect.left &&
            dogRect.left < obstacleRect.right &&
            dogRect.bottom > obstacleRect.top - 50 // Ajusta el valor si es necesario
        ) {
            prizeMessage.style.display = 'block';
            clearTimeout(prizeMessageTimeout); // Limpiar cualquier temporizador anterior
            prizeMessageTimeout = setTimeout(() => {
                prizeMessage.style.display = 'none';
            }, 2000); // Mantener el mensaje visible por 2 segundos
        }
    } else {
        prizeMessage.style.display = 'none';
    }
}

function gameLoop() {
    if (!gameOver) {
        detectCollision();
        showPrizeMessageIfNeeded();
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar el bucle del juego
gameLoop();
