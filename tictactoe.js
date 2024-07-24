
const Gameboard = (() => {

  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const addMove = (i, marker) => {
    if(-1 < i < 9) {
      if(!board[i]) {
        board[i] = marker;
      }
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

  const Start = () => {
    Gameboard.resetBoard();
    Player1 = Player(document.querySelector("#player1").value, "X");
    Player2 = Player(document.querySelector("#player2").value, "O");
    currentPlayer = Player1;
    console.log(`Start Game! it is ${Player1.getName()}'s turn`);
  }

  const MakeMove = (index) => {
    if(finished){
      console.log("This game is over :( --- Please start a new one!");
      return;
    }
    currentPlayer.makeMove(index, currentPlayer.getMarker());
    console.log(Gameboard.getBoard());
    const result = checkWinner();
    if(result) {
      if(result === "Tie"){
        console.log(`Congratulations! No one wins! It's a Tie!`);
      }else{
        console.log(`Congratulations! ${currentPlayer.getName()} wins!`); 
      }
      finished = true;
    }
    nextTurn();
    DisplayController.renderBoard();
  }

  const checkWinner = () => {
    board = Gameboard.getBoard();
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

  const GetCurrentPlayer = () => {
    return currentPlayer; 
  }

  return {Start, MakeMove, GetCurrentPlayer};
})();

const DisplayController = (() => {

  document.querySelector(".start").addEventListener("click", () =>{
    Game.Start();
    DisplayController.toggleStart();
  });

  const renderBoard = () => {
    Gameboard.getBoard().forEach((value, index) => {
      const cell = document.querySelector(`#cell${index}`);
      cell.innerHTML = '';
      if(value){
        /*cell.innerHTML = `<img src="images/${vaule}.png"`;*/
        cell.innerHTML = `<p>${value}</p>`;
      }
    });
  }

  const toggleTurn = () => {
    document.querySelector(".current-player-title").innerHTML = `${Game.GetCurrentPlayer().getName()}'s Turn`;
      document.querySelector(".current-player-marker").innerHTML = `${Game.GetCurrentPlayer().getMarker()}`;
  }

  const toggleStart = () => {
      document.querySelector(".start").style.display = "none";
      document.querySelector(".reset").style.display = "block";
      document.querySelectorAll(".form-div").forEach( div => {div.style.display = "none"})
      document.querySelector(".current-player").style.display = "block";
      document.querySelector(".current-player-title").innerHTML = `${Game.GetCurrentPlayer().getName()}'s Turn`;
      document.querySelector(".current-player-marker").innerHTML = `${Game.GetCurrentPlayer().getMarker()}`;
  }

  return {renderBoard, toggleStart, toggleTurn};
})();