/**
 * RoutesDB - Database of popular Brazilian routes
 * 
 * Global object containing:
 * - routes: Array of route objects with origin, destination, and distance
 * - Methods to query and retrieve route information
 */

const RoutesDB = {
  /**
   * Array of popular Brazilian routes
   * Each route object contains:
   * - origin: string (city name with state, e.g., "Goiânia, GO")
   * - destination: string (city name with state)
   * - distanceKm: number (approximate distance in kilometers)
   */
  routes: [
    // Capital to Capital Routes
    { origin: "Brasília, DF", destination: "São Paulo, SP", distanceKm: 1015 },
    { origin: "Brasília, DF", destination: "Rio de Janeiro, RJ", distanceKm: 1150 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 210 },
    { origin: "Brasília, DF", destination: "Belo Horizonte, MG", distanceKm: 735 },
    { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1605 },
    { origin: "Brasília, DF", destination: "Recife, PE", distanceKm: 1900 },
    { origin: "Brasília, DF", destination: "Fortaleza, CE", distanceKm: 2150 },
    { origin: "Brasília, DF", destination: "Manaus, AM", distanceKm: 2505 },
    { origin: "Brasília, DF", destination: "Curitiba, PR", distanceKm: 1100 },
    { origin: "Brasília, DF", destination: "Porto Alegre, RS", distanceKm: 1745 },

    // South-Southeast Routes
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 400 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 585 },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 100 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 25 },
    { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 1135 },
    { origin: "Belo Horizonte, MG", destination: "Rio de Janeiro, RJ", distanceKm: 600 },
    { origin: "Belo Horizonte, MG", destination: "Salvador, BA", distanceKm: 1300 },

    // Northeast Routes
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 840 },
    { origin: "Salvador, BA", destination: "Fortaleza, CE", distanceKm: 1220 },
    { origin: "Salvador, BA", destination: "Natal, RN", distanceKm: 1000 },
    { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 630 },
    { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 540 },
    { origin: "Fortaleza, CE", destination: "São Luís, MA", distanceKm: 950 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 270 },

    // North Routes
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1420 },
    { origin: "Belém, PA", destination: "São Luís, MA", distanceKm: 900 },
    { origin: "Goiânia, GO", destination: "Palmas, TO", distanceKm: 730 },

    // Central-West Routes
    { origin: "Goiânia, GO", destination: "Cuiabá, MT", distanceKm: 700 },
    { origin: "Goiânia, GO", destination: "Dourados, MS", distanceKm: 880 },
    { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 1100 },
    { origin: "Campo Grande, MS", destination: "São Paulo, SP", distanceKm: 1120 },

    // Southeast-South Routes
    { origin: "Campinas, SP", destination: "Rio de Janeiro, RJ", distanceKm: 490 },
    { origin: "Santos, SP", destination: "Curitiba, PR", distanceKm: 370 },
    { origin: "Ribeirão Preto, SP", destination: "Goiânia, GO", distanceKm: 630 },
    { origin: "Sorocaba, SP", destination: "Curitiba, PR", distanceKm: 470 },
    { origin: "Brasília, DF", destination: "Tocantins, TO", distanceKm: 860 },
    { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKm: 1135 },
    { origin: "Porto Alegre, RS", destination: "São Paulo, SP", distanceKm: 1505 },
  ],

  /**
   * Retrieves all unique city names from routes (both origin and destination)
   * Returns a sorted alphabetical array
   * 
   * @returns {Array<string>} Sorted array of unique city names with state abbreviations
   */
  getAllCities: function() {
    const cities = new Set();
    
    // Extract all unique cities from routes
    this.routes.forEach(route => {
      cities.add(route.origin);
      cities.add(route.destination);
    });
    
    // Convert to array and sort alphabetically
    return Array.from(cities).sort();
  },

  /**
   * Finds the distance between two cities
   * Searches in both directions (origin->destination and destination->origin)
   * Normalizes input by trimming whitespace and converting to lowercase for comparison
   * 
   * @param {string} origin - Origin city name with state (e.g., "São Paulo, SP")
   * @param {string} destination - Destination city name with state
   * @returns {number|null} Distance in kilometers if found, null if route not found
   */
  findDistance: function(origin, destination) {
    // Normalize inputs: trim whitespace and convert to lowercase
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();

    // Search for route in both directions
    for (let route of this.routes) {
      const routeOrigin = route.origin.toLowerCase();
      const routeDestination = route.destination.toLowerCase();

      // Check forward direction (origin -> destination)
      if (routeOrigin === normalizedOrigin && routeDestination === normalizedDestination) {
        return route.distanceKm;
      }

      // Check reverse direction (destination -> origin)
      if (routeOrigin === normalizedDestination && routeDestination === normalizedOrigin) {
        return route.distanceKm;
      }
    }

    // Route not found
    return null;
  }
};
