// Controle principal da interface do jogo
document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const vsPlayerBtn = document.getElementById('vs-player');
    const vsComputerBtn = document.getElementById('vs-computer');
    const resetBtn = document.getElementById('reset-button');
    const difficultySelector = document.getElementById('difficulty-selector');
    const difficultySelect = document.getElementById('difficulty');

    // Configura eventos do tabuleiro
    squares.forEach(square => square.addEventListener('click', handleClick));

    // Configura botões de controle
    vsPlayerBtn.addEventListener('click', () => {
        setGameMode('player');
        difficultySelector.style.display = 'none';
    });

    vsComputerBtn.addEventListener('click', () => {
        setGameMode('computer');
        difficultySelector.style.display = 'flex';
    });

    resetBtn.addEventListener('click', resetGame);

    // Atualiza dificuldade selecionada
    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
        if (gameMode === 'computer') resetGame();
    });
});

// Processa clique no tabuleiro
function handleClick(event) {
    const square = event.target.closest('.square');
    if (!square || gameOver || gameMode === null) return;

    const position = parseInt(square.id);
    const result = handleMove(position);

    if (result === true) {
        setTimeout(() => alert(`O jogo acabou! O vencedor foi ${symbols[playerTime].toUpperCase()}`), 10);
    } else if (result === 'draw') {
        setTimeout(() => alert("Empate! Ninguém venceu."), 10);
    }

    updateSquare(position);
}

// Atualiza visualização do quadrado
function updateSquare(position) {
    const square = document.getElementById(position.toString());
    square.innerHTML = board[position] ? `<div class='${board[position]}'></div>` : '';
}

// Configura modo de jogo
function setGameMode(mode) {
    gameMode = mode;
    resetGame();
    const difficultyMsg = mode === 'computer' ? ` (Dificuldade: ${document.getElementById('difficulty').value.toUpperCase()})` : '';
    alert(`Modo: Jogador vs ${mode === 'player' ? 'Pessoa' : 'Computador'}${difficultyMsg}. Você é o O!`);
}