import React from 'react';
import GiftIcon from './icons/GiftIcon';

interface FloatingItemProps {
  x: number;
  y: number;
  onClick: () => void;
}

const FloatingItem: React.FC<FloatingItemProps> = ({ x, y, onClick }) => {
  return (
    <>
      <style>
        {`
          @keyframes bob {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-10px) scale(1.05);
            }
          }
          .animate-bob {
            animation: bob 3s ease-in-out infinite;
          }
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(255, 255, 10, 0.7));
            }
            50% {
               filter: drop-shadow(0 0 15px rgba(255, 255, 10, 1));
            }
          }
          .animate-glow {
             animation: glow 2.5s ease-in-out infinite;
          }
        `}
      </style>
      <button
        onClick={onClick}
        className="absolute z-20 p-2 rounded-full cursor-pointer animate-bob animate-glow"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-label="Collect bonus"
      >
        <GiftIcon className="w-10 h-10 text-yellow-300" />
      </button>
    </>
  );
};

export default FloatingItem;
