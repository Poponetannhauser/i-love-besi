using ILoveBesi.Api.Models.Dtos;

namespace ILoveBesi.Api.Services
{
    public interface ICuttingStockOptimizerService
    {
        CuttingOptimizationResultDto Optimize1DCuttingStock(List<CutRequestItemDto> items, double stockLengthMeters = 12.0);
    }

    public class CuttingStockOptimizerService : ICuttingStockOptimizerService
    {
        public CuttingOptimizationResultDto Optimize1DCuttingStock(List<CutRequestItemDto> items, double stockLengthMeters = 12.0)
        {
            var result = new CuttingOptimizationResultDto
            {
                StockLengthMeters = stockLengthMeters
            };

            if (items == null || items.Count == 0 || stockLengthMeters <= 0)
            {
                return result;
            }

            // 1. Expand items into individual requested lengths
            var allCuts = new List<double>();
            foreach (var item in items)
            {
                for (int i = 0; i < item.Quantity; i++)
                {
                    if (item.LengthMeters > 0 && item.LengthMeters <= stockLengthMeters)
                    {
                        allCuts.Add(item.LengthMeters);
                    }
                }
            }

            // 2. Sort descending (First-Fit Decreasing)
            allCuts.Sort((a, b) => b.CompareTo(a));

            // 3. Bin packing (FFD)
            var bars = new List<CuttingBarPatternDto>();

            foreach (var cutLength in allCuts)
            {
                bool placed = false;
                foreach (var bar in bars)
                {
                    if (bar.RemainingLengthMeters >= cutLength)
                    {
                        bar.CutsMeters.Add(cutLength);
                        bar.RemainingLengthMeters = Math.Round(bar.RemainingLengthMeters - cutLength, 4);
                        placed = true;
                        break;
                    }
                }

                if (!placed)
                {
                    var newBar = new CuttingBarPatternDto
                    {
                        BarIndex = bars.Count + 1,
                        StockLengthMeters = stockLengthMeters,
                        RemainingLengthMeters = Math.Round(stockLengthMeters - cutLength, 4)
                    };
                    newBar.CutsMeters.Add(cutLength);
                    bars.Add(newBar);
                }
            }

            result.BarPatterns = bars;
            result.TotalStockBarsUsed = bars.Count;

            double totalStockLengthUsed = bars.Count * stockLengthMeters;
            double totalRequiredLength = allCuts.Sum();
            double totalWasteLength = totalStockLengthUsed - totalRequiredLength;

            result.TotalWasteMeters = Math.Round(totalWasteLength, 4);
            result.WastePercentage = totalStockLengthUsed > 0
                ? Math.Round((totalWasteLength / totalStockLengthUsed) * 100.0, 2)
                : 0.0;

            return result;
        }
    }
}
