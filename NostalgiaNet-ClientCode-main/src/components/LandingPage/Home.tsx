import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import catUrl from "../../assets/cat.jpg";
import swingUrl from "../../assets/swing.jpg";
import hallUrl from "../../assets/hall.jpg";
import flowerUrl from "../../assets/flower.jpg";

import { AnimatePresence, motion } from "framer-motion";

import { FaDiscord, FaInstagram } from "react-icons/fa";

const images = [catUrl, swingUrl, hallUrl, flowerUrl];

const Home: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const transitionVariants = {
    enter: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      filter: "blur(20px)",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <section className="flex flex-row lg:flex-row items-center justify-between py-8 gap-8">
      <div className="w-full lg:w-3/5 flex flex-col min-h-[500px] justify-between pl-4">
        <div className="flex flex-col justify-center items-center">
          <h1 className="lg:text-5xl text-4xl font-bold text-white text-center font-Khyay p-3">
            For you, <br></br>
            Years from now
          </h1>
          <p className="text-white text-center text-sm font-ABeeZee font-thin p-4">
            Preserve your cherished images and videos with NostalgiaNet. Our
            website allows you to securely store memories, unlocking them at
            special moments in the future to relive and cherish forever.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#50535C] hover:bg-black text-white border border-white my-3 py-2 px-6 rounded-3xl block mx-auto"
          >
            Get Started
          </button>
        </div>

        <div className="md:flex hidden flex-row">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className={`bg-white ${
                index === currentImage ? "p-1" : "link-pointer hover-button"
              }  m-auto overflow-hidden shadow-md size-40 rounded-[20%] md:size-16 lg:size-24 2xl:size-28 xl:rounded-3xl`}
              onClick={() => setCurrentImage(index)}
            >
              <img
                src={imgUrl}
                className="xl:rounded-3xl rounded-[20%] object-cover size-full"
                alt=""
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="hover:text-gray-700 bg-white my-2 size-8 p-1 rounded-full" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-gray-700 bg-white my-2 size-8 p-1 rounded-full" />
          </a>
        </div>
      </div>
      {/* Right Part (Slider) */}
      <div className="w-full lg:w-2/5">
        <div className="h-3/5 mx-auto lg:w-96 w-[280px] flex overflow-hidden justify-end items-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt={`Slide ${currentImage + 1}`}
              className="object-cover rounded-[48px] min-h-[400px] max-h-[400px] lg:max-h-[500px] w-auto lg:min-h-[500px]"
              variants={transitionVariants}
              initial="exit"
              animate="enter"
              exit="exit"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Home;
