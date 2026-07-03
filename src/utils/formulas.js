/**
 * Calculate the weight of rebar in kilograms
 * Rumus: W = 0.006165 * d^2 * L * N
 * 
 * @param {number} diameter - Diameter in mm (d)
 * @param {number} length - Length in meters (L)
 * @param {number} quantity - Quantity of bars (N)
 * @returns {number} Weight in kilograms (Kg) rounded to 4 decimal places
 */
export const calculateRebarWeight = (diameter, length, quantity) => {
  if (!diameter || !length || !quantity || diameter <= 0 || length <= 0 || quantity <= 0) {
    return 0;
  }
  const weight = 0.006165 * Math.pow(diameter, 2) * length * quantity;
  return Math.round(weight * 10000) / 10000;
};
