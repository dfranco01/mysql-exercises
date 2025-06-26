//brings in useState hook from React, built-in function allowing components to have state
//state is a way to update and store dynamic values while rendering
/*prop, short for property, is a way to pass date from parent to child component,
  component: reusable building block for UI, each a self-contained chunk of code with
  its own structure(HTML), styling(CSS), and functionality(JS),
  rendering: generating and displaying UI based on components, translating component
  code into something browser can show to user */

import { useState } from "react";

function Square({ value, onSquareClick }){
  return ( 
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) { 
  /*this function is about safely updating game state via a click, by checking for
  game over or no playing on an occupied square  */
  function handleClick(i){
    if(calculateWinner(squares) || squares[i]){
      return;
    }

    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = 'X';
    }else{
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  //checking if theres a winner yet to continue playing or not
  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: " + winner;
  }else{
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }
  
  return (
    <>
    {/*A React fragment, group multiple elements without adding extra nodes to DOM,
      clean way to wrap elements without parent div. We have three divs for each row
      to create that 3x3 shape*/}
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

//main component of file, other files can import it using import Game from './Game'
export default function Game(){
  /*start off with empty array, setHistory is function to update board, think of history
    as time machine to revisit moves */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //tracks which move currently on
  const [currentMove, setCurrentMove] = useState(0);
  //this line determines who's turn it is
  const xIsNext = currentMove % 2 === 0;
  //this line grabs board's current state at current move
  const currentSquares = history[currentMove];

  //this function called when move is made
  function handlePlay(nextSquares){
    //nextHistory is the new, most up-to-date state of the game
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  /*shows board after moveNum nextMove passed in, this function updates the state to make
    move x the current one, React then renders a board snapshot from that moment */
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  /*building a list of buttons that allow player to explore different points in 
    game's history, like a rewind/fast-forward feature*/
  const moves = history.map((squares, move) =>{
    let description;
    if(move > 0){
      description = "Go to move #" + move;
    }else{
      description = "Go to game start";
    }
    return(
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  /*this orchestrates full game experience, showing current board, managing interactivity
    and giving player control over game history */
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  //all possible winning combos
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  //loop through each winning line, destructure the 3 indices that make up that line
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    //checking if a value in square[a] and that b and c also equal sqaure[a],
    //then returns winner
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}

