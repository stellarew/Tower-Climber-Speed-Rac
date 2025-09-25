import React from 'react';

interface TowerSelectionModalProps {
  highestTowerUnlocked: number;
  currentTower: number;
  onSelectTower: (level: number) => void;
  onClose: () => void;
}

const TowerSelectionModal: React.FC<TowerSelectionModalProps> = ({
  highestTowerUnlocked,
  currentTower,
  onSelectTower,
  onClose,
}) => {
  const towers = Array.from({ length: highestTowerUnlocked }, (_, i) => i + 1);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-center text-cyan-300 font-orbitron">SELECT TOWER</h2>
        </header>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3">
            {towers.map(level => (
              <button
                key={level}
                onClick={() => onSelectTower(level)}
                disabled={level === currentTower}
                className={`p-2 font-bold rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-cyan-400
                  ${level === currentTower 
                    ? 'bg-cyan-500 text-black shadow-lg cursor-default' 
                    : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                  }`
                }
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <footer className="p-2 border-t border-gray-700">
           <button 
             onClick={onClose}
             className="w-full text-center text-gray-400 hover:text-white transition-colors py-2"
           >
             Close
           </button>
        </footer>
      </div>
    </div>
  );
};

export default TowerSelectionModal;
