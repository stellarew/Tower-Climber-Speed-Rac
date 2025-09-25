import React from 'react';
import CoinIcon from './icons/CoinIcon';
import TrophyIcon from './icons/TrophyIcon';
import ShoeIcon from './icons/ShoeIcon';
import SpeedIcon from './icons/SpeedIcon';
import AutoClaimIcon from './icons/AutoClaimIcon';

interface ControlsPanelProps {
  onUpgradeSpeed: () => void;
  onUpgradeShoes: () => void;
  onClaimTrophy: () => void;
  onPurchaseAutoClaim: () => void;
  onUnlockNextTower: () => void;
  upgradeCost: number;
  shoeUpgradeCost: number;
  autoClaimCost: number;
  trophyCost: number;
  coins: number;
  isAtTop: boolean;
  autoClaimUnlocked: boolean;
  canUnlockNext: boolean;
}

const UpgradeButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  cost: number;
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
      <span>{Math.ceil(cost).toLocaleString()}</span>
    </div>
  </button>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({ 
  onUpgradeSpeed, 
  onUpgradeShoes,
  onClaimTrophy,
  onPurchaseAutoClaim,
  onUnlockNextTower,
  upgradeCost, 
  shoeUpgradeCost,
  autoClaimCost,
  trophyCost,
  coins, 
  isAtTop,
  autoClaimUnlocked,
  canUnlockNext,
}) => {

  if (isAtTop) {
    return (
      <button
        onClick={onClaimTrophy}
        className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-black font-bold py-4 px-4 rounded-lg shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 animate-pulse"
      >
        <TrophyIcon className="w-6 h-6" />
        <span className="text-lg">CLAIM TROPHY</span>
      </button>
    );
  }
  
  if (canUnlockNext) {
    return (
      <button
        onClick={onUnlockNextTower}
        className="w-full flex flex-col items-center justify-center space-y-1 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/30 hover:bg-purple-500 transition-all duration-200 transform hover:scale-105"
      >
        <div className="flex items-center space-x-2">
          <TrophyIcon className="w-6 h-6" />
          <span className="text-lg">UNLOCK NEXT TOWER</span>
        </div>
        <div className="flex items-center text-xs bg-black/30 rounded-full px-2 py-0.5">
          <span>Cost: {trophyCost.toLocaleString()} Trophies</span>
        </div>
      </button>
    )
  }

  return (
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
      {!autoClaimUnlocked && (
        <UpgradeButton
          onClick={onPurchaseAutoClaim}
          disabled={coins < autoClaimCost}
          cost={autoClaimCost}
          label="Auto Claim"
          icon={<AutoClaimIcon className="w-5 h-5" />}
        />
      )}
    </div>
  );
};

export default ControlsPanel;
