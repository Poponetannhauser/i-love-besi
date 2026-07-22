import { apiService } from '../services/api';

/**
 * DEPRECATED LOCAL FORMULA:
 * Backend calculation engine moved to ASP.NET Core Web API (ILoveBesi.Api).
 * Use apiService.calculateWeight() for server-side processing.
 */
export const calculateRebarWeight = (diameter, length, quantity, toleranceFactor = 1.0) => {
  if (!diameter || !length || !quantity || diameter <= 0 || length <= 0 || quantity <= 0) {
    return 0;
  }
  // SNI weight calculation formula matching C# RebarCalculatorService
  const weight = 0.006165 * Math.pow(diameter, 2) * length * quantity * toleranceFactor;
  return Math.round(weight * 10000) / 10000;
};

export const calculateOverlapLength = (diameter, factor) => {
  if (!diameter || !factor || diameter <= 0 || factor <= 0) {
    return 0;
  }
  return Number(((diameter * factor) / 1000).toFixed(3));
};
