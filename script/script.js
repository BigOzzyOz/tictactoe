let playerSymbol = '';
let computerSymbol = '';
let currentPlayer = '';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let winnerCells = [];
let playerScore = 0;
let computerScore = 0;
let lastRoundWinner = '';
let isFirstRound = true;

function render() {
  const container = document.querySelector('.container');

  container.innerHTML = /*html*/`
    <h2>Wähle dein Symbol</h2>
    <div class="symbol-selection">
        <div class="symbol-option" id="circle" onclick="selectSymbol('circle')">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40"  fill="none" />
            </svg>
        </div>
        <div class="symbol-option" id="cross" onclick="selectSymbol('cross')">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
            </svg>
        </div>
    </div>
  `;
}

function selectSymbol(symbol) {
  playerSymbol = symbol;
  computerSymbol = symbol === 'circle' ? 'cross' : 'circle';
  currentPlayer = 'circle';
  const selectedElement = document.getElementById(symbol);
  selectedElement.classList.add('selected');
  setTimeout(() => {
    renderGameBoard();
  }, 500);
}

function renderGameBoard() {
  const container = document.querySelector('.container');
  container.innerHTML = /*html*/`
    <div class="game-status">
      <div>
        ${playerSymbol === 'circle' ? getCircleSVG('Du') : getCrossSVG('Du')}
      </div>
      <div>vs</div>
      <div>
        ${computerSymbol === 'circle' ? getCircleSVG() : getCrossSVG()}
      </div>
    </div>
    <div class="score-board">
      Spielstand - Du: ${playerScore} | Computer: ${computerScore}
    </div>
    <div class="game-board">
      ${gameBoard.map((symbol, index) => {
    return `<div class="cell" onclick="handleCellClick(${index})" id="cell-${index}">${getSymbolSVG(symbol)}</div>`;
  }).join('')}
    </div>
    ${gameOver ? '<button onclick="startNewRound()">Neue Runde starten</button>' : ''}
  `;

  if (gameOver) {
    highlightWinner();
  }
  if (currentPlayer === computerSymbol && isFirstRound && gameBoard.filter(cell => cell === '').length === 9) {
    setTimeout(computerMove, 500);
  }
}

function handleCellClick(index) {
  if (gameOver || gameBoard[index] !== '') return;

  const cell = document.getElementById(`cell-${index}`);
  cell.innerHTML = getSymbolSVG(currentPlayer);
  gameBoard[index] = currentPlayer;

  if (checkWinner(currentPlayer)) {
    gameOver = true;
    updateScore(currentPlayer);
    lastRoundWinner = currentPlayer;
  } else if (checkDraw()) {
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    if (currentPlayer === computerSymbol && !gameOver) {
      setTimeout(computerMove, 500);
    }
  }

  renderGameBoard();
}

function computerMove() {
  let index;
  do {
    index = Math.floor(Math.random() * 9);
  } while (gameBoard[index] !== '');

  const cell = document.getElementById(`cell-${index}`);
  cell.innerHTML = getSymbolSVG(computerSymbol);
  gameBoard[index] = computerSymbol;

  if (checkWinner(computerSymbol)) {
    gameOver = true;
    updateScore(computerSymbol);
    lastRoundWinner = computerSymbol;
  } else if (checkDraw()) {
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
  }
  renderGameBoard();
}

function checkWinner(symbol) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === symbol) {
      winnerCells = combo;
      return true;
    }
  }
  return false;
}

function highlightWinner() {
  const [a, b, c] = winnerCells;
  const winningCells = document.querySelectorAll(`#cell-${a}, #cell-${b}, #cell-${c}`);

  winningCells.forEach(cell => {
    cell.style.backgroundColor = 'transparent';
    cell.style.backgroundImage = 'linear-gradient(45deg, #03dac5, #028090)';
  });
}

function updateScore(symbol) {
  if (symbol === playerSymbol) {
    playerScore++;
  } else {
    computerScore++;
  }
}

function checkDraw() {
  return gameBoard.every(cell => cell !== '');
}

function getSymbolSVG(symbol) {
  if (symbol === 'circle') {
    return getCircleSVG();
  } else if (symbol === 'cross') {
    return getCrossSVG();
  }
  return '';
}

function getCircleSVG(text = '') {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke-width="10" fill="none" stroke="#03dac5" />
    </svg>${text ? ' (' + text + ')' : ''}
  `;
}

function getCrossSVG(text = '') {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="10" x2="90" y2="90" />
      <line x1="90" y1="10" x2="10" y2="90" />
    </svg>${text ? ' (' + text + ')' : ''}
  `;
}

function startNewRound() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  winnerCells = [];
  gameOver = false;
  isFirstRound = false;

  if (lastRoundWinner === playerSymbol) {
    currentPlayer = computerSymbol;
  } else {
    currentPlayer = playerSymbol;
  }
  renderGameBoard();
  if (!isFirstRound && lastRoundWinner === playerSymbol) {
    setTimeout(computerMove, 500);
  }
}
