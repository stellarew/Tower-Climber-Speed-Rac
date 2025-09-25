import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState } from './types';
import { 
  TOWER_HEIGHTS, 
  TROPHIES_FOR_NEXT_TOWER, 
  INITIAL_SPEED_LEVEL, 
  INITIAL_UPGRADE_COST,
  UPGRADE_COST_MULTIPLIER,
  BASE_SPEED_PER_SECOND,
  INITIAL_SHOE_LEVEL,
  INITIAL_SHOE_UPGRADE_COST,
  SHOE_UPGRADE_COST_MULTIPLIER,
  SHOE_BONUS_PER_LEVEL,
  AUTO_CLAIM_COST,
} from './constants';
import GameDisplay from './components/GameDisplay';
import StatsPanel from './components/StatsPanel';
import ControlsPanel from './components/ControlsPanel';
import TrophyIcon from './components/icons/TrophyIcon';
import TowerSelectionModal from './components/TowerSelectionModal';
import ChevronDownIcon from './components/icons/ChevronDownIcon';


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Lazy initialization could be used here to load from localStorage in the future
    return {
      height: 0,
      coins: 0,
      trophies: 0,
      speedLevel: INITIAL_SPEED_LEVEL,
      upgradeCost: INITIAL_UPGRADE_COST,
      shoeLevel: INITIAL_SHOE_LEVEL,
      shoeUpgradeCost: INITIAL_SHOE_UPGRADE_COST,
      isAtTop: false,
      towerLevel: 1,
      highestTowerUnlocked: 1,
      autoClaimUnlocked: false,
      autoNextTowerEnabled: true,
    };
  });
  
  const [isTowerModalOpen, setTowerModalOpen] = useState(false);

  const lastUpdateTime = useRef<number>(0);
  const gameLoopRef = useRef<number>(0);

  const getCurrentTowerHeight = (level: number) => {
    const towerIndex = Math.min(level - 1, TOWER_HEIGHTS.length - 1);
    return TOWER_HEIGHTS[towerIndex];
  };

  const claimTrophyInternal = (prevState: GameState): GameState => {
    const newTrophies = prevState.trophies + 1;
    return {
      ...prevState,
      height: 0,
      trophies: newTrophies,
      isAtTop: false,
    };
  }

  // Effect to handle auto-progression to the next tower
  useEffect(() => {
    if (gameState.autoNextTowerEnabled && 
        gameState.trophies >= TROPHIES_FOR_NEXT_TOWER && 
        gameState.highestTowerUnlocked < TOWER_HEIGHTS.length) {
      handleUnlockNextTower();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.trophies, gameState.autoNextTowerEnabled]);


  const gameLoop = useCallback((timestamp: number) => {
    if (lastUpdateTime.current === 0) {
      lastUpdateTime.current = timestamp;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = (timestamp - lastUpdateTime.current) / 1000; // in seconds
    lastUpdateTime.current = timestamp;

    setGameState(prev => {
      if (prev.isAtTop) return prev;

      const currentTowerHeight = getCurrentTowerHeight(prev.towerLevel);
      const shoeBonus = 1 + (prev.shoeLevel * SHOE_BONUS_PER_LEVEL);
      const climbPerSecond = BASE_SPEED_PER_SECOND * prev.speedLevel * shoeBonus;
      const distanceClimbed = climbPerSecond * deltaTime;
      const coinsEarnedPerSecond = prev.speedLevel;
      
      let newCoins = prev.coins + (coinsEarnedPerSecond * deltaTime);
      let newHeight = prev.height + distanceClimbed;

      if (newHeight >= currentTowerHeight) {
        if (prev.autoClaimUnlocked) {
          // Auto-claim the trophy and continue
          return claimTrophyInternal(prev);
        } else {
          // Stop at the top and wait for manual claim
          return { ...prev, height: currentTowerHeight, coins: newCoins, isAtTop: true };
        }
      }
      
      return { ...prev, height: newHeight, coins: newCoins, isAtTop: false };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameLoop]);

  const handleUpgradeSpeed = () => {
    setGameState(prev => {
      if (prev.coins >= prev.upgradeCost) {
        return {
          ...prev,
          coins: prev.coins - prev.upgradeCost,
          speedLevel: prev.speedLevel + 1,
          upgradeCost: Math.floor(prev.upgradeCost * UPGRADE_COST_MULTIPLIER),
        };
      }
      return prev;
    });
  };

  const handleUpgradeShoes = () => {
    setGameState(prev => {
      if (prev.coins >= prev.shoeUpgradeCost) {
        return {
          ...prev,
          coins: prev.coins - prev.shoeUpgradeCost,
          shoeLevel: prev.shoeLevel + 1,
          shoeUpgradeCost: Math.floor(prev.shoeUpgradeCost * SHOE_UPGRADE_COST_MULTIPLIER),
        };
      }
      return prev;
    });
  };
  
  const handlePurchaseAutoClaim = () => {
    setGameState(prev => {
      if (prev.coins >= AUTO_CLAIM_COST && !prev.autoClaimUnlocked) {
        return { ...prev, coins: prev.coins - AUTO_CLAIM_COST, autoClaimUnlocked: true };
      }
      return prev;
    });
  };

  const handleClaimTrophy = () => {
    setGameState(prev => prev.isAtTop ? claimTrophyInternal(prev) : prev);
  };
  
  const handleUnlockNextTower = () => {
    setGameState(prev => {
      if (prev.trophies >= TROPHIES_FOR_NEXT_TOWER && prev.highestTowerUnlocked < TOWER_HEIGHTS.length) {
        const newHighest = prev.highestTowerUnlocked + 1;
        return {
          ...prev,
          trophies: prev.trophies - TROPHIES_FOR_NEXT_TOWER,
          highestTowerUnlocked: newHighest,
          towerLevel: newHighest, // Automatically move to the new tower
          height: 0, // Reset height for the new tower
          isAtTop: false,
        };
      }
      return prev;
    });
  };
  
  const handleSelectTower = (level: number) => {
    setGameState(prev => {
      if (level <= prev.highestTowerUnlocked && level !== prev.towerLevel) {
        return { ...prev, towerLevel: level, height: 0, isAtTop: false };
      }
      return prev;
    });
    setTowerModalOpen(false);
  };
  
  const toggleAutoNextTower = () => {
    setGameState(prev => ({...prev, autoNextTowerEnabled: !prev.autoNextTowerEnabled}));
  }

  const currentTowerHeight = getCurrentTowerHeight(gameState.towerLevel);
  const shoeBonus = 1 + (gameState.shoeLevel * SHOE_BONUS_PER_LEVEL);
  const currentSpeed = gameState.isAtTop ? 0 : (BASE_SPEED_PER_SECOND * gameState.speedLevel * shoeBonus);
  const isFinalTower = gameState.highestTowerUnlocked >= TOWER_HEIGHTS.length;
  const canUnlockNext = gameState.trophies >= TROPHIES_FOR_NEXT_TOWER && gameState.highestTowerUnlocked < TOWER_HEIGHTS.length;

  return (
    <>
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-black">
        <div className="w-full max-w-sm mx-auto bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 border border-gray-700 overflow-hidden">
          <header className="p-4 bg-gray-900/50 border-b border-gray-700">
             <button onClick={() => setTowerModalOpen(true)} className="w-full flex items-center justify-center space-x-2 text-cyan-300 font-orbitron tracking-wider group">
              <h1 className="text-2xl font-bold">TOWER {gameState.towerLevel}</h1>
              <ChevronDownIcon className="w-6 h-6 transition-transform group-hover:translate-y-1" />
            </button>
            <div className="flex items-center justify-center mt-2 space-x-2 text-yellow-300">
              <TrophyIcon className="w-5 h-5" />
              <p className="text-lg font-bold">{gameState.trophies.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Trophies</p>
            </div>
          </header>

          <main className="p-4">
            <GameDisplay height={gameState.height} towerHeight={currentTowerHeight} />
            <StatsPanel 
              gameState={gameState} 
              currentSpeed={currentSpeed}
              onToggleAutoNext={toggleAutoNextTower}
            />
            <ControlsPanel 
              onUpgradeSpeed={handleUpgradeSpeed}
              onUpgradeShoes={handleUpgradeShoes}
              onClaimTrophy={handleClaimTrophy}
              onPurchaseAutoClaim={handlePurchaseAutoClaim}
              onUnlockNextTower={handleUnlockNextTower}
              upgradeCost={gameState.upgradeCost}
              shoeUpgradeCost={gameState.shoeUpgradeCost}
              autoClaimCost={AUTO_CLAIM_COST}
              trophyCost={TROPHIES_FOR_NEXT_TOWER}
              coins={gameState.coins}
              isAtTop={gameState.isAtTop}
              autoClaimUnlocked={gameState.autoClaimUnlocked}
              canUnlockNext={canUnlockNext}
            />
          </main>
        </div>
        <footer className="text-center mt-6 text-gray-500 text-xs">
          <p>Climb to {currentTowerHeight.toLocaleString()}m to claim a trophy.</p>
          {isFinalTower && gameState.towerLevel === TOWER_HEIGHTS.length ? (
            <p>You have reached the final tower challenge!</p>
          ) : (
            <p>Unlock the next tower for {TROPHIES_FOR_NEXT_TOWER} trophies.</p>
          )}
        </footer>
      </div>
      {isTowerModalOpen && (
        <TowerSelectionModal 
          highestTowerUnlocked={gameState.highestTowerUnlocked}
          currentTower={gameState.towerLevel}
          onSelectTower={handleSelectTower}
          onClose={() => setTowerModalOpen(false)}
        />
      )}
    </>
  );
};

export default App;
