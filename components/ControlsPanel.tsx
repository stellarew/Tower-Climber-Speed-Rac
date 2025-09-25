import React from 'react';
import CoinIcon from './icons/CoinIcon';
import TrophyIcon from './icons/TrophyIcon';
import ShoeIcon from './icons/ShoeIcon';
import SpeedIcon from './icons/SpeedIcon';
import SaveIcon from './icons/SaveIcon';
import LoadIcon from './icons/LoadIcon';
import ClickerIcon from './icons/ClickerIcon';
import { formatNumber } from '../utils/formatNumber';
import { TOWER_HEIGHTS } from '../constants';

interface ControlsPanelProps {
  onUpgradeSpeed: () => void;
  onUpgradeShoes: () => void;
  onUpgradeClicker: () => void;
  onClaimTrophy: () => void;
  onUnlockNextTower: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  upgradeCost: bigint;
  shoeUpgradeCost: bigint;
  clickerUpgradeCost: bigint;
  trophyCost: bigint;
  coins: bigint;
  isAtTop: boolean;
  canUnlockNext: boolean;
  saveMessage: string;
  highestTowerUnlocked: number;
}

const UpgradeButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  cost: bigint;
  label: string;
  icon: React.ReactNode;
  costIcon?: React.ReactNode;
  colorClass?: string;
}> = ({ onClick, disabled, cost, label, icon, costIcon, colorClass = 'bg-cyan-600 shadow-cyan-500/20' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 text-white font-bold py-2 px-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:bg-gray-600 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed flex flex-col items-center justify-center space-y-1 ${colorClass}`}
  >
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <div className="flex items-center text-xs bg-black/30 rounded-full px-2 py-0.5">
      {costIcon || <CoinIcon className="w-3 h-3 mr-1 text-yellow-300" />}
      <span>{formatNumber(cost)}</span>
    </div>
  </button>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({ 
  onUpgradeSpeed, 
  onUpgradeShoes,
  onUpgradeClicker,
  onClaimTrophy,
  onUnlockNextTower,
  onSaveGame,
  onLoadGame,
  upgradeCost, 
  shoeUpgradeCost,
  clickerUpgradeCost,
  trophyCost,
  coins, 
  isAtTop,
  canUnlockNext,
  saveMessage,
  highestTowerUnlocked,
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-2">
        <button
          onClick={onClaimTrophy}
          disabled={!isAtTop}
          className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-black font-bold py-4 px-4 rounded-lg shadow-lg shadow-yellow-500/20 transition-all duration-200 transform enabled:hover:bg-yellow-400 enabled:hover:scale-105 enabled:animate-pulse disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <TrophyIcon className="w-6 h-6" />
          <span className="text-lg">CLAIM TROPHY</span>
        </button>

        {highestTowerUnlocked < TOWER_HEIGHTS.length && (
           <button
             onClick={onUnlockNextTower}
             disabled={!canUnlockNext}
             className="w-full flex flex-col items-center justify-center space-y-1 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-200 transform enabled:hover:bg-purple-500 enabled:hover:scale-105 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
           >
             <div className="flex items-center space-x-2">
               <TrophyIcon className="w-6 h-6" />
               <span className="text-lg">UNLOCK NEXT TOWER</span>
             </div>
             <div className="flex items-center text-xs bg-black/30 rounded-full px-2 py-0.5">
               <span>Cost: {formatNumber(trophyCost)} Trophies</span>
             </div>
           </button>
        )}
      </div>
      <div className="flex w-full space-x-2">
        <UpgradeButton
          onClick={onUpgradeSpeed}
          disabled={coins < upgradeCost}
          cost={upgradeCost}
          label="Speed"
          icon={<SpeedIcon className="w-5 h-5" />}
        />
        <UpgradeButton
          onClick={onUpgradeShoes}
          disabled={coins < shoeUpgradeCost}
          cost={shoeUpgradeCost}
          label="Shoes"
          icon={<ShoeIcon className="w-5 h-5" />}
        />
        <UpgradeButton
          onClick={onUpgradeClicker}
          disabled={coins < clickerUpgradeCost}
          cost={clickerUpgradeCost}
          label="Clicker"
          icon={<ClickerIcon className="w-5 h-5" />}
          colorClass="bg-green-600 shadow-green-500/20"
        />
      </div>
      <div className="relative flex w-full space-x-2 pt-2 border-t border-gray-700/50 mt-1">
        <button
            onClick={onSaveGame}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 text-gray-300 font-bold py-2 px-2 rounded-lg shadow-lg transition-all duration-200 transform hover:bg-gray-600 hover:scale-105"
            aria-label="Save game"
        >
            <SaveIcon className="w-5 h-5" />
            <span className="text-sm">Save</span>
        </button>
        <button
            onClick={onLoadGame}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 text-gray-300 font-bold py-2 px-2 rounded-lg shadow-lg transition-all duration-200 transform hover:bg-gray-600 hover:scale-105"
            aria-label="Load game"
        >
            <LoadIcon className="w-5 h-5" />
            <span className="text-sm">Load</span>
        </button>
        {saveMessage && (
          <div key={saveMessage} className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-900/80 px-3 py-1 rounded-md animate-fade-in-out pointer-events-none">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsPanel;