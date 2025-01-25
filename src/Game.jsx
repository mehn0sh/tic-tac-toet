import React, { useEffect, useState } from "react";
import Player from "./assets/ui/Player";
import Modal from "./assets/ui/Modal";
import Button from "./assets/ui/Button";
import HistoryOfMovment from "./HistoryOfMovment";
import { useLocation, useNavigate } from "react-router-dom";

const Game = () => {
  const initializeBoard = () => {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(null);
    }
    return board;
  };

  const location = useLocation();
  const navigate = useNavigate();

  // get query parameters from URL
  const urlParams = new URLSearchParams(location.search);
  const boardParam = urlParams.get("board");
  const playerParam = urlParams.get("player");
  const historyParam = urlParams.get("history");
  const currentMoveParam = urlParams.get("currentMove");

  // Check if localStorage has any old data
  const savedBoard = JSON.parse(localStorage.getItem("board"));
  const savedPlayer = localStorage.getItem("player");
  const savedHistory = JSON.parse(localStorage.getItem("history"));
  const savedCurrentMove = parseInt(localStorage.getItem("currentMove"));

  // Gmae Board Cells
  const [board, setBoard] = useState(
    boardParam ? JSON.parse(boardParam) : savedBoard || initializeBoard()
  );

  // Active player (X or O)
  const [isXNext, setIsXNext] = useState(
    playerParam ? playerParam === "X" : savedPlayer === "X"
  );

  // Modal visibility state
  const [open, setOpen] = useState(false);

  // Winner state
  const [winner, setWinner] = useState(null);

  // Draw state
  const [isDraw, setIsDraw] = useState(false);

  const [historyOfGame, setHistoryOfGame] = useState(
    historyParam
      ? JSON.parse(historyParam)
      : savedHistory || [{ board: initializeBoard(), player: null, move: null }]
  );

  // current move state
  const [currentMove, setCurrentMove] = useState(
    currentMoveParam ? parseInt(currentMoveParam) : savedCurrentMove || 0
  );

  useEffect(() => {
    //Update URL with changes
    const newParams = new URLSearchParams();
    newParams.set("board", JSON.stringify(board));
    newParams.set("player", isXNext ? "X" : "O");
    newParams.set("history", JSON.stringify(historyOfGame));
    newParams.set("currentMove", currentMove.toString());
    navigate(`?${newParams.toString()}`, { replace: true });

    // Save the game state in localStorage
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("player", isXNext ? "X" : "O");
    localStorage.setItem("history", JSON.stringify(historyOfGame));
    localStorage.setItem("currentMove", currentMove.toString());

    const calculatedWinner = calculateWinner(board);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      setOpen(true);
    } else if (!board.includes(null)) {
      // no null cells, its a draw
      setIsDraw(true);

      setOpen(true);
    }
  }, [board, isXNext, historyOfGame, navigate]);

  const handleClick = (index) => {
    // Prevent marking  marked cells or checked game is over
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    // marked the cell
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const updatedHistory = [
      ...historyOfGame.slice(0, currentMove + 1),
      { board: newBoard, player: isXNext ? "X" : "O", move: [row, col] },
    ];
    setHistoryOfGame(updatedHistory);
    setBoard(newBoard);
    setCurrentMove(updatedHistory.length - 1);

    // who is turn
    setIsXNext(!isXNext);
  };

  // Check if someone won!
  const calculateWinner = (squares) => {
    const winningCells = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of winningCells) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  // undo move
  const undoHandler = () => {
    if (currentMove > 0) {
      const prevMove = currentMove - 1;
      const prevBoard = historyOfGame[prevMove]?.board;
      if (prevBoard) {
        setBoard(prevBoard);
        setIsXNext(prevMove % 2 === 0);
        setCurrentMove(prevMove);
      } else {
        console.error("No valid board found in history.");
      }
    }
  };

  // Redo move
  const redoHandler = () => {
    if (currentMove < historyOfGame.length - 1) {
      const nextMove = currentMove + 1;
      setBoard(historyOfGame[nextMove].board);
      setIsXNext(nextMove % 2 === 0);
      setCurrentMove(nextMove);
    }
  };

  // Reset game
  const resetGameHandler = () => {
    setBoard(initializeBoard());
    setHistoryOfGame([{ board: initializeBoard(), player: null, move: null }]);
    setCurrentMove(0);
    setIsXNext(true);
    setIsDraw(false);
    setWinner(null);

    // clear localStorage after reset
    localStorage.clear();
  };
  return (
    <div className="mt-[10vh] lg:mt-[1vh] lg:flex lg:gap-x-10 ">
      <div className=" lg:flex-2">
        <div className=" flex justify-center ">
          <div>
            {open ? (
              <Modal
                setOpen={setOpen}
                isDraw={isDraw}
                resetGameHandler={resetGameHandler}
              >
                {isDraw ? (
                  <p className="text-lg font-bold">Its a draw!</p>
                ) : (
                  <img src={winner == "X" ? "x.svg" : "o.png"} />
                )}
              </Modal>
            ) : isXNext ? (
              <img
                src="player1.svg"
                className="w-[70%] lg:w-fit object-contain "
              />
            ) : (
              <img
                src="player2.svg"
                className="w-[70%] lg:w-fit  object-contain "
              />
            )}
          </div>
        </div>
        <div className=" max-md:rounded-[20px] rounded-[3rem] m-auto p-[10px] bg-black md:max-w-[640px] border-black border border-l-[30px] border-b-[30px] border-t-[10px] border-r-[10px] max-md:border-l-[5px] max-md:border-b-[5px] max-md:border-r-[1px] max-md:border-t-[1px]">
          <div className="bg-white grid grid-cols-3 gap-[5px] rounded-2xl md:p-[3rem] p-[1rem]   ">
            {board?.map((innerValue, index) => (
              <button
                key={index}
                disabled={winner}
                onClick={() => handleClick(index)}
                className="disabled:cursor-default pt-[90%] relative max-md:border-t-[3px] max-md:border-r-[3px] max-md:border-b-[7px] max-md:border-l-[7px] md:w-[150px] md:h-[150px]  border max-md:rounded-[8px] rounded-2xl border-t-[6px] border-r-[6px] border-b-[11px] border-l-[11px] bg-[#c9f9fc] cursor-pointer"
              >
                {innerValue === "X" ? (
                  <Player src={"x.svg"} />
                ) : innerValue === "O" ? (
                  <Player src={"o.png"} />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center max-lg:flex-col-reverse mt-1.5 ">
        <HistoryOfMovment
          historyOfGame={historyOfGame}
          setBoard={setBoard}
          setCurrentMove={setCurrentMove}
          setIsXNext={setIsXNext}
          currentMove={currentMove}
        />
        <div className=" gap-x-1 flex justify-center items-center max-lg:mt-1.5">
          <Button
            disabled={currentMove == 0}
            clickHandler={undoHandler}
            color={"#FBB500"}
          >
            UNDO
          </Button>
          <Button
            disabled={currentMove === historyOfGame.length - 1}
            clickHandler={redoHandler}
            color={"#C9F9FC"}
          >
            REDO
          </Button>
          <Button clickHandler={resetGameHandler} color={"#ffcdd2 "}>
            RESET
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
