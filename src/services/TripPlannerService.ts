// Trip Planner Service for AI integration
// This would integrate with Gemini API and Tavily API in a real implementation

interface TripFormData {
  destination: string;
  date: Date | undefined;
  people: number;
  budget: number;
  experienceType: number;
}

interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
}

interface Activity {
  name: string;
  duration: string;
  cost: number;
  description: string;
  category: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
  estimatedCost: number;
}

interface TripPlan {
  destination: string;
  totalDays: number;
  totalCost: number;
  costPerPerson: number;
  hotels: Hotel[];
  dayPlans: DayPlan[];
  overview: string;
  tips: string[];
}

export class TripPlannerService {
  private static API_KEY_STORAGE_KEY = 'gemini_api_key';
  private static TAVILY_API_KEY_STORAGE_KEY = 'tavily_api_key';

  static saveApiKeys(geminiKey: string, tavilyKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, geminiKey);
    localStorage.setItem(this.TAVILY_API_KEY_STORAGE_KEY, tavilyKey);
    console.log('API keys saved successfully');
  }

  static getApiKeys(): { gemini: string | null; tavily: string | null } {
    return {
      gemini: localStorage.getItem(this.API_KEY_STORAGE_KEY),
      tavily: localStorage.getItem(this.TAVILY_API_KEY_STORAGE_KEY)
    };
  }

  static async generateTripPlan(formData: TripFormData): Promise<{ success: boolean; data?: TripPlan; error?: string }> {
    try {
      // In a real implementation, this would:
      // 1. Use Tavily API to fetch destination information
      // 2. Use Gemini API to generate personalized itinerary
      // 3. Process the data and return structured trip plan

      console.log('Generating trip plan for:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock data based on form inputs
      const tripPlan = this.generateMockTripPlan(formData);

      return { success: true, data: tripPlan };
    } catch (error) {
      console.error('Error generating trip plan:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate trip plan' 
      };
    }
  }

  private static generateMockTripPlan(formData: TripFormData): TripPlan {
    const { destination, people, budget, experienceType } = formData;
    
    // Calculate days based on budget
    const totalDays = Math.min(Math.max(Math.floor(budget / 8000), 3), 14);
    const budgetPerDay = budget / totalDays;
    
    // Adjust pricing based on experience type
    const luxuryMultiplier = 1 + (experienceType / 100);
    
    // Generate hotels based on experience type
    const hotels: Hotel[] = [];
    if (experienceType <= 25) {
      hotels.push({
        name: `${destination} Backpacker's Haven`,
        rating: 4.1,
        pricePerNight: Math.round(1500 * luxuryMultiplier),
        description: "Clean, comfortable hostel with great social atmosphere and local vibes.",
        amenities: ["Free WiFi", "Shared Kitchen", "Common Area", "Laundry", "24/7 Reception"]
      });
    } else if (experienceType <= 50) {
      hotels.push({
        name: `${destination} Comfort Inn & Suites`,
        rating: 4.3,
        pricePerNight: Math.round(3500 * luxuryMultiplier),
        description: "Modern hotel offering great value with excellent amenities and service.",
        amenities: ["Free WiFi", "Breakfast", "Gym", "Pool", "Room Service", "Parking"]
      });
    } else if (experienceType <= 75) {
      hotels.push({
        name: `${destination} Premium Resort`,
        rating: 4.6,
        pricePerNight: Math.round(7500 * luxuryMultiplier),
        description: "Upscale resort with premium amenities and exceptional service.",
        amenities: ["Free WiFi", "Spa", "Fine Dining", "Concierge", "Pool", "Beach Access"]
      });
    } else {
      hotels.push({
        name: `The Luxury ${destination} Collection`,
        rating: 4.9,
        pricePerNight: Math.round(15000 * luxuryMultiplier),
        description: "Ultra-luxury hotel offering world-class amenities and personalized service.",
        amenities: ["Butler Service", "Private Pool", "Michelin Star Dining", "Spa", "Helicopter Tours", "Private Beach"]
      });
    }

    // Generate daily plans
    const dayPlans: DayPlan[] = [];
    const themes = [
      "Arrival & City Exploration",
      "Cultural Heritage Tour", 
      "Adventure & Nature",
      "Local Cuisine & Markets",
      "Art & Museums",
      "Relaxation & Wellness",
      "Shopping & Entertainment",
      "Departure & Last Moments"
    ];

    for (let day = 1; day <= totalDays; day++) {
      const theme = themes[(day - 1) % themes.length];
      const activities: Activity[] = [];
      
      // Generate 3-4 activities per day based on experience type
      const activityCount = experienceType <= 25 ? 3 : experienceType <= 75 ? 4 : 5;
      
      for (let i = 0; i < activityCount; i++) {
        activities.push({
          name: this.generateActivityName(destination, theme, i, experienceType),
          duration: ["2 hours", "3 hours", "Half day", "Full day"][Math.floor(Math.random() * 4)],
          cost: Math.round((500 + Math.random() * 3000) * luxuryMultiplier),
          description: this.generateActivityDescription(theme, experienceType),
          category: this.getActivityCategory(theme, i)
        });
      }

      const estimatedCost = activities.reduce((sum, activity) => sum + activity.cost, 0);
      
      dayPlans.push({
        day,
        theme,
        activities,
        estimatedCost
      });
    }

    const totalCost = dayPlans.reduce((sum, day) => sum + day.estimatedCost, 0) + 
                     (hotels[0].pricePerNight * totalDays);
    
    return {
      destination,
      totalDays,
      totalCost,
      costPerPerson: Math.round(totalCost / people),
      hotels,
      dayPlans,
      overview: this.generateOverview(destination, totalDays, experienceType),
      tips: this.generateTips(destination, experienceType)
    };
  }

  private static generateActivityName(destination: string, theme: string, index: number, experienceType: number): string {
    const activities = {
      "Arrival & City Exploration": [
        `${destination} Walking Tour`,
        "Historic City Center Visit",
        "Local Orientation & Welcome Dinner",
        "Sunset Viewpoint Tour"
      ],
      "Cultural Heritage Tour": [
        "Heritage Sites & Monuments",
        "Traditional Dance Performance",
        "Local Art Gallery Visit",
        "Historical Museum Tour"
      ],
      "Adventure & Nature": [
        "Nature Hiking Trail",
        "Water Sports Adventure",
        "Wildlife Safari Tour",
        "Mountain Trekking Experience"
      ],
      "Local Cuisine & Markets": [
        "Street Food Walking Tour",
        "Cooking Class Experience",
        "Local Market Exploration",
        "Wine/Tea Tasting Session"
      ]
    };

    const baseActivities = activities[theme as keyof typeof activities] || ["City Tour", "Local Experience", "Cultural Visit", "Scenic Tour"];
    const activity = baseActivities[index % baseActivities.length];
    
    if (experienceType > 75) {
      return `Private ${activity}`;
    } else if (experienceType > 50) {
      return `Premium ${activity}`;
    }
    
    return activity;
  }

  private static generateActivityDescription(theme: string, experienceType: number): string {
    const descriptions = {
      low: "An authentic local experience that offers great value and genuine cultural immersion.",
      medium: "A well-organized experience combining comfort with authentic local culture and history.",
      high: "A premium experience with expert guides, exclusive access, and luxury amenities.",
      luxury: "An ultra-luxury experience with private access, world-class service, and exclusive perks."
    };

    const level = experienceType <= 25 ? 'low' : experienceType <= 50 ? 'medium' : experienceType <= 75 ? 'high' : 'luxury';
    return descriptions[level];
  }

  private static getActivityCategory(theme: string, index: number): string {
    const categories = ["Cultural", "Adventure", "Food & Drink", "Sightseeing", "Entertainment", "Wellness"];
    return categories[index % categories.length];
  }

  private static generateOverview(destination: string, days: number, experienceType: number): string {
    const experienceLevel = experienceType <= 25 ? "budget-friendly adventure" : 
                           experienceType <= 50 ? "comfortable exploration" :
                           experienceType <= 75 ? "premium journey" : "luxury expedition";
    
    return `Experience the best of ${destination} in this carefully crafted ${days}-day ${experienceLevel}. From iconic landmarks to hidden gems, this itinerary balances must-see attractions with authentic local experiences.`;
  }

  private static generateTips(destination: string, experienceType: number): string[] {
    const tips = [
      `Best time to visit ${destination} is during the shoulder season for fewer crowds and better prices.`,
      "Download offline maps and translation apps before you go for easier navigation.",
      "Try to learn a few basic phrases in the local language - locals appreciate the effort!",
      "Pack comfortable walking shoes as you'll be doing lots of exploring on foot.",
      "Keep digital and physical copies of important documents in separate locations."
    ];

    if (experienceType > 50) {
      tips.push("Consider hiring a private guide for personalized insights and skip-the-line access.");
      tips.push("Make restaurant reservations in advance, especially for popular or high-end establishments.");
    }

    if (experienceType > 75) {
      tips.push("Arrange for private airport transfers and concierge services for a seamless experience.");
    }

    return tips;
  }

  // For future integration with real APIs
  static async testApiConnection(geminiKey: string, tavilyKey: string): Promise<boolean> {
    try {
      // Test Gemini API connection
      // Test Tavily API connection
      // Return true if both work
      console.log('Testing API connections...');
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}