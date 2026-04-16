/**
 * CONFIG - Global configuration object for CarbonCalc
 * 
 * Contains:
 * - Emission factors for different transport modes
 * - Transport mode metadata (labels, icons, colors)
 * - Carbon credit pricing information
 * - Methods for UI initialization and distance autofill
 */

const CONFIG = {
  /**
   * Emission factors in kg CO2 per km
   * Used to calculate carbon emissions for each transport mode
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  /**
   * Transport mode metadata
   * Contains display information and styling for each transport mode
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#10b981"  // Green
    },
    car: {
      label: "Carro",
      icon: "🚘",
      color: "#3b82f6"  // Blue
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b"  // Amber
    },
    truck: {
      label: "Caminhão",
      icon: "🚛",
      color: "#ef4444"  // Red
    }
  },

  /**
   * Carbon credit configuration
   * Information for carbon offset credits
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,        // 1 credit = 1000 kg CO2
    PRICE_MIN_BRL: 50,          // Minimum price in Brazilian Real
    PRICE_MAX_BRL: 150          // Maximum price in Brazilian Real
  },

  /**
   * Populates the cities datalist with all available cities from RoutesDB
   * Creates and appends option elements for each city
   * Must be called after RoutesDB is loaded
   * 
   * @returns {void}
   */
  populateDatalist: function() {
    // Get the datalist element
    const datalist = document.getElementById("cities-list");
    
    // Verify datalist exists
    if (!datalist) {
      console.error("Datalist element with id 'cities-list' not found");
      return;
    }

    // Get all unique cities from RoutesDB
    const cities = RoutesDB.getAllCities();

    // Create and append option elements for each city
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });

    console.log(`Populated datalist with ${cities.length} cities`);
  },

  /**
   * Sets up automatic distance filling based on route selection
   * Monitors origin and destination inputs and auto-fills distance if route exists
   * Allows manual override via checkbox
   * Must be called after DOM is ready and RoutesDB is loaded
   * 
   * @returns {void}
   */
  setupDistanceAutofill: function() {
    // Get form input elements
    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destination");
    const distanceInput = document.getElementById("distance");
    const manualCheckbox = document.getElementById("manual-distance-checkbox");

    // Verify all elements exist
    if (!originInput || !destinationInput || !distanceInput) {
      console.error("Required input elements not found for distance autofill setup");
      return;
    }

    /**
     * Helper function to attempt auto-filling distance
     */
    const autoFillDistance = () => {
      // Skip if manual mode is enabled
      if (manualCheckbox && manualCheckbox.checked) {
        return;
      }

      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      // Only proceed if both cities are provided
      if (!origin || !destination) {
        return;
      }

      // Find distance using RoutesDB
      const distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        // Route found - auto-fill and lock distance input
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        
        // Update helper text to green (success)
        const helperText = distanceInput.parentElement?.querySelector(".helper-text");
        if (helperText) {
          helperText.textContent = "✓ Distância encontrada automaticamente";
          helperText.style.color = "#10b981";  // Green
        }
      } else {
        // Route not found - clear and unlock distance input
        distanceInput.value = "";
        distanceInput.readOnly = false;
        
        // Update helper text with suggestion
        const helperText = distanceInput.parentElement?.querySelector(".helper-text");
        if (helperText) {
          helperText.textContent = "Rota não encontrada. Digite a distância manualmente.";
          helperText.style.color = "#f59e0b";  // Amber
        }
      }
    };

    // Add change event listeners to origin and destination inputs
    originInput.addEventListener("change", autoFillDistance);
    destinationInput.addEventListener("change", autoFillDistance);

    // Add change listener to manual checkbox if it exists
    if (manualCheckbox) {
      manualCheckbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          // Manual mode enabled - unlock distance input
          distanceInput.readOnly = false;
          const helperText = distanceInput.parentElement?.querySelector(".helper-text");
          if (helperText) {
            helperText.textContent = "Modo manual: Digite a distância";
            helperText.style.color = "#6b7280";  // Gray
          }
        } else {
          // Manual mode disabled - try to auto-fill again
          autoFillDistance();
        }
      });
    }

    console.log("Distance autofill setup completed");
  }
};
