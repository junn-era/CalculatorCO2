/**
 * Calculator - Global object for emission and carbon credit calculations
 * 
 * Contains methods for:
 * - Calculating emissions for individual transport modes
 * - Comparing emissions across all transport modes
 * - Computing savings compared to baseline
 * - Converting emissions to carbon credits
 * - Estimating carbon credit prices
 * 
 * Requires CONFIG object to be loaded first
 */

const Calculator = {
  /**
   * Calculates CO2 emission for a specific distance and transport mode
   * Formula: distance (km) × emission factor (kg CO2/km) = total emission (kg CO2)
   * 
   * @param {number} distanceKm - Distance traveled in kilometers
   * @param {string} transportMode - Transport mode key (bicycle, car, bus, truck)
   * @returns {number} Total emission in kg CO2, rounded to 2 decimal places
   * @throws {Error} If transport mode not found in CONFIG.EMISSION_FACTORS
   */
  calculateEmission: function(distanceKm, transportMode) {
    // Get emission factor from configuration
    const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];

    // Verify transport mode exists
    if (emissionFactor === undefined) {
      console.error(`Transport mode "${transportMode}" not found in CONFIG.EMISSION_FACTORS`);
      return 0;
    }

    // Calculate emission: distance × factor
    const emission = distanceKm * emissionFactor;

    // Return rounded to 2 decimal places
    return Math.round(emission * 100) / 100;
  },

  /**
   * Calculates emissions for all transport modes and compares each to car baseline
   * Useful for displaying comparative analysis of different transport options
   * 
   * @param {number} distanceKm - Distance traveled in kilometers
   * @returns {Array<Object>} Sorted array of emissions by mode with comparative data
   *          Each object contains: {mode, emission, percentVsCar}
   * @example
   * // Returns:
   * [
   *   { mode: 'bicycle', emission: 0, percentVsCar: 0 },
   *   { mode: 'bus', emission: 8.9, percentVsCar: 74.2 },
   *   { mode: 'car', emission: 12, percentVsCar: 100 },
   *   { mode: 'truck', emission: 96, percentVsCar: 800 }
   * ]
   */
  calculateAllModes: function(distanceKm) {
    // Array to store calculation results
    const results = [];

    // First, calculate car emission as baseline for percentage calculations
    const carEmission = this.calculateEmission(distanceKm, "car");

    // Calculate emission for each transport mode
    for (const mode in CONFIG.EMISSION_FACTORS) {
      // Calculate emission for this mode
      const emission = this.calculateEmission(distanceKm, mode);

      // Calculate percentage compared to car baseline
      const percentVsCar = carEmission > 0 
        ? Math.round((emission / carEmission) * 100 * 100) / 100 
        : 0;

      // Add result to array
      results.push({
        mode: mode,
        emission: emission,
        percentVsCar: percentVsCar
      });
    }

    // Sort array by emission (lowest to highest - most eco-friendly first)
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * Calculates CO2 savings achieved by choosing a cleaner transport mode
   * Compares selected mode emission to a baseline (typically car)
   * 
   * @param {number} emission - Emission of chosen mode in kg CO2
   * @param {number} baselineEmission - Emission of baseline mode in kg CO2 (usually car)
   * @returns {Object} Savings data: {savedKg, percentage}
   * @example
   * // If car = 12 kg, bicycle = 0 kg:
   * // Returns: { savedKg: 12, percentage: 100 }
   */
  calculateSavings: function(emission, baselineEmission) {
    // Calculate absolute savings in kg
    const savedKg = Math.round((baselineEmission - emission) * 100) / 100;

    // Calculate percentage savings relative to baseline
    const percentage = baselineEmission > 0
      ? Math.round((savedKg / baselineEmission) * 100 * 100) / 100
      : 0;

    return {
      savedKg: savedKg,
      percentage: percentage
    };
  },

  /**
   * Converts kg of CO2 emissions to carbon credits
   * Based on CONFIG.CARBON_CREDIT.KG_PER_CREDIT
   * 
   * @param {number} emissionKg - Total CO2 emission in kilograms
   * @returns {number} Number of carbon credits needed to offset, rounded to 4 decimal places
   * @example
   * // If emission = 1500 kg and 1 credit = 1000 kg:
   * // Returns: 1.5
   */
  calculateCarbonCredits: function(emissionKg) {
    // Divide emission by credits per kg to get total credits needed
    const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    // Return rounded to 4 decimal places for precision
    return Math.round(credits * 10000) / 10000;
  },

  /**
   * Estimates the price range for carbon credits based on quantity
   * Uses min and max prices defined in CONFIG.CARBON_CREDIT
   * 
   * @param {number} credits - Number of carbon credits
   * @returns {Object} Price estimation: {min, max, average}
   *          All values in Brazilian Real (BRL), rounded to 2 decimal places
   * @example
   * // With 2 credits, min = R$50, max = R$150:
   * // Returns: { min: 100, max: 300, average: 200 }
   */
  estimatedCreditPrice: function(credits) {
    // Calculate minimum price: credits × minimum price per credit
    const min = Math.round(credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL * 100) / 100;

    // Calculate maximum price: credits × maximum price per credit
    const max = Math.round(credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL * 100) / 100;

    // Calculate average price: (min + max) / 2
    const average = Math.round(((min + max) / 2) * 100) / 100;

    return {
      min: min,
      max: max,
      average: average
    };
  }
};
