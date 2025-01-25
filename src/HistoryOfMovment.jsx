import React from "react";

const HistoryOfMovment = ({
  historyOfGame,
  setIsXNext,
  setBoard,
  setCurrentMove,
  currentMove
}) => {
  const jumpToClickedState = (moveIndex) => {
    const jumpToMove = historyOfGame[moveIndex];
    setBoard(jumpToMove.board);
    setCurrentMove(moveIndex);
    setIsXNext(moveIndex % 2 === 0);
  };
  return (
    <div className=" xl:mt-16 xl:mr-10 xl:w-[500px]  lg:w-[400px]  max-2xl:mt-[80px] md:w-[500px] max-lg:m-auto max-[768px]:w-[450px] max-lg:mt-10 max-[500px]:w-[320px] rounded-[20px] p-[10px] bg-white border-black border-4 mb-10 h-[50vh] overflow-y-scroll ">
    <h3 className="font-bold md:text-2xl text-sm">Moveing History :</h3>
      <ul>
        {historyOfGame.map((moveInfo, index) => (
          <li key={index} className={`font-semibold p-2 rounded-[10px] my-1 border-2 even:bg-[#C9F9FC] odd:bg-red-100 ${index === currentMove ? "border-[3px] border-dashed" : ""}`}>
            <button
              onClick={() => jumpToClickedState(index)}
              className={` cursor-pointer w-full text-left`}
            >
              {index === 0
                ? "Game Start"
                : `Move ${index}: Player ${moveInfo.player} - Row ${moveInfo.move[0]}, Column ${moveInfo.move[1]}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryOfMovment;
