import bgImage from "../assets/bgp.jpg";

const ComingSoon = () => {
  return (
    <div
      className="h-screen bg-cover bg-center fixed inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" h-20 w-full p-4 bg-black flex items-center bg-opacity-80 rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <img src="/nn.svg" alt="" />
          <span className="text-white text-lg font-SourceSans">NostalgiaNet</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center w-full max-h-[99%] ">
        <div
          className={`bg-black bg-opacity-80 w-11/12 transition-all duration-300 ease-in-out  
       min-h-[90%] h-auto max-h-[99%] flex-col gap-8 py-[10%] px-4 justify-center items-center rounded-[40px] flex overflow-auto relative`}
        >
          <span className="text-white text-4xl font-SourceSans">
            Mobile Version Coming Soon!
          </span>
          <img src="/catSpill.png" className="w-[90%] max-w-[350px] h-auto" alt="" />
          <span className="text-white text-sm font-ABeeZee">
            Our website is best viewed on a desktop at the moment. We're working
            hard to bring you an optimized mobile experience. Thank you for your
            patience!
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
