import React, { ReactNode } from "react";

interface FloatingDivProps {
  children: ReactNode;
}

const FloatingDiv: React.FC<FloatingDivProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center scale-90 transition-all duration-500 3xl:scale-100">
      <div
        className="bg-black bg-opacity-80 p-6 flex flex-col rounded-[40px] w-full xl:w-4/5 max-h-[100%] h-max transition-all duration-500 "
      >
        {children}
      </div>
    </div>
  );
};

export default FloatingDiv;
