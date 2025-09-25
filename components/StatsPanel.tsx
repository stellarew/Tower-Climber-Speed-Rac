import React from 'react';
import type { GameState } from '../types';
import CoinIcon from './icons/CoinIcon';
import SpeedIcon from './icons/SpeedIcon';

interface StatsPanelProps {
  gameState: GameState;
  currentSpeed: number;
  onToggleAutoNext: () => void;
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string; subValue?: string; colorClass: string }> = ({ icon, label, value, subValue, colorClass }) => (
  <div className={`flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 ${colorClass}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="flex items-baseline space-x-2">
        <p className="text-lg font-bold font-orbitron">{value}</p>
        {subValue && <p className="text-xs font-medium text-gray-300">({subValue})</p>}
      </div>
    </div>
  </div>
);

const Toggle: React.FC<{label: string, enabled: boolean, onToggle: () => void}> = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between col-span-2 p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
    <span className="text-sm text-gray-300">{label}</span>
    <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);


const StatsPanel: React.FC<StatsPanelProps> = ({ gameState, currentSpeed, onToggleAutoNext }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <StatItem
        icon={<CoinIcon className="w-8 h-8" />}
        label="Coins"
        value={Math.floor(gameState.coins).toLocaleString()}
        colorClass="text-yellow-300"
      />
      <StatItem
        icon={<SpeedIcon className="w-8 h-8" />}
        label="Speed"
        value={`${currentSpeed.toFixed(2)} m/s`}
        subValue={`Spd Lvl ${gameState.speedLevel} / Shoe Lvl ${gameState.shoeLevel}`}
        colorClass="text-cyan-300"
      />
      <Toggle 
        label="Auto-Next Tower"
        enabled={gameState.autoNextTowerEnabled}
        onToggle={onToggleAutoNext}
      />
    </div>
  );
};

export default StatsPanel;
