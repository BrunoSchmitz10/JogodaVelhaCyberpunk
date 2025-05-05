/*
 * LÓGICA DO JOGO DA VELHA - CORE GAME ENGINE
 */

// Variáveis de estado
let board = ['', '', '', '', '', '', '', '', ''];
let playerTime = 0; // 0 = 'O', 1 = 'X'
let symbols = ['o', 'x'];
let gameOver = false;
let gameMode = null; // 'player' ou 'computer'
let difficulty = 'normal'; // 'easy', 'normal', 'hard'

// Combinações vencedoras
const winStates = [
    [0,1,2], [3,4,5], [6,7,8], // linhas
    [0,3,6], [1,4,7], [2,5,8], // colunas
    [0,4,8], [2,4,6] // diagonais
];

// Processa movimento e verifica fim de jogo
function handleMove(position) {
    if (gameOver || board[position] !== '') return false;

    board[position] = symbols[playerTime];
    gameOver = isWin();

    if (!gameOver) {
        if (isDraw()) {
            gameOver = true;
            return 'draw';
        }

        playerTime = playerTime === 0 ? 1 : 0;
        updatePlayerTurn();

        if (gameMode === 'computer' && playerTime === 1 && !gameOver) {
            setTimeout(computerMove, 500);
        }
    }
    return gameOver;
}

function isWin() {
    return winStates.some(seq => 
        board[seq[0]] !== '' &&
        board[seq[0]] === board[seq[1]] &&
        board[seq[0]] === board[seq[2]]
    );
}

function isDraw() {
    return board.every(cell => cell !== '');
}

// Sistema de IA com 3 níveis
function computerMove() {
    switch(difficulty) {
        case 'easy': easyAI(); break;
        case 'normal': normalAI(); break;
        case 'hard': hardAI(); break;
        default: normalAI();
    }
}

function easyAI() {
    const emptyPositions = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(val => val !== null);

    if (emptyPositions.length > 0) {
        executeMove(emptyPositions[Math.floor(Math.random() * emptyPositions.length)]);
    }
}

function normalAI() {
    let move = findWinningMove(symbols[1]) || 
               findWinningMove(symbols[0]) || 
               getStrategicMove();
    if (move !== null) executeMove(move);
}

function hardAI() {
    let move = findWinningMove(symbols[1]) || 
               findWinningMove(symbols[0]) || 
               createFork() || 
               getAdvancedStrategicMove();
    if (move !== null) executeMove(move);
}

// Funções auxiliares da IA
function findWinningMove(symbol) {
    for (const [a, b, c] of winStates) {
        const line = [board[a], board[b], board[c]];
        const emptyIndex = line.indexOf('');
        if (line.filter(cell => cell === symbol).length === 2 && emptyIndex !== -1) {
            return [a, b, c][emptyIndex];
        }
    }
    return null;
}

function createFork() {
    const emptyPositions = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(val => val !== null);

    for (const pos of emptyPositions) {
        let winningLines = 0;
        for (const line of winStates) {
            if (line.includes(pos)) {
                const [a, b, c] = line;
                const lineValues = [board[a], board[b], board[c]];
                if (lineValues.filter(v => v === symbols[1]).length === 1 && 
                    lineValues.filter(v => v === '').length === 2) {
                    winningLines++;
                }
            }
        }
        if (winningLines >= 2) return pos;
    }
    return null;
}

function getStrategicMove() {
    if (board[4] === '') return 4;
    
    const corners = [0, 2, 6, 8].filter(pos => board[pos] === '');
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    const sides = [1, 3, 5, 7].filter(pos => board[pos] === '');
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    
    return null;
}

function getAdvancedStrategicMove() {
    if (board[4] === '') return 4;
    
    // Cantos opostos
    if (board[0] === symbols[0] && board[8] === '') return 8;
    if (board[8] === symbols[0] && board[0] === '') return 0;
    if (board[2] === symbols[0] && board[6] === '') return 6;
    if (board[6] === symbols[0] && board[2] === '') return 2;
    
    const corners = [0, 2, 6, 8].filter(pos => board[pos] === '');
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    const sides = [1, 3, 5, 7].filter(pos => board[pos] === '');
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    
    return null;
}

function executeMove(position) {
    handleMove(position);
    updateSquare(position);
    if (gameOver) {
        setTimeout(() => alert(`O jogo acabou! O vencedor foi ${symbols[playerTime].toUpperCase()}`), 10);
    }
}

// Controle do jogo
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    playerTime = 0;
    gameOver = false;
    updatePlayerTurn();
    document.querySelectorAll('.square').forEach(square => square.innerHTML = '');
}

function updatePlayerTurn() {
    const el = document.getElementById('current-player');
    el.textContent = symbols[playerTime].toUpperCase();
    el.style.color = playerTime === 0 ? '#4CAF50' : '#FF5722';
}