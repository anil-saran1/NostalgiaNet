import React, { useState } from "react";
import '../App.css'; 

interface Slide {
  id: number;
  imageUrl: string;
}

const slides: Slide[] = [
  { id: 1, imageUrl: "/card-image-1.png" },
  { id: 2, imageUrl: "/card-image-2.png" },
  { id: 3, imageUrl: "/card-image-3.png" }, 
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };
  

  return (
    <div className="w-full h-40">
      {/* Left Arrow */}
      <button className="arrow-btn left-arrow" onClick={handlePrev}>
        &lt;
      </button>

      {/* Slide */}
      <div className="h-40 w-auto">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`h-40 w-auto ${index === currentIndex ? "active" : ""}`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            <img
              src={slide.imageUrl}
              alt={`Slide ${index + 1}`}
              className="slide-img"
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button className="arrow-btn right-arrow" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default Slider;
