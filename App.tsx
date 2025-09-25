import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameDisplay from './components/GameDisplay';
import StatsPanel from './components/StatsPanel';
import ControlsPanel from './components/ControlsPanel';
import TowerSelectionModal from './components/TowerSelectionModal';
import OfflineProgressModal from './components/OfflineProgressModal';
import { GameState } from './types';
import {
  TOWER_HEIGHTS,
  getTrophyCostForTower,
  getTrophyRewardForTower,
  INITIAL_SPEED_LEVEL,
  INITIAL_UPGRADE_COST,
  UPGRADE_COST_MULTIPLIER,
  BASE_SPEED_PER_SECOND,
  INITIAL_SHOE_LEVEL,
  INITIAL_SHOE_UPGRADE_COST,
  SHOE_UPGRADE_COST_MULTIPLIER,
  SHOE_BONUS_PER_LEVEL,
  INITIAL_CLICKER_LEVEL,
  INITIAL_CLICKER_UPGRADE_COST,
  CLICKER_UPGRADE_COST_MULTIPLIER,
  MAX_OFFLINE_SECONDS,
  FLOATING_ITEM_MIN_SPAWN_INTERVAL,
  FLOATING_ITEM_MAX_SPAWN_INTERVAL,
  FLOATING_ITEM_LIFESPAN,
  FLOATING_ITEM_MIN_COIN_BONUS_SECONDS,
  FLOATING_ITEM_MAX_COIN_BONUS_SECONDS,
  FLOATING_ITEM_MIN_TROPHY_BONUS,
  FLOATING_ITEM_MAX_TROPHY_BONUS,
} from './constants';
import { stringify, parse } from './utils/json';
import TrophyIcon from './components/icons/TrophyIcon';
import ChevronDownIcon from './components/icons/ChevronDownIcon';
import { formatNumber } from './utils/formatNumber';

const SAVE_KEY = 'towerClimberSaveGame';

