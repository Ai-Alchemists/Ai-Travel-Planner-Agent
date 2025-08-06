import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Star, IndianRupee, Users, Calendar } from "lucide-react";

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

interface TripResultsProps {
  tripPlan: TripPlan;
  formData: {
    destination: string;
    date: Date | undefined;
    people: number;
    budget: number;
    experienceType: number;
  };
}

export const TripResults = ({ tripPlan, formData }: TripResultsProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Trip Overview */}
      <Card className="bg-gradient-hero text-primary-foreground shadow-travel border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            🎉 Your {tripPlan.destination} Adventure Awaits!
          </CardTitle>
          <CardDescription className="text-primary-foreground/90 text-lg">
            {tripPlan.overview}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">{formData.date ? formatDate(formData.date) : 'Date TBD'}</div>
              <div className="text-sm opacity-90">{tripPlan.totalDays} Days</div>
            </div>
            <div className="space-y-1">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">{formData.people} Travelers</div>
              <div className="text-sm opacity-90">Group Size</div>
            </div>
            <div className="space-y-1">
              <IndianRupee className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">₹{tripPlan.costPerPerson.toLocaleString('en-IN')}</div>
              <div className="text-sm opacity-90">Per Person</div>
            </div>
            <div className="space-y-1">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">₹{tripPlan.totalCost.toLocaleString('en-IN')}</div>
              <div className="text-sm opacity-90">Total Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🏨 Recommended Hotels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tripPlan.hotels.map((hotel, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-card to-muted/20 transition-smooth hover:shadow-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-secondary mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">₹{hotel.pricePerNight.toLocaleString('en-IN')}/night</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">{hotel.description}</p>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            📅 Day-by-Day Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tripPlan.dayPlans.map((day, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary">Day {day.day}: {day.theme}</h3>
                <Badge className="bg-gradient-adventure text-accent-foreground">
                  ₹{day.estimatedCost.toLocaleString('en-IN')} estimated
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-r from-card to-muted/10 transition-smooth hover:shadow-card">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-ocean rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-lg">{activity.name}</h4>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">{activity.category}</Badge>
                          <div className="text-primary font-semibold">₹{activity.cost.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {index < tripPlan.dayPlans.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            💡 Insider Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {tripPlan.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-muted/20 to-transparent rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-adventure rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-accent-foreground text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};