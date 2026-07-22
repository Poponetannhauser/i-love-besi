import { apiService } from '../services/api';

/**
 * DEPRECATED LOCAL OPTIMIZATION:
 * 1D Cutting Stock optimization engine moved to ASP.NET Core Web API (CuttingStockOptimizerService.cs).
 * Use apiService.optimizeCutting() for backend First-Fit Decreasing (FFD) processing.
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

  Object.keys(groups).forEach(key => {
    const groupItems = groups[key];
    const pieces = [];
    groupItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        pieces.push(Number(item.length));
      }
    });

    pieces.sort((a, b) => b - a);

    const stocks = [];
    pieces.forEach(piece => {
      let placed = false;
      for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] >= piece) {
          stocks[i] = Number((stocks[i] - piece).toFixed(4));
          placed = true;
          break;
        }
      }

      if (!placed) {
        stocks.push(Number((STOCK_LENGTH - piece).toFixed(4)));
      }
    });

    totalBarsNeeded += stocks.length;
    totalCutLength += pieces.reduce((acc, p) => acc + p, 0);
  });

  const totalPurchasedLength = totalBarsNeeded * STOCK_LENGTH;
  const efficiency = totalPurchasedLength > 0 ? (totalCutLength / totalPurchasedLength) * 100 : 0;
  const waste = totalPurchasedLength > 0 ? 100 - efficiency : 0;

  return {
    barsNeeded: totalBarsNeeded,
    efficiency: Number(efficiency.toFixed(2)),
    waste: Number(waste.toFixed(2)),
    totalLengthUsed: Number(totalCutLength.toFixed(2)),
  };
};
