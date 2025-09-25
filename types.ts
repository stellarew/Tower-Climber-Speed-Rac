export interface GameState {
  height: number;
  coins: number;
  trophies: number;
  speedLevel: number;
  upgradeCost: number;
  shoeLevel: number;
  shoeUpgradeCost: number;
  isAtTop: boolean;
  towerLevel: number; // Now represents the *currently selected* tower
  highestTowerUnlocked: number; // The highest tower the player has access to
  autoClaimUnlocked: boolean;
  autoNextTowerEnabled: boolean; // Toggle for automatically unlocking the next tower
}
