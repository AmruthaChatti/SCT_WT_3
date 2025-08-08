const boxes = document.querySelectorAll('.box');
const result = document.querySelector('.result');
const resetBtn = document.getElementById('reset-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isPlayerTurn = true;

const player = 'X';
const computer = 'O';

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function handleBoxClick(e) {
  if (!gameActive || !isPlayerTurn) return;

  const index = Array.from(boxes).indexOf(e.target);

  if (board[index] !== '') return;

  makeMove(index, player);

  if (gameActive) {
    isPlayerTurn = false; 
    result.textContent = "Computer's Turn";
    setTimeout(() => {
      computerMove();
      if (gameActive) {
        isPlayerTurn = true;
        result.textContent = "Player's Turn";
      }
    }, 500);
  }
}

function makeMove(index, currentPlayer) {
  board[index] = currentPlayer;
  boxes[index].textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    result.textContent = currentPlayer === player ? 'Player Wins!' : 'Computer Wins!';
    gameActive = false;
    isPlayerTurn = false;
  } else if (isDraw()) {
    result.textContent = "It's a Draw!";
    gameActive = false;
    isPlayerTurn = false;
  }
}

function computerMove() {
  if (!gameActive) return;

  const bestMove = findBestMove();
  makeMove(bestMove, computer);
}

function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = computer;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin(computer)) return 10 - depth;
  if (checkWin(player)) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = computer;
        let evalScore = minimax(boardState, depth + 1, false);
        boardState[i] = '';
        maxEval = Math.max(maxEval, evalScore);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = player;
        let evalScore = minimax(boardState, depth + 1, true);
        boardState[i] = '';
        minEval = Math.min(minEval, evalScore);
      }
    }
    return minEval;
  }
}


function checkWin(currentPlayer) {
  return winningConditions.some(condition => {
    return condition.every(index => board[index] === currentPlayer);
  });
}

function isDraw() {
  return board.every(cell => cell !== '');
}

function resetGame() {
  board.fill('');
  gameActive = true;
  isPlayerTurn = true;
  boxes.forEach(box => box.textContent = '');
  result.textContent = "Player's Turn";
}

function initGame() {
  boxes.forEach(box => box.addEventListener('click', handleBoxClick));
  resetBtn.addEventListener('click', resetGame);
  result.textContent = "Player's Turn";
}

initGame();