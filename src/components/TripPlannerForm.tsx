import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, MapPin, Users, IndianRupee, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TripFormData {
  destination: string;
  date: Date | undefined;
  people: number;
  budget: number;
  experienceType: number;
}

interface TripPlannerFormProps {
  onPlanTrip: (data: TripFormData) => void;
  isLoading?: boolean;
}

const experienceTypes = [
  { value: 0, label: "Budget Explorer", icon: "🎒", description: "Backpacker vibes, local experiences" },
  { value: 25, label: "Comfort Traveler", icon: "🏨", description: "Mix of comfort and adventure" },
  { value: 50, label: "Premium Explorer", icon: "✨", description: "Higher-end experiences" },
  { value: 75, label: "Luxury Seeker", icon: "💎", description: "Exclusive, luxury experiences" },
  { value: 100, label: "Ultra Luxury", icon: "👑", description: "No expense spared, ultimate luxury" }
];

export const TripPlannerForm = ({ onPlanTrip, isLoading = false }: TripPlannerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    date: undefined,
    people: 2,
    budget: 50000,
    experienceType: 25
  });

  const getCurrentExperienceType = () => {
    const closest = experienceTypes.reduce((prev, curr) => 
      Math.abs(curr.value - formData.experienceType) < Math.abs(prev.value - formData.experienceType) ? curr : prev
    );
    return closest;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a destination",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Missing Information", 
        description: "Please select a travel date",
        variant: "destructive",
      });
      return;
    }

    onPlanTrip(formData);
  };

  const currentExperience = getCurrentExperienceType();

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-travel border-0 bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Plan Your Perfect Trip
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Let AI create your personalized travel itinerary
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Where would you like to go?
            </Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Paris, Tokyo, Bali..."
              className="text-lg h-12 transition-smooth focus:shadow-travel"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              When are you traveling?
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal text-lg transition-smooth hover:shadow-travel",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData({ ...formData, date })}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <Label htmlFor="people" className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              How many travelers?
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => formData.people > 1 && setFormData({ ...formData, people: formData.people - 1 })}
                disabled={formData.people <= 1}
                className="h-12 w-12 transition-bounce"
              >
                -
              </Button>
              <span className="text-2xl font-bold text-center min-w-[3rem]">{formData.people}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => formData.people < 20 && setFormData({ ...formData, people: formData.people + 1 })}
                disabled={formData.people >= 20}
                className="h-12 w-12 transition-bounce"
              >
                +
              </Button>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              Total Budget (₹)
            </Label>
            <div className="space-y-3">
              <Slider
                value={[formData.budget]}
                onValueChange={([value]) => setFormData({ ...formData, budget: value })}
                max={500000}
                min={5000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹5,000</span>
                <span className="text-lg font-bold text-primary">₹{formData.budget.toLocaleString('en-IN')}</span>
                <span>₹5,00,000</span>
              </div>
            </div>
          </div>

          {/* Experience Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Travel Experience Type
            </Label>
            <div className="space-y-4">
              <Slider
                value={[formData.experienceType]}
                onValueChange={([value]) => setFormData({ ...formData, experienceType: value })}
                max={100}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="text-center p-4 bg-gradient-ocean rounded-lg text-primary-foreground shadow-card">
                <div className="text-2xl mb-1">{currentExperience.icon}</div>
                <div className="font-bold text-lg">{currentExperience.label}</div>
                <div className="text-sm opacity-90">{currentExperience.description}</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold bg-gradient-hero hover:scale-105 transition-bounce shadow-travel"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Your Perfect Trip...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Plan My Adventure
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};