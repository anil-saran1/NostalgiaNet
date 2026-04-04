import React from "react";

interface CircularProgressProp {
  percent: number;
}

const CircularProgress: React.FC<CircularProgressProp> = ({ percent }) => {
  return (
    <div
      className={`relative size-14 scale-90
    ${percent < 40 && "text-green-500"} ${
        percent >= 40 && percent < 80 && "text-blue-500"
      }  ${percent >= 80 && "text-red-500"}
      transition-all duration-300`}

    >
      <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-black "
          strokeWidth="1"
          strokeDasharray="75 100"
          strokeLinecap="round"
        ></circle>

        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className={`stroke-current transition-all duration-500 ease-in-out}`}
          strokeWidth="2"
          strokeDasharray={`calc(75 * ${percent} / 100) 100`}
          strokeLinecap="round"
        ></circle>
      </svg>

      <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-sm font-bold">{percent}%</span>
      </div>
    </div>
  );
};

export default CircularProgress;
