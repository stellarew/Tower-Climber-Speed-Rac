export interface GameState {
  height: number;
  coins: bigint;
  trophies: bigint;
  speedLevel: number;
  upgradeCost: bigint;
  shoeLevel: number;
  shoeUpgradeCost: bigint;
  clickerLevel: number;
  clickerUpgradeCost: bigint;
  isAtTop: boolean;
  towerLevel: number; // Now represents the *currently selected* tower
  highestTowerUnlocked: number; // The highest tower the player has access to
  autoClaimEnabled: boolean; // Toggle for automatically claiming trophies
  autoNextTowerEnabled: boolean; // Toggle for automatically unlocking the next tower
}
