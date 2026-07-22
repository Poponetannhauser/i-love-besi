namespace ILoveBesi.Api.Services
{
    public interface IRebarCalculatorService
    {
        double CalculateWeightKg(double diameterMm, double lengthMeters, int quantity, double toleranceFactor = 1.0);
        double CalculateLapSpliceMeters(double diameterMm, int spliceFactor = 40);
        double CalculateActualDiameterMm(double labelDiameterMm, double tolerancePercentage);
    }

    public class RebarCalculatorService : IRebarCalculatorService
    {
        private const double SNI_WEIGHT_FACTOR = 0.006165;

        public double CalculateWeightKg(double diameterMm, double lengthMeters, int quantity, double toleranceFactor = 1.0)
        {
            if (diameterMm <= 0 || lengthMeters <= 0 || quantity <= 0) return 0;

            // W = 0.006165 * d^2 * L * N * toleranceFactor
            double rawWeight = SNI_WEIGHT_FACTOR * Math.Pow(diameterMm, 2) * lengthMeters * quantity;
            return Math.Round(rawWeight * toleranceFactor, 4);
        }

        public double CalculateLapSpliceMeters(double diameterMm, int spliceFactor = 40)
        {
            if (diameterMm <= 0) return 0;
            // Lap Splice (m) = (diameterMm * factor) / 1000
            return Math.Round((diameterMm * spliceFactor) / 1000.0, 4);
        }

        public double CalculateActualDiameterMm(double labelDiameterMm, double tolerancePercentage)
        {
            // Tolerance calculation for Besi Banci
            if (labelDiameterMm <= 0) return 0;
            return Math.Round(labelDiameterMm * (1.0 - (tolerancePercentage / 100.0)), 2);
        }
    }
}
