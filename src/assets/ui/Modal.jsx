import React from "react";
import { HiOutlineX } from "react-icons/hi";

const Modal = ({ children, setOpen, isDraw,resetGameHandler }) => {
  const colseModalHandler=()=>{
    setOpen(false)
    resetGameHandler()
  }
  return (
    <div className="backdrop-blur-sm fixed top-0 left-0 w-full h-full z-50">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 shadow-lg transition-all duration-500 ease-out w-[calc(100vw-1rem)] md:max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-black pb-2 mb-6">
          <p className=" font-bold text-2xl ">
            {isDraw ? "👀Oops! no body won!" : "🎉 the player who won is :"}
          </p>
          <button className="cursor-pointer" onClick={() =>colseModalHandler() }>
            <HiOutlineX className="w-10 h-10 " />
          </button>
        </div>
        <div className="flex justify-center">

        {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
