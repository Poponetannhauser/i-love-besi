/**
 * Performs First-Fit Decreasing (FFD) cutting stock optimization
 * on the list of rebar items, grouped by diameter and steel type.
 * Standard stock length is 12 meters.
 * 
 * @param {Array} items - List of items from recapList
 * @returns {Object} Optimization metrics
 */
export const optimizeCuttingStock = (items) => {
  if (!items || items.length === 0) {
    return {
      barsNeeded: 0,
      efficiency: 0,
      waste: 0,
      totalLengthUsed: 0,
    };
  }

  const STOCK_LENGTH = 12.0;

  // Group items by unique specification (diameter + steelType)
  const groups = {};
  items.forEach(item => {
    const key = `${item.diameter}-${item.steelType}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  let totalBarsNeeded = 0;
  let totalCutLength = 0;

  // Run FFD on each group
  Object.keys(groups).forEach(key => {
    const groupItems = groups[key];
    
    // 1. Flatten items: convert length + quantity to array of individual cut pieces
    const pieces = [];
    groupItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        pieces.push(Number(item.length));
      }
    });

    // 2. Sort pieces in descending order (Decreasing)
    pieces.sort((a, b) => b - a);

    // 3. First-Fit allocation
    const stocks = []; // Array representing remaining space in each bought 12m bar
    
    pieces.forEach(piece => {
      // Find the first stock bar that has enough capacity
      let placed = false;
      for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] >= piece) {
          stocks[i] = Number((stocks[i] - piece).toFixed(4));
          placed = true;
          break;
        }
      }

      // If it doesn't fit in any existing bar, buy a new 12m stock bar
      if (!placed) {
        stocks.push(Number((STOCK_LENGTH - piece).toFixed(4)));
      }
    });

    totalBarsNeeded += stocks.length;
    totalCutLength += pieces.reduce((acc, p) => acc + p, 0);
  });

  const totalPurchasedLength = totalBarsNeeded * STOCK_LENGTH;
  const efficiency = totalPurchasedLength > 0 
    ? (totalCutLength / totalPurchasedLength) * 100 
    : 0;
  const waste = totalPurchasedLength > 0 
    ? 100 - efficiency 
    : 0;

  return {
    barsNeeded: totalBarsNeeded,
    efficiency: Number(efficiency.toFixed(2)),
    waste: Number(waste.toFixed(2)),
    totalLengthUsed: Number(totalCutLength.toFixed(2)),
  };
};