const getInitialState = (): GameState => ({
  height: 0,
  coins: 0n,
  trophies: 0n,
  speedLevel: INITIAL_SPEED_LEVEL,
  upgradeCost: INITIAL_UPGRADE_COST,
  shoeLevel: INITIAL_SHOE_LEVEL,
  shoeUpgradeCost: INITIAL_SHOE_UPGRADE_COST,
  clickerLevel: INITIAL_CLICKER_LEVEL,
  clickerUpgradeCost: INITIAL_CLICKER_UPGRADE_COST,
  isAtTop: false,
  towerLevel: 1,
  highestTowerUnlocked: 1,
  autoClaimEnabled: false,
  autoNextTowerEnabled: false,
});

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [isTowerModalOpen, setIsTowerModalOpen] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; amount: number }[]>([]);
  const [floatingItem, setFloatingItem] = useState<{ id: number; x: number; y: number } | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [offlineGains, setOfflineGains] = useState<{ coins: bigint; trophies: bigint } | null>(null);

  // FIX: Initialize useRef with null to provide an initial value.
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  // FIX: Use `number` for setTimeout return type in browser environment instead of `NodeJS.Timeout`.
  const floatingItemTimerRef = useRef<number | null>(null);

  const {
    height,
    coins,
    trophies,
    speedLevel,
    upgradeCost,
    shoeLevel,
    shoeUpgradeCost,
    clickerLevel,
    clickerUpgradeCost,
    isAtTop,
    towerLevel,
    highestTowerUnlocked,
  } = gameState;

  const towerHeight = TOWER_HEIGHTS[towerLevel - 1] || TOWER_HEIGHTS[TOWER_HEIGHTS.length - 1];
  const nextTowerCost = getTrophyCostForTower(highestTowerUnlocked);
  const canUnlockNext = highestTowerUnlocked < TOWER_HEIGHTS.length && trophies >= nextTowerCost;
  const currentSpeed = (BASE_SPEED_PER_SECOND * speedLevel) * (1 + (SHOE_BONUS_PER_LEVEL * shoeLevel));
  const coinsPerClick = BigInt(clickerLevel * speedLevel);

  // Handlers
  const handleUpgradeSpeed = useCallback(() => {
    setGameState(prev => {
      if (prev.coins < prev.upgradeCost) return prev;
      return {
        ...prev,
        coins: prev.coins - prev.upgradeCost,
        speedLevel: prev.speedLevel + 1,
        upgradeCost: BigInt(Math.ceil(Number(prev.upgradeCost) * UPGRADE_COST_MULTIPLIER)),
      };
    });
  }, []);
  
  const handleUpgradeShoes = useCallback(() => {
    setGameState(prev => {
      if (prev.coins < prev.shoeUpgradeCost) return prev;
      return {
        ...prev,
        coins: prev.coins - prev.shoeUpgradeCost,
        shoeLevel: prev.shoeLevel + 1,
        shoeUpgradeCost: BigInt(Math.ceil(Number(prev.shoeUpgradeCost) * SHOE_UPGRADE_COST_MULTIPLIER)),
      };
    });
  }, []);

  const handleUpgradeClicker = useCallback(() => {
    setGameState(prev => {
      if (prev.coins < prev.clickerUpgradeCost) return prev;
      return {
        ...prev,
        coins: prev.coins - prev.clickerUpgradeCost,
        clickerLevel: prev.clickerLevel + 1,
        clickerUpgradeCost: BigInt(Math.ceil(Number(prev.clickerUpgradeCost) * CLICKER_UPGRADE_COST_MULTIPLIER)),
      };
    });
  }, []);

  const handleClaimTrophy = useCallback(() => {
    setGameState(prev => {
      if (!prev.isAtTop) return prev;
      const trophyReward = getTrophyRewardForTower(prev.towerLevel);
      return {
        ...prev,
        height: 0,
        isAtTop: false,
        trophies: prev.trophies + trophyReward,
      };
    });
  }, []);

  const handleUnlockNextTower = useCallback(() => {
    setGameState(prev => {
      const cost = getTrophyCostForTower(prev.highestTowerUnlocked);
      if (prev.highestTowerUnlocked < TOWER_HEIGHTS.length && prev.trophies >= cost) {
        return {
          ...prev,
          trophies: prev.trophies - cost,
          highestTowerUnlocked: prev.highestTowerUnlocked + 1,
          towerLevel: prev.highestTowerUnlocked + 1,
          height: 0,
          isAtTop: false,
        };
      }
      return prev;
    });
  }, []);

  const handleSelectTower = (level: number) => {
    if (level <= highestTowerUnlocked) {
      setGameState(prev => ({
        ...prev,
        towerLevel: level,
        height: 0,
        isAtTop: false,
      }));
      setIsTowerModalOpen(false);
    }
  };

  const handleClicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + coinsPerClick }));
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const newEffect = { id: Date.now(), x, y, amount: Number(coinsPerClick) };

    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== newEffect.id));
    }, 1000);
  };
  
  const showSaveMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(prev => (prev === msg ? '' : prev)), 2500);
  };

  // Save/Load
  const saveGame = useCallback(() => {
    const saveData = { gameState, saveTime: Date.now() };
    localStorage.setItem(SAVE_KEY, stringify(saveData));
    showSaveMessage('Game Saved!');
  }, [gameState]);

  const loadGame = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsedData = parse(savedData);
        // **SAVE MIGRATION LOGIC**
        // Merge the loaded game state with the initial state.
        // This ensures new properties are added with default values and don't break the game.
        const finalState = { ...getInitialState(), ...parsedData.gameState };
        setGameState(finalState);
        lastUpdateTimeRef.current = Date.now();
        showSaveMessage('Game Loaded!');
      } catch (e) {
        console.error("Failed to load game data:", e);
        showSaveMessage('Load Failed!');
      }
    } else {
      showSaveMessage('No save data found.');
    }
  };

  // Floating Item Logic
  const scheduleFloatingItem = useCallback(() => {
    if (floatingItemTimerRef.current) clearTimeout(floatingItemTimerRef.current);
    const delay = FLOATING_ITEM_MIN_SPAWN_INTERVAL + Math.random() * (FLOATING_ITEM_MAX_SPAWN_INTERVAL - FLOATING_ITEM_MIN_SPAWN_INTERVAL);
    
    floatingItemTimerRef.current = setTimeout(() => {
      setFloatingItem({ id: Date.now(), x: 10 + Math.random() * 80, y: 10 + Math.random() * 60 });
      floatingItemTimerRef.current = setTimeout(() => {
        setFloatingItem(null);
        scheduleFloatingItem();
      }, FLOATING_ITEM_LIFESPAN);
    }, delay);
  }, []);

  const handleCollectFloatingItem = useCallback(() => {
    if (!floatingItem) return;
    if (floatingItemTimerRef.current) clearTimeout(floatingItemTimerRef.current);
    setFloatingItem(null);
    
    setGameState(prev => {
        const currentSpeed = (BASE_SPEED_PER_SECOND * prev.speedLevel) * (1 + (SHOE_BONUS_PER_LEVEL * prev.shoeLevel));
        const coinsPerMeter = BigInt(prev.towerLevel);
        const coinsPerSecond = BigInt(Math.floor(currentSpeed)) * coinsPerMeter;
        const coinBonusSeconds = FLOATING_ITEM_MIN_COIN_BONUS_SECONDS + Math.random() * (FLOATING_ITEM_MAX_COIN_BONUS_SECONDS - FLOATING_ITEM_MIN_COIN_BONUS_SECONDS);
        const coinBonus = coinsPerSecond * BigInt(Math.floor(coinBonusSeconds));
        const trophyBonus = BigInt(Math.floor(FLOATING_ITEM_MIN_TROPHY_BONUS + Math.random() * (FLOATING_ITEM_MAX_TROPHY_BONUS - FLOATING_ITEM_MIN_TROPHY_BONUS + 1)));
        const isTrophy = Math.random() < 0.2;
        
        const newState = {...prev};
        if (isTrophy) {
            newState.trophies += trophyBonus;
            showSaveMessage(`+${formatNumber(trophyBonus)} Trophies!`);
        } else {
            newState.coins += coinBonus;
            showSaveMessage(`+${formatNumber(coinBonus)} Coins!`);
        }
        return newState;
    });
    
    scheduleFloatingItem();
  }, [floatingItem, scheduleFloatingItem]);

  // Game Loop
  useEffect(() => {
    lastUpdateTimeRef.current = Date.now();
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;

      setGameState(prev => {
        let newState = { ...prev };
        if (newState.isAtTop && newState.autoClaimEnabled) {
          const trophyReward = getTrophyRewardForTower(newState.towerLevel);
          newState.trophies += trophyReward;
          newState.height = 0;
          newState.isAtTop = false;

          if (newState.autoNextTowerEnabled) {
            const nextTowerCost = getTrophyCostForTower(newState.highestTowerUnlocked);
            if (newState.highestTowerUnlocked < TOWER_HEIGHTS.length && newState.trophies >= nextTowerCost) {
              newState.trophies -= nextTowerCost;
              newState.highestTowerUnlocked++;
              newState.towerLevel = newState.highestTowerUnlocked;
            }
          }
        }
        
        if (!newState.isAtTop) {
            const currentSpeed = (BASE_SPEED_PER_SECOND * newState.speedLevel) * (1 + (SHOE_BONUS_PER_LEVEL * newState.shoeLevel));
            const towerHeight = TOWER_HEIGHTS[newState.towerLevel - 1] || TOWER_HEIGHTS[TOWER_HEIGHTS.length - 1];
            const coinsPerMeter = BigInt(newState.towerLevel);
            const heightGained = currentSpeed * deltaTime;
            
            const oldHeightFloored = Math.floor(newState.height);
            newState.height += heightGained;
            const newHeightFloored = Math.floor(newState.height);
            
            const metersClimbed = newHeightFloored - oldHeightFloored;
            if (metersClimbed > 0) {
              const coinsGained = BigInt(metersClimbed) * coinsPerMeter;
              newState.coins += coinsGained;
            }

            if (newState.height >= towerHeight) {
                // Award coins for the final stretch to the top
                const finalMetersToClimb = towerHeight - oldHeightFloored;
                if(finalMetersToClimb > metersClimbed){
                    const finalCoinsGained = BigInt(finalMetersToClimb - metersClimbed) * coinsPerMeter;
                    newState.coins += finalCoinsGained;
                }
                newState.height = towerHeight;
                newState.isAtTop = true;
            }
        }
        return newState;
      });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, []);

  // Initial Load & Offline Progress
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const { gameState: parsedState, saveTime } = parse(savedData);
        // **SAVE MIGRATION LOGIC**
        // Merge the loaded state with the default state to ensure forward compatibility.
        const savedState = { ...getInitialState(), ...parsedState };
        
        const timeDiff = Math.floor((Date.now() - saveTime) / 1000);
        const offlineSeconds = Math.min(timeDiff, MAX_OFFLINE_SECONDS);

        if (offlineSeconds > 10) {
          const savedSpeed = (BASE_SPEED_PER_SECOND * savedState.speedLevel) * (1 + (SHOE_BONUS_PER_LEVEL * savedState.shoeLevel));
          const coinsPerMeter = BigInt(savedState.towerLevel);
          let coinsGained = 0n;
          let trophiesGained = 0n;

          if (savedState.autoClaimEnabled) {
              const towerHeight = TOWER_HEIGHTS[savedState.towerLevel - 1];
              const trophyReward = getTrophyRewardForTower(savedState.towerLevel);
              const secondsPerClimb = towerHeight / savedSpeed;
              if (secondsPerClimb > 0) {
                const totalClimbs = Math.floor(offlineSeconds / secondsPerClimb);
                trophiesGained = BigInt(totalClimbs) * trophyReward;
                const totalMetersClimbed = totalClimbs * towerHeight;
                coinsGained = BigInt(Math.floor(totalMetersClimbed)) * coinsPerMeter;
                const secondsRemaining = offlineSeconds % secondsPerClimb;
                const remainingMeters = savedSpeed * secondsRemaining;
                coinsGained += BigInt(Math.floor(remainingMeters)) * coinsPerMeter;
                savedState.height = remainingMeters;
                savedState.isAtTop = false;
              }
          } else if (!savedState.isAtTop) {
              const towerHeight = TOWER_HEIGHTS[savedState.towerLevel - 1];
              const heightToClimb = towerHeight - savedState.height;
              const timeToTop = heightToClimb / savedSpeed;
              if (offlineSeconds >= timeToTop) {
                  coinsGained = BigInt(Math.floor(heightToClimb)) * coinsPerMeter;
                  savedState.height = towerHeight;
                  savedState.isAtTop = true;
              } else {
                  const metersClimbed = savedSpeed * offlineSeconds;
                  coinsGained = BigInt(Math.floor(metersClimbed)) * coinsPerMeter;
                  savedState.height += metersClimbed;
              }
          }
          savedState.coins += coinsGained;
          savedState.trophies += trophiesGained;
          if (coinsGained > 0n || trophiesGained > 0n) {
              setOfflineGains({ coins: coinsGained, trophies: trophiesGained });
          }
        }
        setGameState(savedState);
      } catch (e) {
        console.error("Failed to parse saved data on initial load:", e);
        setGameState(getInitialState());
      }
    }
    scheduleFloatingItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-4 border border-gray-700/50">
        <header className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-orbitron text-cyan-300">Tower Climber</h1>
            <div className="text-sm mt-1">
              {highestTowerUnlocked < TOWER_HEIGHTS.length ? (
                trophies < nextTowerCost ? (
                  <p className="text-gray-400">
                    Next tower unlocks at <TrophyIcon className="inline w-4 h-4 text-yellow-400 -mt-1 mx-1" />{formatNumber(nextTowerCost)}
                  </p>
                ) : (
                  <p className="text-green-400 animate-pulse font-semibold">
                    You can unlock the next tower!
                  </p>
                )
              ) : (
                <p className="text-cyan-400 font-semibold">
                  You've unlocked all the towers!
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-6 h-6 text-yellow-400"/>
              <span className="font-bold font-orbitron text-xl text-white">{formatNumber(trophies)}</span>
            </div>
            <button 
                onClick={() => setIsTowerModalOpen(true)}
                className="flex items-center space-x-1 bg-gray-900/50 px-3 py-1 rounded-full hover:bg-gray-700/80 transition-colors"
            >
                <span className="font-bold text-sm sm:text-base">TWR {towerLevel}</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        <GameDisplay
          height={height}
          towerHeight={towerHeight}
          floatingItem={floatingItem}
          onCollectFloatingItem={handleCollectFloatingItem}
          onClicker={handleClicker}
          clickEffects={clickEffects}
        />
        <StatsPanel
          gameState={gameState}
          currentSpeed={currentSpeed}
          onToggleAutoClaim={() => setGameState(p => ({...p, autoClaimEnabled: !p.autoClaimEnabled}))}
          onToggleAutoNext={() => setGameState(p => ({...p, autoNextTowerEnabled: !p.autoNextTowerEnabled}))}
        />
        <ControlsPanel
          onUpgradeSpeed={handleUpgradeSpeed}
          onUpgradeShoes={handleUpgradeShoes}
          onUpgradeClicker={handleUpgradeClicker}
          onClaimTrophy={handleClaimTrophy}
          onUnlockNextTower={handleUnlockNextTower}
          onSaveGame={saveGame}
          onLoadGame={loadGame}
          upgradeCost={upgradeCost}
          shoeUpgradeCost={shoeUpgradeCost}
          clickerUpgradeCost={clickerUpgradeCost}
          trophyCost={nextTowerCost}
          coins={coins}
          isAtTop={isAtTop}
          canUnlockNext={canUnlockNext}
          saveMessage={saveMessage}
          highestTowerUnlocked={highestTowerUnlocked}
        />
      </div>

      {isTowerModalOpen && (
        <TowerSelectionModal
          highestTowerUnlocked={highestTowerUnlocked}
          currentTower={towerLevel}
          onSelectTower={handleSelectTower}
          onClose={() => setIsTowerModalOpen(false)}
        />
      )}

      {offlineGains && (
        <OfflineProgressModal 
            gains={offlineGains} 
            onClose={() => setOfflineGains(null)} 
        />
      )}
    </div>
  );
};

export default App;