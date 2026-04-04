// CustomCursor.tsx
import React, { useState, useEffect } from "react";
import defaultCursor from "./assets/cursors/default.png";
import linkCursor from "./assets/cursors/link.png";
import loadingCursor from "./assets/cursors/doing.gif";
import "./CustomCursor.css";

type Position = {
  x: number;
  y: number;
};

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<string>("default");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [deviceType, setDeviceType] = useState<string>("mouse");

  // Check if the device is a touch device
  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      setDeviceType("touch");
      return true;
    } catch (e) {
      setDeviceType("mouse");
      return false;
    }
  };
 
  useEffect(() => {
    isTouchDevice();
  }, []);
 
  useEffect(() => {
    if (deviceType === "touch") return;

    const updatePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });

      const isOut =
        clientX <= 0 ||
        clientX >= window.innerWidth - 10 ||
        clientY <= 5 ||
        clientY >= window.innerHeight;
      setIsVisible(!isOut);
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, [deviceType]);

  useEffect(() => {
    if (deviceType === "touch") return;

    const handleMouseEnterLink = () => setCursorType("link");
    const handleMouseLeaveLink = () => setCursorType("default");

    // Observe if any loading popups are visible to change cursor state
    const observer = new MutationObserver(() => {
      const isBusyPopupVisible = document.querySelector(".busy-popup") !== null;
      setCursorType(isBusyPopupVisible ? "loading" : "default");
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Detect hover for clickable elements
    const handleCursorChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(".link-pointer") || target.tagName === "BUTTON") {
        handleMouseEnterLink();
      }
    };

    document.addEventListener("mouseover", handleCursorChange);
    document.addEventListener("mouseout", handleMouseLeaveLink);

    return () => {
      document.removeEventListener("mouseover", handleCursorChange);
      document.removeEventListener("mouseout", handleMouseLeaveLink);
      observer.disconnect();
    };
  }, [deviceType]);

  const getCursorImage = (): string => {
    if (cursorType === "link") return linkCursor; 
    return defaultCursor;
  };

  return (
    <>
      {deviceType !== "touch" && (
        <div
          className={`size-8 bg-cover pointer-events-none z-[1000] ${
            isVisible ? "fixed" : "hidden"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            backgroundImage: `url(${getCursorImage()})`,
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
