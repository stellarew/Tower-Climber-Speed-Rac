import React from 'react';
import CoinIcon from './icons/CoinIcon';
import TrophyIcon from './icons/TrophyIcon';
import { formatNumber } from '../utils/formatNumber';

interface OfflineProgressModalProps {
  gains: { coins: bigint; trophies: bigint };
  onClose: () => void;
}

const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({ gains, onClose }) => {
  if (gains.coins <= 0n && gains.trophies <= 0n) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-sm flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-center text-cyan-300 font-orbitron">WELCOME BACK!</h2>
        </header>
        <div className="p-6 text-center">
          <p className="text-gray-300 mb-4">While you were away, your climber earned:</p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3 p-3 bg-gray-900/50 rounded-lg text-yellow-300">
              <CoinIcon className="w-8 h-8" />
              <div>
                <p className="text-lg font-bold font-orbitron">{formatNumber(gains.coins)}</p>
                <p className="text-xs text-gray-400">Coins</p>
              </div>
            </div>
            {gains.trophies > 0n && (
              <div className="flex items-center justify-center space-x-3 p-3 bg-gray-900/50 rounded-lg text-yellow-300">
                <TrophyIcon className="w-8 h-8" />
                <div>
                  <p className="text-lg font-bold font-orbitron">{formatNumber(gains.trophies)}</p>
                  <p className="text-xs text-gray-400">Trophies</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="p-4 border-t border-gray-700">
           <button 
             onClick={onClose}
             className="w-full text-center text-white bg-cyan-600 hover:bg-cyan-500 transition-colors py-2 rounded-lg font-bold"
           >
             Continue
           </button>
        </footer>
      </div>
    </div>
  );
};

export default OfflineProgressModal;
