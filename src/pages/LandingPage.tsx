import React, { useState } from "react";
import FloatingDiv from "../components/LandingPage/FloatingDiv";
import Navbar from "../components/LandingPage/Navbar";
import bgImage from "../assets/bgp.jpg";
import Home from "../components/LandingPage/Home";
import About from "../components/LandingPage/About";
import Features from "../components/LandingPage/Features";
import { AnimatePresence, motion } from "framer-motion"; 

const LandingPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<
    "Home" | "About" | "Features" | "Pricing"
  >("Home");

  const setOption = (option: "Home" | "About" | "Features" | "Pricing") => {
    setSelectedOption(option);
  };

  const transitionVariants = {
    enter: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 0,
      filter: "blur(20px)",
      transition: { duration: 0.4, ease: "easeIn" },
    },
    initial: {
      opacity: 0,
      y: 100,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

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
      <FloatingDiv>
        <Navbar selectedOption={selectedOption} setSelectedOption={setOption} />
        <div className="flex-1 overflow-auto ">
          <AnimatePresence mode="wait">
            {selectedOption === "Home" && (
              <motion.div
                key="home"
                variants={transitionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full h-full"
              >
                <Home />
              </motion.div>
            )}
            {selectedOption === "About" && (
              <motion.div
                key="about"
                variants={transitionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <About />
              </motion.div>
            )}
            {selectedOption === "Features" && (
              <motion.div
                key="features"
                variants={transitionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full h-full"
              >
                <Features />
              </motion.div>
            )}
            {/* Add other sections as needed */}
          </AnimatePresence>
        </div>
      </FloatingDiv>
    </div>
  );
};

export default LandingPage;
