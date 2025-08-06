import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, TestTube, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TripPlannerService } from "@/services/TripPlannerService";

interface ApiKeySetupProps {
  onSetupComplete: () => void;
}

export const ApiKeySetup = ({ onSetupComplete }: ApiKeySetupProps) => {
  const { toast } = useToast();
  const [geminiKey, setGeminiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showTavilyKey, setShowTavilyKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleSaveKeys = async () => {
    if (!geminiKey.trim() || !tavilyKey.trim()) {
      toast({
        title: "Missing API Keys",
        description: "Please enter both Gemini and Tavily API keys",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      // In a real implementation, test the API connection
      const isValid = await TripPlannerService.testApiConnection(geminiKey, tavilyKey);
      
      if (isValid) {
        TripPlannerService.saveApiKeys(geminiKey, tavilyKey);
        toast({
          title: "API Keys Saved!",
          description: "Your API keys have been saved securely. You can now start planning trips!",
        });
        onSetupComplete();
      } else {
        toast({
          title: "Invalid API Keys",
          description: "Please check your API keys and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // For demo purposes, save the keys anyway
      TripPlannerService.saveApiKeys(geminiKey, tavilyKey);
      toast({
        title: "API Keys Saved!",
        description: "Your API keys have been saved. Demo mode activated!",
      });
      onSetupComplete();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSkipSetup = () => {
    // Save dummy keys for demo mode
    TripPlannerService.saveApiKeys('demo-gemini-key', 'demo-tavily-key');
    toast({
      title: "Demo Mode Activated",
      description: "You can explore the app with sample data. Add real API keys later for live functionality.",
    });
    onSetupComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <Card className="w-full max-w-2xl shadow-travel border-0 bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Setup AI Trip Planner
          </CardTitle>
          <CardDescription className="text-lg">
            Connect your AI services to start planning amazing trips
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Your API keys are stored locally in your browser and never sent to our servers. 
              For production use, consider using Supabase Edge Functions for secure API key management.
            </AlertDescription>
          </Alert>

          {/* Gemini API Key */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-key" className="text-sm font-medium">
                Google Gemini API Key
              </Label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Input
                id="gemini-key"
                type={showGeminiKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="pr-10 transition-smooth focus:shadow-travel"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
              >
                {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Tavily API Key */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="tavily-key" className="text-sm font-medium">
                Tavily Search API Key
              </Label>
              <a 
                href="https://tavily.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Input
                id="tavily-key"
                type={showTavilyKey ? "text" : "password"}
                value={tavilyKey}
                onChange={(e) => setTavilyKey(e.target.value)}
                placeholder="Enter your Tavily API key..."
                className="pr-10 transition-smooth focus:shadow-travel"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowTavilyKey(!showTavilyKey)}
              >
                {showTavilyKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleSaveKeys}
              disabled={isTestingConnection}
              className="flex-1 bg-gradient-hero hover:scale-105 transition-bounce shadow-travel"
            >
              {isTestingConnection ? (
                <>
                  <TestTube className="w-4 h-4 mr-2 animate-pulse" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save & Continue
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSkipSetup}
              variant="outline"
              className="flex-1 transition-smooth hover:shadow-card"
            >
              Try Demo Mode
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Don't have API keys? Try demo mode to explore the interface with sample data.
              You can always add real API keys later from the settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};