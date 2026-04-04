import { useNavigate } from "react-router-dom";

const EmptyVault = () => {
  const navigate = useNavigate();
  return (
    <div className={`flex h-64 w-80 rounded-3xl overflow-hidden bg-[#666666]`}>
      <div className="h-full w-[40%] flex items-center justify-center">
        <div
          className={` bg-[rgba(0,0,0,0.5)] rounded-full h-2/3 p-6 flex items-center justify-center transition-all ease-in-out duration-300" } `}
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
      </div>
      <div className="h-full flex-1 font-Inter flex-col bg-white rounded-3xl flex shadow-[inset_0px_5px_12px_rgba(0,0,0,0.5)]">
        <div className=" h-[30%] flex font-semibold items-center justify-center text-lg w-full">
          TimeVault
        </div>
        <div className="flex-1 rounded-3xl bg-[#666666] w-full flex flex-col text-[10px]  border-2 border-white items-center text-sm text-white justify-between p-[15%]">
          Press create to make your first time vault!
          <button onClick={() => navigate('/capsulepage')} className="bg-[#333333] hover-button link-pointer transition-all duration-300 text-[8px] w-full py-2 rounded-full">Create</button>
        </div>
      </div>
    </div>
  );
};

export default EmptyVault;
