using System.ComponentModel.DataAnnotations;

namespace ILoveBesi.Api.Models.Dtos
{
    public class RebarCalculateRequestDto
    {
        [Required]
        [Range(4, 50)]
        public double DiameterMm { get; set; }

        [Required]
        [Range(0.1, 100)]
        public double LengthMeters { get; set; }

        [Required]
        [Range(1, 100000)]
        public int Quantity { get; set; }

        public double ToleranceFactor { get; set; } = 1.0;
        public int LapSpliceFactor { get; set; } = 40;
    }

    public class RebarCalculateResponseDto
    {
        public double DiameterMm { get; set; }
        public double LengthMeters { get; set; }
        public int Quantity { get; set; }
        public double TotalWeightKg { get; set; }
        public double LapSpliceMeters { get; set; }
    }

    public class CutRequestItemDto
    {
        public double LengthMeters { get; set; }
        public int Quantity { get; set; }
    }

    public class CuttingBarPatternDto
    {
        public int BarIndex { get; set; }
        public double StockLengthMeters { get; set; } = 12.0;
        public double RemainingLengthMeters { get; set; }
        public List<double> CutsMeters { get; set; } = new List<double>();
    }

    public class CuttingOptimizationResultDto
    {
        public double StockLengthMeters { get; set; } = 12.0;
        public int TotalStockBarsUsed { get; set; }
        public double TotalWasteMeters { get; set; }
        public double WastePercentage { get; set; }
        public List<CuttingBarPatternDto> BarPatterns { get; set; } = new List<CuttingBarPatternDto>();
    }
}
