/**
 * UI - Global object for user interface operations
 * 
 * Contains utility methods for DOM manipulation and rendering methods
 * for displaying calculation results, comparisons, and carbon credits
 * 
 * Requires CONFIG and Calculator objects to be loaded first
 */

const UI = {
  /* ================================================
     UTILITY METHODS
     ================================================ */

  /**
   * Formats a number with specified decimal places and thousand separators
   * Uses Brazilian locale (pt-BR) for proper formatting
   * 
   * @param {number} number - The number to format
   * @param {number} decimals - Number of decimal places to show
   * @returns {string} Formatted number string (e.g., "1.234,56")
   */
  formatNumber: function(number, decimals = 2) {
    return parseFloat(number).toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Formats a value as Brazilian currency (BRL)
   * 
   * @param {number} value - The value to format
   * @returns {string} Formatted currency string (e.g., "R$ 1.234,56")
   */
  formatCurrency: function(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  },

  /**
   * Shows an element by removing the 'hidden' class
   * 
   * @param {string} elementId - The ID of the element to show
   * @returns {void}
   */
  showElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("hidden");
    }
  },

  /**
   * Hides an element by adding the 'hidden' class
   * 
   * @param {string} elementId - The ID of the element to hide
   * @returns {void}
   */
  hideElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("hidden");
    }
  },

  /**
   * Smoothly scrolls to an element on the page
   * 
   * @param {string} elementId - The ID of the element to scroll to
   * @returns {void}
   */
  scrollToElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  /* ================================================
     RENDERING METHODS
     ================================================ */

  /**
   * Renders the results section with trip and emission details
   * Creates cards displaying: route, distance, emission, transport mode, and savings
   * 
   * @param {Object} data - Result data object
   * @param {string} data.origin - Origin city
   * @param {string} data.destination - Destination city
   * @param {number} data.distance - Distance in km
   * @param {number} data.emission - Emission in kg CO2
   * @param {string} data.mode - Transport mode (bicycle, car, bus, truck)
   * @param {Object} [data.savings] - Savings object with savedKg and percentage
   * @returns {string} Complete HTML string for results section
   */
  renderResults: function(data) {
    const mode = CONFIG.TRANSPORT_MODES[data.mode];
    if (!mode) {
      console.error(`Transport mode "${data.mode}" not found in CONFIG`);
      return "";
    }

    // Route card - shows origin to destination
    const routeCard = `
      <div class="results__card">
        <div class="results__card-title">🗺️ Rota</div>
        <div class="results__card-content">
          <strong>${data.origin}</strong> → <strong>${data.destination}</strong>
        </div>
      </div>
    `;

    // Distance card - shows travel distance
    const distanceCard = `
      <div class="results__card">
        <div class="results__card-title">📏 Distância</div>
        <div class="results__card-content">${this.formatNumber(data.distance, 0)} km</div>
      </div>
    `;

    // Emission card - shows CO2 emission
    const emissionCard = `
      <div class="results__card">
        <div class="results__card-title">🍃 Emissão CO₂</div>
        <div class="results__card-content">${this.formatNumber(data.emission, 2)} kg</div>
      </div>
    `;

    // Transport mode card - shows selected transport
    const modeCard = `
      <div class="results__card">
        <div class="results__card-title">🚗 Transporte</div>
        <div class="results__card-content">${mode.icon} ${mode.label}</div>
      </div>
    `;

    // Savings card - only shown if mode is not car
    let savingsCard = "";
    if (data.mode !== "car" && data.savings) {
      savingsCard = `
        <div class="results__card results__card--savings">
          <div class="results__card-title">✨ Economizado</div>
          <div class="results__card-content">${this.formatNumber(data.savings.savedKg, 2)} kg</div>
          <div class="results__card-subtitle">${this.formatNumber(data.savings.percentage, 0)}% menos</div>
        </div>
      `;
    }

    return routeCard + distanceCard + emissionCard + modeCard + savingsCard;
  },

  /**
   * Renders comparison cards for all transport modes
   * Shows emissions and percentage vs car baseline with color-coded progress bars
   * 
   * @param {Array<Object>} modesArray - Array from Calculator.calculateAllModes()
   * @param {string} selectedMode - The currently selected transport mode
   * @returns {string} Complete HTML string for comparison section
   */
  renderComparison: function(modesArray, selectedMode) {
    // Find max emission for progress bar scaling
    const maxEmission = Math.max(...modesArray.map(m => m.emission));
    const maxForScale = maxEmission > 0 ? maxEmission : 100;

    // Generate HTML for each mode
    const modeCards = modesArray.map(item => {
      const modeConfig = CONFIG.TRANSPORT_MODES[item.mode];
      if (!modeConfig) return "";

      // Calculate progress bar width (0-100%)
      const barWidth = (item.emission / maxForScale) * 100;

      // Determine progress bar color based on percentage vs car
      let barColor = "#10b981"; // Green: 0-25%
      if (item.percentVsCar > 25 && item.percentVsCar <= 75) {
        barColor = "#f59e0b"; // Yellow: 25-75%
      } else if (item.percentVsCar > 75 && item.percentVsCar <= 100) {
        barColor = "#ef4444"; // Orange: 75-100%
      } else if (item.percentVsCar > 100) {
        barColor = "#991b1b"; // Dark red: >100%
      }

      // Check if this is the selected mode
      const isSelected = item.mode === selectedMode;
      const selectedClass = isSelected ? " comparison__item--selected" : "";

      // Build selected badge if applicable
      const selectedBadge = isSelected ? '<span class="comparison__badge">✓ Selecionado</span>' : "";

      return `
        <div class="comparison__item${selectedClass}">
          <div class="comparison__header">
            <span class="comparison__icon">${modeConfig.icon}</span>
            <div class="comparison__info">
              <h4 class="comparison__mode-name">${modeConfig.label}</h4>
              ${selectedBadge}
            </div>
          </div>
          
          <div class="comparison__stats">
            <p class="comparison__emission">${this.formatNumber(item.emission, 2)} kg</p>
            <p class="comparison__percent">${this.formatNumber(item.percentVsCar, 1)}% vs Carro</p>
          </div>
          
          <div class="comparison__progress-container">
            <div class="comparison__progress-bar" style="width: ${barWidth}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join("");

    // Tip box with helpful message
    const tipBox = `
      <div class="comparison__tip">
        <span class="comparison__tip-icon">💡</span>
        <p class="comparison__tip-text">Escolha a opção mais sustentável para reduzir seu impacto.</p>
      </div>
    `;

    return modeCards + tipBox;
  },

  /**
   * Renders carbon credits section with needed credits and price estimation
   * Shows grid with credits needed and estimated price range
   * 
   * @param {Object} creditsData - Carbon credits data object
   * @param {number} creditsData.credits - Number of credits needed
   * @param {number} creditsData.emission - Total emission in kg CO2
   * @param {Object} creditsData.pricing - Pricing object from Calculator.estimatedCreditPrice()
   * @param {number} creditsData.pricing.min - Minimum price in R$
   * @param {number} creditsData.pricing.max - Maximum price in R$
   * @param {number} creditsData.pricing.average - Average price in R$
   * @returns {string} Complete HTML string for carbon credits section
   */
  renderCarbonCredits: function(creditsData) {
    // Card 1: Credits needed
    const creditsCard = `
      <div class="carbon-credits__card">
        <div class="carbon-credits__card-header">
          <h3 class="carbon-credits__card-title">🌍 Créditos Necessários</h3>
        </div>
        <div class="carbon-credits__card-content">
          <p class="carbon-credits__credits-number">${this.formatNumber(creditsData.credits, 4)}</p>
          <p class="carbon-credits__helper-text">≈ ${this.formatNumber(creditsData.emission, 2)} kg CO₂</p>
          <p class="carbon-credits__info-text">1 crédito = 1.000 kg CO₂</p>
        </div>
      </div>
    `;

    // Card 2: Estimated price range
    const priceCard = `
      <div class="carbon-credits__card">
        <div class="carbon-credits__card-header">
          <h3 class="carbon-credits__card-title">💰 Valor Estimado</h3>
        </div>
        <div class="carbon-credits__card-content">
          <p class="carbon-credits__price-average">${this.formatCurrency(creditsData.pricing.average)}</p>
          <p class="carbon-credits__price-range">R$ ${this.formatNumber(creditsData.pricing.min, 2)} - R$ ${this.formatNumber(creditsData.pricing.max, 2)}</p>
          <p class="carbon-credits__info-text">Varia com o mercado</p>
        </div>
      </div>
    `;

    // Info box
    const infoBox = `
      <div class="carbon-credits__info-box">
        <h4 class="carbon-credits__info-title">ℹ️ O que são Créditos de Carbono?</h4>
        <p class="carbon-credits__info-content">
          Certificados que representam o direito de emitir uma tonelada de CO₂. Ao compensar, você investe em projetos de reflorestamento e energia limpa.
        </p>
      </div>
    `;

    // Action button
    const actionButton = `
      <div class="carbon-credits__action">
        <button class="carbon-credits__button" onclick="alert('Funcionalidade em desenvolvimento')">
          🛒 Compensar Emissões
        </button>
      </div>
    `;

    return creditsCard + priceCard + infoBox + actionButton;
  },

  /* ================================================
     LOADING STATE METHODS
     ================================================ */

  /**
   * Shows loading state on a button
   * Saves original text and displays spinner with "Calculando..." message
   * 
   * @param {HTMLElement} buttonElement - The button element to show loading on
   * @returns {void}
   */
  showLoading: function(buttonElement) {
    // Save original text for later restoration
    buttonElement.dataset.originalText = buttonElement.textContent;

    // Disable button while calculating
    buttonElement.disabled = true;

    // Update button content to show spinner and loading message
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Hides loading state on a button
   * Restores original button text and re-enables the button
   * 
   * @param {HTMLElement} buttonElement - The button element to hide loading from
   * @returns {void}
   */
  hideLoading: function(buttonElement) {
    // Re-enable button
    buttonElement.disabled = false;

    // Restore original text from saved data attribute
    if (buttonElement.dataset.originalText) {
      buttonElement.textContent = buttonElement.dataset.originalText;
    }
  }
};
