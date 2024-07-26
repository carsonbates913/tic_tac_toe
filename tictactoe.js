
const Gameboard = (() => {

  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const addMove = (i, marker) => {
      if(!board[i]) {
        board[i] = marker;
        return true;
      }else {
        return false;
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
      return;
    }
    if(currentPlayer.makeMove(index)){
      nextTurn();
    }
    const result = checkWinner();
    if(result) {
      DisplayController.toggleWinner(result);
      finished = true;
    }
    DisplayController.renderBoard();
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
    DisplayController.updateTurnDisplay();
  }

  const getCurrentPlayer = () => currentPlayer; 

  const reset = () => {
    Gameboard.resetBoard();
    finished = false;
  }

  const getFinished = () => finished;

  return {start, makeMove, getCurrentPlayer, getFinished, reset};
})();

const DisplayController = (() => {
  const root = document.documentElement;
  const startButton = document.querySelector('.start');
  const resetButton = document.querySelector('.reset');
  const player1Input = document.querySelector('#player1');
  const player2Input = document.querySelector('#player2');
  const playerForm = document.querySelector(".player-form");
  const player1Color = document.getElementById('player1-color');
  const player2Color = document.getElementById('player2-color');
  const currentPlayer = document.querySelector(".current-player");
  const currentPlayerTitle = document.querySelector('.current-player-title');
  const currentPlayerMarker = document.querySelector('.current-player-marker');
  const cells = document.querySelectorAll('.cell');

  const initializeUI = () => {
    startButton.addEventListener('click', () => {
      Game.start(player1Input.value, player2Input.value);
      toggleStart();
    });
    resetButton.addEventListener("click", () => {
      DisplayController.resetBoard();
    })
    player1Color.addEventListener('input', (event) => {
      const selectedColor = event.target.value;
      root.style.setProperty('--player1-color', selectedColor);
     });
    player2Color.addEventListener('input', (event) => {
      const selectedColor = event.target.value;
      root.style.setProperty('--player2-color', selectedColor);
     });
  };



  const renderBoard = () => {
    Gameboard.getBoard().forEach((value, index) => {
      const cell = document.querySelector(`#cell${index}`);
      cell.innerHTML = value ? `<p>${value}</p>` : '';
    });
  }

  const updateTurnDisplay = () => {
    currentPlayerTitle.innerHTML = `${Game.getCurrentPlayer().getName()}'s Turn`;
    currentPlayerMarker.innerHTML = `${Game.getCurrentPlayer().getMarker()}`;
  }

  const toggleStart = () => {
      startButton.style.display = "none";
      resetButton.style.display = "block";
      playerForm.style.display = "none";
      currentPlayer.style.display = "block";
      updateTurnDisplay();
      addTileListeners();
    }

  const toggleWinner = (result) => {
    if(result === "Tie"){
      currentPlayerTitle.innerHTML = "Its a Draw!"
      currentPlayerMarker.innerHTML = '';
    }else{
      currentPlayerTitle.innerHTML = `Congratulations! ${Game.getCurrentPlayer().getName()} wins!`
      currentPlayerMarker.innerHTML = '';
    }
  }

  const resetBoard = () => {
    Game.reset();
    cells.forEach(cell => cell.setAttribute("class", "cell"));
    DisplayController.renderBoard();
    updateTurnDisplay();
  }

  const addTileListeners =() => {
    cells.forEach((cell, index) => { 
      cell.addEventListener("click", () => {
        if(Game.makeMove(index)){
          cell.classList.add("player1");
        }
        cell.classList.remove("hover");
      });
      cell.addEventListener("mouseenter", () => {
        if(cell.innerHTML === '' && !Game.getFinished()){
          cell.innerHTML = Game.getCurrentPlayer().getMarker();
          cell.classList.add("hover");
          Game.getCurrentPlayer().getMarker() === "X" ? cell.classList.add("player1") : cell.classList.add("player2");
        }
      });
      cell.addEventListener("mouseleave", () => {
        if(Gameboard.getBoard()[index] === '' && !Game.getFinished()) {
          cell.innerHTML = '';
          cell.classList.remove("hover");
          Game.getCurrentPlayer().getMarker() === "X" ? cell.classList.remove("player1") : cell.classList.remove("player2");
        }
      });
    }); 
  }

  initializeUI();

  return {renderBoard, toggleStart, updateTurnDisplay, toggleWinner, resetBoard};
})();