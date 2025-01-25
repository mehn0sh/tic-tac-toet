import React from "react";

const Button = ({ children, clickHandler, disabled,color }) => {
  return (
    <button style={{background:color}} onClick={clickHandler} disabled={disabled} className={`disabled:cursor-default   h-fit font-bold md:text-2xl text-sm border-[5px] rounded-[10px] pb-[3px]  px-[24px] cursor-pointer border-b-[6px] border-l-[6px] `}>
      {children}
    </button>
  );
};

export default Button;
