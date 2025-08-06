import { useState, useEffect } from 'react';
import { TripPlannerForm } from '@/components/TripPlannerForm';
import { TripResults } from '@/components/TripResults';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { TripPlannerService } from '@/services/TripPlannerService';
import { useToast } from "@/components/ui/use-toast";
import heroImage from '@/assets/travel-hero.jpg';
import { Plane, Sparkles } from 'lucide-react';

interface TripFormData {
  destination: string;
  date: Date | undefined;
  people: number;
  budget: number;
  experienceType: number;
}

interface TripPlan {
  destination: string;
  totalDays: number;
  totalCost: number;
  costPerPerson: number;
  hotels: any[];
  dayPlans: any[];
  overview: string;
  tips: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);

  useEffect(() => {
    setHasApiKeys(true); // API keys are now hardcoded
  }, []);

  const handleApiSetupComplete = () => {
    setHasApiKeys(true);
  };

  const handlePlanTrip = async (data: TripFormData) => {
    setIsGeneratingPlan(true);
    setFormData(data);
    
    try {
      const result = await TripPlannerService.generateTripPlan(data);
      
      if (result.success && result.data) {
        setTripPlan(result.data);
        toast({
          title: "Trip Plan Ready! 🎉",
          description: `Your ${data.destination} adventure has been planned!`,
        });
      } else {
        toast({
          title: "Planning Failed",
          description: result.error || "Unable to generate trip plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while planning your trip.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handlePlanNewTrip = () => {
    setTripPlan(null);
    setFormData(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Hero Section */}
      {!tripPlan && (
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                AI Trip Planner
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let AI create your perfect travel itinerary using Gemini and Tavily APIs. 
              From budget exploration to luxury experiences - we've got you covered.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI-Powered Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Real-time Destination Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Personalized Experiences</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {tripPlan && formData ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <button
                onClick={handlePlanNewTrip}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth font-medium"
              >
                <Plane className="w-4 h-4" />
                Plan a New Trip
              </button>
            </div>
            <TripResults tripPlan={tripPlan} formData={formData} />
          </div>
        ) : (
          <TripPlannerForm onPlanTrip={handlePlanTrip} isLoading={isGeneratingPlan} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-muted/50 to-transparent py-8 mt-16 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Powered by Google Gemini AI and Tavily Search API
          </p>
          <p className="text-sm">
            Create unforgettable travel experiences with AI-driven planning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
