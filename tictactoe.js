
const Gameboard = (() => {

  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const addMove = (i, marker) => {
      if(!board[i]) {
        board[i] = marker;
      }
  };

  const resetBoard = () => board = ['', '', '', '', '', '', '', '', ''];

  return {getBoard, addMove, resetBoard}; 
})();

function Player(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  const makeMove = (i) => Gameboard.addMove(i, marker); 

  return {getName, getMarker, makeMove};
}

const Game = (() => {
  let Player1;
  let Player2;
  let currentPlayer;
  let finished = false; 

  const start = (player1Name, player2Name) => {
    Player1 = Player(player1Name, "X");
    Player2 = Player(player2Name, "O");
    currentPlayer = Player1;
  }

  const makeMove = (index) => {
    if(finished){
      console.log("This game is over :( --- Please start a new one!");
      return;
    }
    currentPlayer.makeMove(index, currentPlayer.getMarker());
    const result = checkWinner();
    if(result) {
      DisplayController.toggleWinner(result);
      DisplayController.renderBoard();
      finished = true;
    }else{
    nextTurn();
    DisplayController.renderBoard();
    }
  }

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const selection = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for(let combo of selection) {
      if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]){
        return currentPlayer; 
      }
    }

    const isTie = board.every(cell => cell !== '');
    if (isTie) {
      return "Tie";
    }

    return false;
  }

  const nextTurn = () => {
    currentPlayer = currentPlayer === Player1 ? Player2 : Player1;
    DisplayController.toggleTurn();
  }

  const getCurrentPlayer = () => currentPlayer; 

  const reset = () => {
    Gameboard.resetBoard();
    finished = false;
  }

  return {start, makeMove, getCurrentPlayer, reset};
})();

const DisplayController = (() => {

  const initializeUI = () => {
    document.querySelector('.start').addEventListener('click', () => {
      const player1Name = document.querySelector('#player1').value;
      const player2Name = document.querySelector('#player2').value;
      Game.start(player1Name, player2Name);
      toggleStart();
    });
  };

  document.querySelector(".reset").addEventListener("click", () => {
    DisplayController.resetBoard();
  })

  const renderBoard = () => {
    Gameboard.getBoard().forEach((value, index) => {
      const cell = document.querySelector(`#cell${index}`);
      cell.innerHTML = value ? `<p>${value}</p>` : '';
    });
  }

  const toggleTurn = () => {
    document.querySelector(".current-player-title").innerHTML = `${Game.getCurrentPlayer().getName()}'s Turn`;
      document.querySelector(".current-player-marker").innerHTML = `${Game.getCurrentPlayer().getMarker()}`;
  }

  const toggleStart = () => {
      document.querySelector(".start").style.display = "none";
      document.querySelector(".reset").style.display = "block";
      document.querySelectorAll(".form-div").forEach( div => {div.style.display = "none"})
      document.querySelector(".current-player").style.display = "block";
      toggleTurn();
      document.querySelectorAll(".cell").forEach((cell, index) => { cell.addEventListener("click", () => {Game.makeMove(index)})});
      }

  const toggleWinner = (result) => {
    if(result === "Tie"){
      document.querySelector(".current-player-title").innerHTML = "Its a Draw!"
      document.querySelector(".current-player-marker").innerHTML = '';
    }else{
      document.querySelector(".current-player-title").innerHTML = `Congratulations! ${Game.getCurrentPlayer().getName()} wins!`
      document.querySelector(".current-player-marker").innerHTML = '';
    }

  }

  const resetBoard = () => {
    Game.reset();
    DisplayController.renderBoard();
    toggleTurn();
  }

  initializeUI();

  return {renderBoard, toggleStart, toggleTurn, toggleWinner, resetBoard};
})();