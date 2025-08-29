import React from 'react';
import './ButterflyLoader.css';

const ButterflyLoader = ({ size = 120, text = "Loading...", showText = true }) => {
  return (
    <div className="butterfly-loader-container">
      <div className="butterfly-loader" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Wing */}
          <path
            d="M100,100 C40,20 10,90 60,120 C20,160 60,180 90,140 Z"
            fill="yellow"
            stroke="black"
            strokeWidth="3"
            className="wing left-wing"
          />
          {/* Right Wing */}
          <path
            d="M100,100 C160,20 190,90 140,120 C180,160 140,180 110,140 Z"
            fill="yellow"
            stroke="black"
            strokeWidth="3"
            className="wing right-wing"
          />
          {/* Butterfly body */}
          <rect x="95" y="90" width="10" height="40" rx="5" fill="black" />
          <circle cx="100" cy="80" r="8" fill="black" />
          {/* Antennae */}
          <path d="M100 80 C90 60, 70 50, 60 40" stroke="black" strokeWidth="2" fill="none"/>
          <path d="M100 80 C110 60, 130 50, 140 40" stroke="black" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      {showText && (
        <p className="butterfly-loader-text">
          {text}
        </p>
      )}
    </div>
  );
};

export default ButterflyLoader;
