// utils/formatNumber.ts
const SI_SYMBOLS = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "De"];

export function formatNumber(num: bigint | number): string {
    const value = typeof num === 'number' ? BigInt(Math.floor(num)) : num;
    
    if (value < 1000n) {
        return value.toString();
    }

    let tier = 0;
    let tempValue = value;
    // Determine tier
    while (tempValue >= 1000n && tier < SI_SYMBOLS.length - 1) {
        tempValue /= 1000n;
        tier++;
    }

    const divisor = 10n ** BigInt(tier * 3);
    const mainPart = value / divisor;
    
    // Calculate the first two decimal places
    const remainder = value % divisor;
    if (tier > 0 && remainder > 0n) {
        const decimalPart = (remainder * 100n) / divisor;
        if (decimalPart > 0n) {
          return `${mainPart}.${decimalPart.toString().padStart(2, '0')}${SI_SYMBOLS[tier]}`;
        }
    }
    
    return `${mainPart}${SI_SYMBOLS[tier]}`;
}
