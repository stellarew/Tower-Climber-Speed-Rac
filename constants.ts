export const TOWER_HEIGHTS = [
  1, 5, 10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000
];
// Progresi biaya eksponensial baru berdasarkan masukan pengguna.
export const getTrophyCostForTower = (highestTowerUnlocked: number): bigint => {
  // contoh: Membuka Menara 2 (tertinggi yang terbuka adalah 1) membutuhkan biaya 5 * 10^1 = 50 trofi.
  // Membuka Menara 3 (tertinggi yang terbuka adalah 2) membutuhkan biaya 5 * 10^2 = 500 trofi.
  return 5n * (10n ** BigInt(highestTowerUnlocked));
};
// Progresi hadiah eksponensial baru untuk menyeimbangkan biaya baru.
export const getTrophyRewardForTower = (towerLevel: number): bigint => {
  // contoh: Hadiah Menara 1: 5 * 10^0 = 5 trofi.
  // Hadiah Menara 2: 5 * 10^1 = 50 trofi.
  // Ini menjaga agar jumlah permainan untuk membuka menara berikutnya tetap konsisten.
  return 5n * (10n ** BigInt(towerLevel - 1));
};
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 8 hours max offline progress

export const INITIAL_SPEED_LEVEL = 1;
export const INITIAL_UPGRADE_COST = 10n;
export const UPGRADE_COST_MULTIPLIER = 1.15;
export const BASE_SPEED_PER_SECOND = 1; // meters per second at level 1

// Shoe Upgrade Constants
export const INITIAL_SHOE_LEVEL = 0; // Starts with no shoes
export const INITIAL_SHOE_UPGRADE_COST = 100n;
export const SHOE_UPGRADE_COST_MULTIPLIER = 1.8;
export const SHOE_BONUS_PER_LEVEL = 0.1; // 10% multiplicative bonus per level

// Clicker Upgrade Constants
export const INITIAL_CLICKER_LEVEL = 1;
export const INITIAL_CLICKER_UPGRADE_COST = 25n;
export const CLICKER_UPGRADE_COST_MULTIPLIER = 1.2;

// Floating Item Constants
export const FLOATING_ITEM_MIN_SPAWN_INTERVAL = 1 * 60 * 1000; // 1 minute
export const FLOATING_ITEM_MAX_SPAWN_INTERVAL = 10 * 60 * 1000; // 10 minutes
export const FLOATING_ITEM_LIFESPAN = 1 * 60 * 1000; // 1 minute
export const FLOATING_ITEM_MIN_COIN_BONUS_SECONDS = 30; // Min reward is 30s of coin production
export const FLOATING_ITEM_MAX_COIN_BONUS_SECONDS = 120; // Max reward is 120s of coin production
export const FLOATING_ITEM_MIN_TROPHY_BONUS = 1;
export const FLOATING_ITEM_MAX_TROPHY_BONUS = 3;
