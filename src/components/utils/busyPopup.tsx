const BusyPopup = () => { 
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-[1000] busy-popup">
        <div className="w-full h-full backdrop-brightness-50 flex items-center justify-center z-10">
          <div className="loader w-12 h-12"></div> 
        </div>
      </div>
    );
  };
  
  export default BusyPopup;
  