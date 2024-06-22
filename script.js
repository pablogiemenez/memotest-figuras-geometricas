const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('timer');

const cardValues = [
    'figura1.jpg', 'figura2.jpg', 'figura3.jpg', 'figura4.jpg',
    'figura5.jpg', 'figura6.jpg', 'figura7.jpg', 'figura8.jpg'
];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let startTime;
let timerInterval;

// Cargar los archivos de sonido
const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.mp3');
const winSound = new Audio('win.mp3');

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Tiempo: ${elapsedTime} segundos`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function createBoard() {
    cards = [...cardValues, ...cardValues];
    cards.sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = `<img src="${value}" alt="Imagen de carta">`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
    matchedPairs = 0; // Resetear el conteo de pares coincidentes
    startTimer(); // Iniciar el temporizador
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    // Reproducir el sonido de flip
    if (!firstCard) {
        firstCard = this;
        flipSound.play(); 
        return;
    }

    secondCard = this;
    lockBoard = true; // Bloquear el tablero mientras se verifica la coincidencia

    // Reproducir el sonido de flip solo si las cartas no coinciden
    if (firstCard.dataset.value !== secondCard.dataset.value) {
        flipSound.play(); 
    }

    setTimeout(checkForMatch, 500); // Añadir un pequeño retraso antes de comprobar la coincidencia
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchSound.play(); // Reproducir el sonido de match
        disableCards();
        matchedPairs++;
        if (matchedPairs === cardValues.length) {
            stopTimer(); // Detener el temporizador
            setTimeout(() => {
                winSound.play(); // Reproducir el sonido de ganar
                alert(`¡Ganaste! Tiempo: ${Math.floor((Date.now() - startTime) / 1000)} segundos`);
            }, 500);
        }
        return;
    }
    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

restartButton.addEventListener('click', () => {
    stopTimer(); // Detener el temporizador si se reinicia el juego
    createBoard();
});

createBoard();
