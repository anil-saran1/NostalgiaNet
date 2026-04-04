import React, { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import chroma from "chroma-js"; 
import calculateTimeLeft from "./utils/calculateTimeLeft";
import onVaultOpen from "./utils/onVaultOpen";

interface VaultProp {
  id: string;
  createdAt: number;
  name: string;
  openAt: number;
  setMainExpanded: (value: boolean) => void;
  canExpand?: boolean;
}

const generateColor = (seed: string) => {
  const rng = seedrandom(seed);
  const hue = rng() * 360;
  const saturation = 0.5 + rng() * 0.1;
  const lightness = 0.4 + rng() * 0.4;
  return chroma.hsl(hue, saturation, lightness).hex();
};

const getDarkerColor = (hexColor: string, factor: number): string => {
  return chroma(hexColor).darken(factor).hex();
};

const getLighterColor = (hexColor: string, factor: number): string => {
  return chroma(hexColor).brighten(factor).hex();
};

const Vault: React.FC<VaultProp> = ({
  id,
  name,
  openAt,
  createdAt,
  setMainExpanded,
  canExpand=true
}) => {
  const color = generateColor(id);
  const darkerColor = getDarkerColor(color, 1);
  const lighterColor = getLighterColor(color, 1.5);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const now = Date.now();
    const calculatedTimeLeft = calculateTimeLeft(openAt, now);

    setTimeLeft(calculatedTimeLeft);
    const timerId = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft(openAt, Date.now());
      setTimeLeft(updatedTimeLeft);
    }, 100000);

    return () => clearInterval(timerId);
  }, [openAt]);

  return (
    <div
      className={`flex-[0_0_auto] size-40 xl:size-48 drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] ${
        expanded ? "w-80 xl:w-96" : ""
      } rounded-2xl xl:rounded-3xl  flex flex-col justify-end items-end transition-all duration-300`}
      style={{ backgroundColor: color }}
    >
      {!expanded && (
        <div className="flex-1 mx-2">
          <img src="/tripleDot.svg" alt="" />
        </div>
      )}
      <div
        onMouseEnter={() => {
          canExpand && setExpanded(true);
          setMainExpanded(true);
        }}
        onMouseLeave={() => {
          setExpanded(false);
          setMainExpanded(false);
        }}
        className={`w-full h-[80%] flex flex-row justify-center items-center hover:h-full rounded-2xl xl:rounded-3xl ease-in-out transition-all duration-300`}
      >
        <div className="flex-1 transition-all ease-in-out flex flex-row h-full justify-center rounded-2xl xl:rounded-3xl  items-center ">
          <div className="flex-[1_1_0] bg-[rgba(0,0,0,0.6)] transition-all ease-in-out h-full flex flex-col gap-2 justify-center rounded-2xl xl:rounded-3xl  items-center">
            {!expanded && (
              <div
                className={`font-ABeeZee  ${
                  expanded ? "text-white" : "text-[rgba(255,255,255,0.6)]"
                }  text-xs lg:text-[14px]`}
              >
                {name}
              </div>
            )}

            <div
              className={`${
                expanded ? "gap-5 w-1/2 h-4/5 " : "gap-3 w-4/5"
              } bg-[rgba(0,0,0,0.7)] flex rounded-full transition-all ease-in-out duration-300 justify-center items-center flex-col`}
            >
              <div
                className={` h-auto p-3 justify-center items-center flex rounded-full w-full" } `}
              >
                <svg
                  width="8"
                  height="24"
                  viewBox="0 0 8 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4" r="4" fill="#D9D9D9" />
                  <rect x="2" y="4" width="4" height="20" fill="#D9D9D9" />
                </svg>
              </div>
              {expanded && (
                <div
                  className={`font-ABeeZee  ${
                    expanded ? "text-white" : "text-[rgba(255,255,255,0.6)]"
                  } text-xs`}
                >
                  {timeLeft==="N/A" ? <button onClick={() => onVaultOpen(id)}>
                    Open
                  </button> : timeLeft}
                </div>
              )}
            </div>
            {!expanded && (
              <div
                className={`font-ABeeZee  ${
                  expanded ? "text-white" : "text-[rgba(255,255,255,0.6)]"
                } text-xs`}
              >
                {timeLeft==="N/A" ? <button onClick={() => onVaultOpen(id)}>
                    Open
                  </button> : timeLeft}
              </div>
            )}
          </div>
          {expanded && (
            <div
              className="flex-[2_1_0] flex flex-col h-full justify-center rounded-2xl xl:rounded-3xl  shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.3)] items-center transition-all duration-300 ease-in-out opacity-100"
              style={{ backgroundColor: color }}
            >
              <div
                className={` flex flex-col
                   text-[10px] font-semibold font-Poppins 
                   text-[#6F6F6F] justify-center rounded-2xl xl:rounded-3xl h-[80%] w-auto p-4 items-center  gap-2 xl:gap-3`}
                style={{
                  backgroundColor: lighterColor,
                  border: "3px solid",
                  borderColor: darkerColor,
                }}
              >
                <div className="">{name}</div>
                <div className=" flex flex-row w-full gap-1 justify-between p-1 px-2 rounded-full" style={{backgroundColor: getLighterColor(color, 1)}}>
                  <span className="flex flex-row gap-2 font-normal justify-between items-center">
                    <img src="/clock.svg" className="size-3" alt="" /> Created
                    At:
                  </span>{" "}
                  {new Date(createdAt).toLocaleDateString()}
                </div>
                <div className=" flex flex-row w-full gap-1 justify-between p-1 px-2 rounded-full" style={{backgroundColor: getLighterColor(color, 1)}}>
                  <span className=" flex flex-row gap-2 font-normal justify-between items-center">
                    <img src="/stopwatch.svg" className="size-3" alt="" />
                    Unlocks on:
                  </span>{"  "}
                  {new Date(openAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vault;
