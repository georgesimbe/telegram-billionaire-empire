import axios from 'axios';

// Real estate API service for digital twin properties
class RealEstateService {
  constructor() {
    this.cache = new Map();
    this.priceHistory = new Map();
  }

  // Fetch real property data (using multiple sources)
  async getPropertyData(propertyId) {
    if (this.cache.has(propertyId)) {
      const cached = this.cache.get(propertyId);
      if (Date.now() - cached.timestamp < 3600000) { // 1 hour cache
        return cached.data;
      }
    }

    try {
      // In production, integrate with real estate APIs like:
      // - Zillow API
      // - Realty Mole API
      // - Rentberry API
      
      // For now, using mock data with real property references
      const property = await this.fetchPropertyFromAPI(propertyId);
      
      this.cache.set(propertyId, {
        data: property,
        timestamp: Date.now()
      });

      return property;
    } catch (error) {
      console.error('Failed to fetch property data:', error);
      return this.getFallbackProperty(propertyId);
    }
  }

  // Mock famous properties with real-world estimates
  async fetchPropertyFromAPI(propertyId) {
    const properties = {
      // Iconic Buildings
      'empire_state': {
        id: 'empire_state',
        name: 'Empire State Building',
        location: { lat: 40.7484, lng: -73.9857, city: 'New York', country: 'USA' },
        type: 'commercial',
        realValue: 2500000000, // $2.5B actual estimated value
        gamePrice: 25000000000, // Game points
        income: 10000000, // Points per day
        prestige: 10000,
        capacity: 1000,
        description: 'Iconic NYC skyscraper',
        image: 'https://example.com/empire-state.jpg',
        stats: {
          floors: 102,
          height: 381,
          built: 1931,
          visitors: 4000000 // Annual
        }
      },
      
      'burj_khalifa': {
        id: 'burj_khalifa',
        name: 'Burj Khalifa',
        location: { lat: 25.1972, lng: 55.2744, city: 'Dubai', country: 'UAE' },
        type: 'mixed',
        realValue: 1500000000,
        gamePrice: 15000000000,
        income: 8000000,
        prestige: 12000,
        capacity: 500,
        description: "World's tallest building",
        stats: {
          floors: 163,
          height: 828,
          built: 2010,
        }
      },
      
      'twin_towers_petronas': {
        id: 'twin_towers_petronas',
        name: 'Petronas Twin Towers',
        location: { lat: 3.1578, lng: 101.7117, city: 'Kuala Lumpur', country: 'Malaysia' },
        type: 'commercial',
        realValue: 2000000000,
        gamePrice: 20000000000,
        income: 9000000,
        prestige: 9000,
        capacity: 800,
        description: 'Iconic twin skyscrapers',
        stats: {
          floors: 88,
          height: 452,
          built: 1998,
        }
      },

      // Luxury Residential
      'one_hyde_park': {
        id: 'one_hyde_park',
        name: 'One Hyde Park Penthouse',
        location: { lat: 51.5025, lng: -0.1602, city: 'London', country: 'UK' },
        type: 'residential',
        realValue: 240000000,
        gamePrice: 2400000000,
        income: 1000000,
        prestige: 5000,
        capacity: 1,
        description: 'Most expensive apartment in London',
        stats: {
          sqft: 25000,
          bedrooms: 6,
          built: 2011,
        }
      },

      // Historic Properties
      'versailles': {
        id: 'versailles',
        name: 'Palace of Versailles',
        location: { lat: 48.8049, lng: 2.1204, city: 'Versailles', country: 'France' },
        type: 'historic',
        realValue: 50000000000, // Priceless, but estimated
        gamePrice: 500000000000,
        income: 50000000,
        prestige: 50000,
        capacity: 2000,
        description: 'Historic French palace',
        stats: {
          rooms: 2300,
          acres: 2000,
          built: 1682,
          visitors: 10000000
        }
      },

      // Tech Campuses
      'apple_park': {
        id: 'apple_park',
        name: 'Apple Park',
        location: { lat: 37.3349, lng: -122.0090, city: 'Cupertino', country: 'USA' },
        type: 'corporate',
        realValue: 5000000000,
        gamePrice: 50000000000,
        income: 20000000,
        prestige: 15000,
        capacity: 1200,
        description: 'Apple headquarters',
        stats: {
          sqft: 2800000,
          employees: 12000,
          built: 2017,
        }
      },

      // Islands
      'necker_island': {
        id: 'necker_island',
        name: 'Necker Island',
        location: { lat: 18.5167, lng: -64.3833, city: 'British Virgin Islands', country: 'UK' },
        type: 'private_island',
        realValue: 100000000,
        gamePrice: 1000000000,
        income: 500000,
        prestige: 8000,
        capacity: 30,
        description: "Richard Branson's private island",
        stats: {
          acres: 74,
          beaches: 5,
          built: 1978,
        }
      }
    };

    // Simulate market fluctuations
    const property = properties[propertyId];
    if (property) {
      const marketMultiplier = 0.9 + Math.random() * 0.2; // ±10% market variation
      property.currentValue = Math.floor(property.realValue * marketMultiplier);
      property.gamePrice = Math.floor(property.gamePrice * marketMultiplier);
      
      // Add price trend
      this.updatePriceHistory(propertyId, property.currentValue);
      property.priceHistory = this.getPriceHistory(propertyId);
      property.trend = this.calculateTrend(property.priceHistory);
    }

    return property;
  }

