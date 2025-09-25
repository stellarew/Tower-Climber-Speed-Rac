import React from 'react';
import UpArrowIcon from './icons/UpArrowIcon';
import FloatingItem from './FloatingItem';
import CoinIcon from './icons/CoinIcon';
import { formatNumber } from '../utils/formatNumber';

interface GameDisplayProps {
  height: number;
  towerHeight: number;
  floatingItem: { id: number; x: number; y: number } | null;
  onCollectFloatingItem: () => void;
  onClicker: (event: React.MouseEvent<HTMLButtonElement>) => void;
  clickEffects: { id: number; x: number; y: number; amount: number }[];
}

const GameDisplay: React.FC<GameDisplayProps> = ({ height, towerHeight, floatingItem, onCollectFloatingItem, onClicker, clickEffects }) => {
  const progressPercent = (height / towerHeight) * 100;

  return (
    <button 
      onClick={onClicker}
      className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-inner shadow-black/50 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      aria-label="Click to earn coins"
    >
      {/* Background Tower Pattern */}
      <div 
        className="absolute top-0 left-0 w-full h-[200%] bg-[length:40px_40px] bg-repeat-y pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(31, 41, 55, 0) 0%, rgba(31, 41, 55, 0) 49.5%, #4f46e5 50%, rgba(31, 41, 55, 0) 50.5%, rgba(31, 41, 55, 0) 100%)`,
          transform: `translateY(-${progressPercent}%)`,
          transition: 'transform 0.1s linear'
        }}
      ></div>

      {/* Click Effects */}
      {clickEffects.map(effect => (
        <div
          key={effect.id}
          className="absolute text-yellow-300 font-bold pointer-events-none animate-float-up z-30 flex items-center drop-shadow-lg"
          style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
        >
          <CoinIcon className="w-4 h-4 mr-1"/>
          <span>+{formatNumber(effect.amount)}</span>
        </div>
      ))}

      {/* Floating Item */}
      {floatingItem && (
        <FloatingItem
          x={floatingItem.x}
          y={floatingItem.y}
          onClick={onCollectFloatingItem}
        />
      )}
      
      {/* Player Icon */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-8 h-8 flex items-center justify-center pointer-events-none">
        <div className="absolute w-8 h-8 bg-cyan-400 rounded-full blur-md animate-pulse"></div>
        <UpArrowIcon className="relative z-10 w-8 h-8 text-cyan-200 drop-shadow-lg" />
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-700/50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-100 ease-linear"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      {/* Height Text */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full font-orbitron text-sm pointer-events-none">
        {height.toFixed(1)}m / {towerHeight.toLocaleString()}m
      </div>
    </button>
  );
};

export default GameDisplay;
