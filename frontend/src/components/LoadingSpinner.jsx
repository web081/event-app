import React, { useState, useEffect, useCallback } from "react";
import { RotatingLines } from "react-loader-spinner";

const LoadingComponent = ({ isDataReady = false }) => {
  const [text, setText] = useState("");
  const fullText = "The Autograph";
  const typingSpeed = 150;
  const pauseBetweenAnimations = 1000;

  useEffect(() => {
    let timeoutId = null;
    let currentIndex = 0;
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating || isDataReady) return;

      if (currentIndex < fullText.length) {
        // Typing phase
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(animate, typingSpeed);
      } else {
        // Reset phase
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          setText("");
          timeoutId = setTimeout(animate, typingSpeed);
        }, pauseBetweenAnimations);
      }
    };

    // Start the animation
    animate();

    // Cleanup function
    return () => {
      isAnimating = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDataReady]); // Only re-run if isDataReady changes

  if (isDataReady) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
        <h1 className="text-2xl font-light text-HeroClr">{text}</h1>
      </div>
    </div>
  );
};

export default LoadingComponent;