  // Update price history
  updatePriceHistory(propertyId, price) {
    if (!this.priceHistory.has(propertyId)) {
      this.priceHistory.set(propertyId, []);
    }
    
    const history = this.priceHistory.get(propertyId);
    history.push({
      timestamp: Date.now(),
      price: price
    });
    
    // Keep only last 30 data points
    if (history.length > 30) {
      history.shift();
    }
  }

  // Get price history
  getPriceHistory(propertyId) {
    return this.priceHistory.get(propertyId) || [];
  }

  // Calculate price trend
  calculateTrend(history) {
    if (history.length < 2) return 0;
    
    const recent = history[history.length - 1].price;
    const previous = history[history.length - 2].price;
    
    return ((recent - previous) / previous) * 100;
  }

  // Get properties by location
  async getPropertiesByLocation(city, country) {
    // In production, this would query real estate APIs
    const allProperties = [
      'empire_state', 'burj_khalifa', 'twin_towers_petronas',
      'one_hyde_park', 'versailles', 'apple_park', 'necker_island'
    ];

    const properties = await Promise.all(
      allProperties.map(id => this.getPropertyData(id))
    );

    return properties.filter(p => 
      (!city || p.location.city === city) &&
      (!country || p.location.country === country)
    );
  }

  // Get market trends
  async getMarketTrends() {
    return {
      global: {
        residential: { change: 2.3, forecast: 'stable' },
        commercial: { change: -0.5, forecast: 'declining' },
        luxury: { change: 5.2, forecast: 'bullish' },
      },
      hotCities: ['Dubai', 'Singapore', 'Miami', 'London'],
      emergingMarkets: ['Vietnam', 'Colombia', 'Kenya'],
      warnings: ['NYC commercial bubble', 'London luxury oversupply']
    };
  }

  // Fallback for offline/error scenarios
  getFallbackProperty(propertyId) {
    return {
      id: propertyId,
      name: 'Property ' + propertyId,
      location: { city: 'Unknown', country: 'Unknown' },
      type: 'commercial',
      realValue: 1000000,
      gamePrice: 10000000,
      income: 50000,
      prestige: 100,
      capacity: 10,
      description: 'Standard property',
      offline: true
    };
  }

  // Calculate property income with bonuses
  calculateIncome(property, owner) {
    let baseIncome = property.income;
    
    // Location bonus
    if (property.location.city === 'Dubai') baseIncome *= 1.2;
    if (property.location.city === 'Singapore') baseIncome *= 1.15;
    
    // Property type bonus
    if (property.type === 'luxury' && owner.prestige > 5000) baseIncome *= 1.3;
    if (property.type === 'commercial' && owner.businesses > 10) baseIncome *= 1.2;
    
    // Society bonus
    if (owner.society?.tier === 'DIAMOND') baseIncome *= 1.5;
    
    // Market conditions
    if (property.trend > 5) baseIncome *= 1.1;
    if (property.trend < -5) baseIncome *= 0.9;
    
    return Math.floor(baseIncome);
  }
}

export default new RealEstateService();