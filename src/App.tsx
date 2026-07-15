import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import DashboardScreen from "./components/DashboardScreen";
import WellnessRouteScreen from "./components/WellnessRouteScreen";
import FoodAnalysisScreen from "./components/FoodAnalysisScreen";
import ChatModal from "./components/ChatModal";

type ScreenType = "welcome" | "home" | "route" | "food-analysis";

export default function App() {
  // Pre-load 'diabetes' (당뇨) to match Screenshot 3 initial load experience, but let the user select/toggle freely!
  const [selectedConditions, setSelectedConditions] = useState<string[]>(["diabetes"]);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("welcome");
  const [selectedFood, setSelectedFood] = useState<string>("고기국수");
  const [chatOpen, setChatOpen] = useState(false);

  // Toggle selection of conditions
  const handleToggleCondition = (id: string) => {
    setSelectedConditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Navigational handlers
  const handleStartTravel = () => {
    setCurrentScreen("home");
  };

  const handleSelectFood = (foodName: string) => {
    setSelectedFood(foodName);
    setCurrentScreen("food-analysis");
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-[#fbf9f4]">
      {/* Screen Router */}
      {currentScreen === "welcome" && (
        <WelcomeScreen
          selectedConditions={selectedConditions}
          onToggleCondition={handleToggleCondition}
          onStart={handleStartTravel}
          onChangeScreen={(screen) => setCurrentScreen(screen as ScreenType)}
          currentTab="profile"
        />
      )}

      {currentScreen === "home" && (
        <DashboardScreen
          selectedConditions={selectedConditions}
          onChangeScreen={(screen) => setCurrentScreen(screen as ScreenType)}
          onSelectFood={handleSelectFood}
          onOpenChat={() => setChatOpen(true)}
        />
      )}

      {currentScreen === "route" && (
        <WellnessRouteScreen
          onBack={() => setCurrentScreen("home")}
          onChangeScreen={(screen) => setCurrentScreen(screen as ScreenType)}
          onSelectFood={handleSelectFood}
        />
      )}

      {currentScreen === "food-analysis" && (
        <FoodAnalysisScreen
          foodName={selectedFood}
          selectedConditions={selectedConditions}
          onBack={() => setCurrentScreen("home")}
          onChangeScreen={(screen) => setCurrentScreen(screen as ScreenType)}
        />
      )}

      {/* Persistent AI Wellness Chat Assistant */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        selectedConditions={selectedConditions}
      />
    </div>
  );
}
