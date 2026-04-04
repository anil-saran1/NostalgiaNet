 import bgImage from "../../assets/bgp.jpg"

const LoadingAnimation = () => {
  return (
    <div
      className="h-screen bg-cover bg-center fixed inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <span className="sr-only">Loading</span>
      <div className="size-10 m-[2px] bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="size-10 m-[2px] bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="size-10 m-[2px] bg-black rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingAnimation;
