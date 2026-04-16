/**
 * APP - Main application logic
 * 
 * Handles:
 * - Initialization of calculator components
 * - Form submission and validation
 * - Emission calculations and rendering
 * - User feedback and error handling
 * 
 * Requires: CONFIG, Calculator, UI, RoutesDB objects
 */

// Use DOMContentLoaded to ensure DOM is fully loaded before running initialization
document.addEventListener("DOMContentLoaded", function() {
  /**
   * ========================================================
   * INITIALIZATION - Run once when page loads
   * ========================================================
   */

  // 1. Populate cities dropdown/datalist with all available cities from RoutesDB
  CONFIG.populateDatalist();

  // 2. Set up automatic distance filling when cities are selected
  CONFIG.setupDistanceAutofill();

  // 3. Get the calculator form element
  const calculatorForm = document.getElementById("calculator-form");

  // 4. Add submit event listener to the form
  if (calculatorForm) {
    calculatorForm.addEventListener("submit", handleFormSubmit);
  }

  // 5. Log successful initialization to console
  console.log("✅ Calculadora inicializada!");

  /**
   * ========================================================
   * FORM SUBMIT HANDLER
   * ========================================================
   */

  /**
   * Handles form submission, validation, and calculation
   * Performs all emissions calculations and renders results
   * 
   * @param {Event} event - The form submit event
   * @returns {void}
   */
  function handleFormSubmit(event) {
    // Prevent default form submission behavior (page reload)
    event.preventDefault();

    /**
     * ========================================================
     * 1. GET FORM VALUES
     * ========================================================
     */

    // Get all input values from the form
    const originCity = document.getElementById("origin").value.trim();
    const destinationCity = document.getElementById("destination").value.trim();
    const distanceKm = parseFloat(document.getElementById("distance").value);
    const transportMode = document.querySelector('input[name="transport"]:checked').value;

    /**
     * ========================================================
     * 2. VALIDATE INPUTS
     * ========================================================
     */

    // Check if origin is provided
    if (!originCity) {
      alert("Por favor, selecione uma cidade de origem.");
      return;
    }

    // Check if destination is provided
    if (!destinationCity) {
      alert("Por favor, selecione uma cidade de destino.");
      return;
    }

    // Check if distance is provided
    if (!distanceKm || isNaN(distanceKm)) {
      alert("Por favor, insira uma distância válida.");
      return;
    }

    // Check if distance is positive
    if (distanceKm <= 0) {
      alert("A distância deve ser maior que zero.");
      return;
    }

    /**
     * ========================================================
     * 3. PREPARE UI FOR CALCULATION
     * ========================================================
     */

    // Get the submit button to show loading state
    const submitButton = calculatorForm.querySelector('button[type="submit"]');

    // Show loading indicator on button
    UI.showLoading(submitButton);

    // Hide previous results sections so they don't show old data
    UI.hideElement("results");
    UI.hideElement("comparison");
    UI.hideElement("carbon-content");

    /**
     * ========================================================
     * 4. SIMULATE PROCESSING WITH TIMEOUT
     * ========================================================
     */

    // Use setTimeout to simulate processing delay and show loading state to user
    setTimeout(function() {
      try {
        /**
         * ========================================================
         * CALCULATIONS
         * ========================================================
         */

        // Calculate emission for the selected transport mode
        const selectedModeEmission = Calculator.calculateEmission(
          distanceKm,
          transportMode
        );

        // Calculate car emission as baseline for comparison
        const carEmission = Calculator.calculateEmission(distanceKm, "car");

        // Calculate savings compared to car (if mode is not car)
        const savings = transportMode !== "car"
          ? Calculator.calculateSavings(selectedModeEmission, carEmission)
          : null;

        // Calculate emissions for all transport modes for comparison
        const allModesComparison = Calculator.calculateAllModes(distanceKm);

        // Calculate carbon credits needed to offset emissions
        const creditsNeeded = Calculator.calculateCarbonCredits(selectedModeEmission);

        // Estimate carbon credit prices
        const creditPricing = Calculator.estimatedCreditPrice(creditsNeeded);

        /**
         * ========================================================
         * PREPARE DATA FOR RENDERING
         * ========================================================
         */

        // Build data object for results rendering
        const resultsData = {
          origin: originCity,
          destination: destinationCity,
          distance: distanceKm,
          emission: selectedModeEmission,
          mode: transportMode,
          savings: savings
        };

        // Build data object for carbon credits
        const creditsData = {
          credits: creditsNeeded,
          emission: selectedModeEmission,
          pricing: creditPricing
        };

        /**
         * ========================================================
         * RENDER RESULTS
         * ========================================================
         */

        // Render and display results (route, distance, emission, mode)
        const resultsHTML = UI.renderResults(resultsData);
        document.getElementById("results-content").innerHTML = resultsHTML;

        // Render and display mode comparison with color-coded bars
        const comparisonHTML = UI.renderComparison(
          allModesComparison,
          transportMode
        );
        document.getElementById("comparison-content").innerHTML = comparisonHTML;

        // Render and display carbon credits information and pricing
        const creditsHTML = UI.renderCarbonCredits(creditsData);
        document.getElementById("carbon-credits-content").innerHTML = creditsHTML;

        /**
         * ========================================================
         * DISPLAY SECTIONS AND SCROLL
         * ========================================================
         */

        // Show results section
        UI.showElement("results");

        // Show comparison section
        UI.showElement("comparison");

        // Show carbon credits section
        UI.showElement("carbon-content");

        // Scroll smoothly to results section to show user the results
        UI.scrollToElement("results");

        // Log successful calculation to console
        console.log("✅ Cálculo completado com sucesso", {
          origin: originCity,
          destination: destinationCity,
          distance: distanceKm,
          mode: transportMode,
          emission: selectedModeEmission
        });
      } catch (error) {
        /**
         * ========================================================
         * ERROR HANDLING
         * ========================================================
         */

        // Log detailed error information to console for debugging
        console.error("❌ Erro ao calcular emissões:", error);

        // Show user-friendly error message
        alert(
          "Ocorreu um erro ao calcular as emissões. Por favor, tente novamente.\n\n" +
          "Detalhes: " + error.message
        );
      } finally {
        /**
         * ========================================================
         * CLEANUP
         * ========================================================
         */

        // Hide loading indicator and restore button text
        UI.hideLoading(submitButton);
      }
    }, 1500); // Simulate 1.5 seconds of processing time
  }
});
