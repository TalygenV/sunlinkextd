import React, { useState, useEffect } from "react";
import Header from "./Header";
import SystemOrderSummary from "./SystemOrderSummary";
import ROIBreakdown from "./ROIBreakdown";
import Warranties from "./Warranties";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ContractSigningPage from "./ContractSigningPage";
import SuccessPage from "./SuccessPage";
import PhotoUploadPage from "./PhotoUploadPage";
import CustomerPortal from "./CustomerPortal";
import { useAuth } from "./hooks/useAuth";

type AuthMode = "login" | "signup";
type AppState = "auth" | "main" | "contract" | "success" | "photos" | "portal";

function ChoosePlan() {
  const { user, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>("auth");

  const [selectedPlan, setSelectedPlan] = useState("25-year");
  const [hasEVCharger, setHasEVCharger] = useState(false);
  const [hasReRoof, setHasReRoof] = useState(false);
  const [hasElectricalUpgrade, setHasElectricalUpgrade] = useState(false);
  const [systemSize] = useState(12.8); // kW
  const [batteryCount, setBatteryCount] = useState(2);
  const [batteryType] = useState("Tesla Powerwall 3");

  // Customer info for contract
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Pricing calculations
  const pricePerWatt = 1.75; // Solar-only price per watt
  const solarOnlyPrice = systemSize * 1000 * pricePerWatt; // Convert kW to watts
  const batteryPrice = 15000; // Tesla Powerwall 3 price per unit
  const batteryTotalPrice = batteryCount * batteryPrice;
  const systemPrice = solarOnlyPrice + batteryTotalPrice; // Combined solar + battery price
  const evChargerPrice = 2500;
  const reRoofPrice = 15000;
  const electricalUpgradePrice = 3500;

  const getTotalPrice = () => {
    let total = systemPrice;
    if (hasEVCharger) total += evChargerPrice;
    if (hasReRoof) total += reRoofPrice;
    if (hasElectricalUpgrade) total += electricalUpgradePrice;
    return total;
  };

  const handlePlanChange = (plan: string) => {
    console.log("Plan changed to:", plan); // Debug log
    setSelectedPlan(plan);
  };

  const handleBatteryCountChange = (count: number) => {
    setBatteryCount(Math.max(0, count));
  };

  const handleAuthSuccess = () => {
    setAppState("main");
    // Set customer info from user data
    if (user) {
      setCustomerInfo({
        name:
          user.user_metadata?.full_name ||
          `${user.user_metadata?.first_name || ""} ${
            user.user_metadata?.last_name || ""
          }`.trim() ||
          user.email?.split("@")[0] ||
          "Customer",
        email: user.email || "",
        address: "123 Main Street, Anytown, CA 90210", // This would come from user profile in real app
      });
    }
  };

  const handlePaymentSuccess = () => {
    setAppState("contract");
  };

  const handleContractSigned = () => {
    setAppState("success");
  };

  const handleBackToPayment = () => {
    setAppState("main");
  };

  const handleUploadPhotos = () => {
    setAppState("photos");
  };

  const handlePhotosUploaded = () => {
    setAppState("portal"); // Go to customer portal after photos uploaded
  };

  const handleContinueFromSuccess = () => {
    setAppState("main");
  };

  const handleGoToPortal = () => {
    setAppState("portal");
  };

  // Check URL for success parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      setAppState("success");
    }
  }, []);

  // Handle authentication state
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // Set customer info when user is available
        setCustomerInfo({
          name:
            user.user_metadata?.full_name ||
            `${user.user_metadata?.first_name || ""} ${
              user.user_metadata?.last_name || ""
            }`.trim() ||
            user.email?.split("@")[0] ||
            "Customer",
          email: user.email || "",
          address: "123 Main Street, Anytown, CA 90210", // This would come from user profile in real app
        });

        // Check if we're coming from a successful payment
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("success") === "true") {
          setAppState("success");
        } else {
          setAppState("main");
        }
      } else {
        setAppState("auth");
      }
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="tesla-card rounded-xl p-8 text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === "contract") {
    return (
      <ContractSigningPage
        onSigningComplete={handleContractSigned}
        onBack={handleBackToPayment}
        customerInfo={customerInfo}
        systemDetails={{
          size: `${systemSize}`,
          batteryCount,
          totalPrice: getTotalPrice(),
          selectedPlan,
        }}
      />
    );
  }

  if (appState === "success") {
    return <SuccessPage onUploadPhotos={handleUploadPhotos} />;
  }

  if (appState === "photos") {
    return (
      <PhotoUploadPage
        onComplete={handlePhotosUploaded}
        customerInfo={customerInfo}
      />
    );
  }

  if (appState === "portal") {
    return (
      <CustomerPortal
        customerInfo={customerInfo}
        systemDetails={{
          size: systemSize,
          batteryCount,
          batteryType,
          totalPrice: getTotalPrice(),
          selectedPlan,
        }}
        onBackToMain={() => setAppState("main")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onGoToPortal={handleGoToPortal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Combined System Overview and Order Summary */}
          <SystemOrderSummary
            systemSize={systemSize}
            batteryCount={batteryCount}
            batteryType={batteryType}
            hasEVCharger={hasEVCharger}
            hasReRoof={hasReRoof}
            hasElectricalUpgrade={hasElectricalUpgrade}
            onEVChargerChange={setHasEVCharger}
            onReRoofChange={setHasReRoof}
            onElectricalUpgradeChange={setHasElectricalUpgrade}
            onBatteryCountChange={handleBatteryCountChange}
            pricePerWatt={pricePerWatt}
            solarOnlyPrice={solarOnlyPrice}
            batteryPrice={batteryPrice}
            batteryTotalPrice={batteryTotalPrice}
            systemPrice={systemPrice}
            evChargerPrice={evChargerPrice}
            reRoofPrice={reRoofPrice}
            electricalUpgradePrice={electricalUpgradePrice}
            selectedPlan={selectedPlan}
            totalPrice={getTotalPrice()}
            onPaymentSuccess={handlePaymentSuccess}
            onPlanChange={handlePlanChange} // Pass the plan change handler
          />

          <ROIBreakdown systemSize={systemSize} totalPrice={getTotalPrice()} />

          <Warranties />
        </div>
      </div>
    </div>
  );
}

export default ChoosePlan;
