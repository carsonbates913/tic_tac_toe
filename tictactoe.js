
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
    Player1 = Player(prompt("What is Player 1's name?"), "X");
    Player2 = Player(prompt("what is Player 2's name?"), "O");
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
  }

  return {Start, MakeMove};
})();

const DisplayController = () => {
  
}