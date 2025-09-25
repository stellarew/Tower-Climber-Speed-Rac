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
  FLOATING_ITEM_MIN_SPAWN_INTERVAL,
  FLOATING_ITEM_MAX_SPAWN_INTERVAL,
  FLOATING_ITEM_LIFESPAN,
  FLOATING_ITEM_MIN_COIN_BONUS_SECONDS,
  FLOATING_ITEM_MAX_COIN_BONUS_SECONDS,
  FLOATING_ITEM_MIN_TROPHY_BONUS,
  FLOATING_ITEM_MAX_TROPHY_BONUS,
} from './constants';
import GameDisplay from './components/GameDisplay';
import StatsPanel from './components/StatsPanel';
import ControlsPanel from './components/ControlsPanel';
import TrophyIcon from './components/icons/TrophyIcon';
import TowerSelectionModal from './components/TowerSelectionModal';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const LOCAL_STORAGE_KEY = 'towerClimberGameState';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState: GameState = {
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
      autoClaimEnabled: false,
      autoNextTowerEnabled: true,
    };
    
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        // Merge saved state with initial state to prevent crashes on new properties
        return { ...initialState, ...JSON.parse(savedState) };
      }
    } catch (error) {
      console.error("Failed to parse saved game state:", error);
    }
    
    return initialState;
  });
  
  const [isTowerModalOpen, setTowerModalOpen] = useState(false);
  const [floatingItem, setFloatingItem] = useState<{ id: number; x: number; y: number; } | null>(null);

  const lastUpdateTime = useRef<number>(0);
  const gameLoopRef = useRef<number>(0);
  const spawnTimerRef = useRef<number | null>(null);
  const lifespanTimerRef = useRef<number | null>(null);
  
  // Effect to save game state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  }, [gameState]);


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
  
  const scheduleNextSpawn = useCallback(() => {
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    const delay = Math.random() * (FLOATING_ITEM_MAX_SPAWN_INTERVAL - FLOATING_ITEM_MIN_SPAWN_INTERVAL) + FLOATING_ITEM_MIN_SPAWN_INTERVAL;
    spawnTimerRef.current = window.setTimeout(spawnFloatingItem, delay);
  }, []);
  
  const spawnFloatingItem = useCallback(() => {
    setFloatingItem({
      id: Date.now(),
      x: 10 + Math.random() * 80, // % from left
      y: 10 + Math.random() * 60, // % from top (within GameDisplay)
    });

    if (lifespanTimerRef.current) clearTimeout(lifespanTimerRef.current);
    lifespanTimerRef.current = window.setTimeout(() => {
      setFloatingItem(null);
      scheduleNextSpawn();
    }, FLOATING_ITEM_LIFESPAN);
  }, [scheduleNextSpawn]);
  
  useEffect(() => {
    scheduleNextSpawn();
    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      if (lifespanTimerRef.current) clearTimeout(lifespanTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        newHeight = currentTowerHeight; // Cap height at tower height
        if (prev.autoClaimEnabled) {
          // Use a fresh state for the claim to avoid race conditions with a stale 'prev'
          return claimTrophyInternal({ ...prev, height: newHeight, coins: newCoins });
        } else {
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

  const handleClaimTrophy = () => {
    setGameState(prev => prev.isAtTop ? claimTrophyInternal(prev) : prev);
  };
  
  const handleCollectFloatingItem = () => {
    setGameState(prev => {
      const coinSeconds = FLOATING_ITEM_MIN_COIN_BONUS_SECONDS + Math.random() * (FLOATING_ITEM_MAX_COIN_BONUS_SECONDS - FLOATING_ITEM_MIN_COIN_BONUS_SECONDS);
      const coinBonus = prev.speedLevel * coinSeconds;

      const trophyBonus = Math.floor(FLOATING_ITEM_MIN_TROPHY_BONUS + Math.random() * (FLOATING_ITEM_MAX_TROPHY_BONUS - FLOATING_ITEM_MIN_TROPHY_BONUS + 1));

      return {
        ...prev,
        coins: prev.coins + coinBonus,
        trophies: prev.trophies + trophyBonus,
      };
    });
    
    if (lifespanTimerRef.current) clearTimeout(lifespanTimerRef.current);
    setFloatingItem(null);
    scheduleNextSpawn();
  };
  
  const handleUnlockNextTower = () => {
    setGameState(prev => {
      if (prev.trophies >= TROPHIES_FOR_NEXT_TOWER && prev.highestTowerUnlocked < TOWER_HEIGHTS.length) {
        const newHighest = prev.highestTowerUnlocked + 1;
        return {
          ...prev,
          trophies: prev.trophies - TROPHIES_FOR_NEXT_TOWER,
          highestTowerUnlocked: newHighest,
          towerLevel: newHighest,
          height: 0,
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
  
  const toggleAutoClaim = () => {
    setGameState(prev => ({...prev, autoClaimEnabled: !prev.autoClaimEnabled}));
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
            <GameDisplay 
              height={gameState.height} 
              towerHeight={currentTowerHeight}
              floatingItem={floatingItem}
              onCollectFloatingItem={handleCollectFloatingItem}
            />
            <StatsPanel 
              gameState={gameState} 
              currentSpeed={currentSpeed}
              onToggleAutoNext={toggleAutoNextTower}
              onToggleAutoClaim={toggleAutoClaim}
            />
            <ControlsPanel 
              onUpgradeSpeed={handleUpgradeSpeed}
              onUpgradeShoes={handleUpgradeShoes}
              onClaimTrophy={handleClaimTrophy}
              onUnlockNextTower={handleUnlockNextTower}
              upgradeCost={gameState.upgradeCost}
              shoeUpgradeCost={gameState.shoeUpgradeCost}
              trophyCost={TROPHIES_FOR_NEXT_TOWER}
              coins={gameState.coins}
              isAtTop={gameState.isAtTop}
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