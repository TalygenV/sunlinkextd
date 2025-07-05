import React, { useState, useRef } from "react";
import { BatterySpecCard } from "./BatterySpecCard";
import { PrequalificationModal } from "./PrequalificationModal";
import { Zap, ChevronLeft, ChevronRight, Link } from "lucide-react";
import BatteryModel from "./BatteryModel";
import { Battery } from "./BatteryCard";
import { useNavigate } from "react-router-dom";

const batteries: Battery[] = [
  {
    id: "tesla-powerwall-3",
    name: "Powerwall 3",
    manufacturer: "Tesla",
    capacity: "13.5 kWh",
    warranty: "10 years",
    efficiency: "97.5%",
    price: 15000,
    features: [
      "Integrated inverter",
      "App-based monitoring",
      "Storm Watch feature",
      "Time-based control",
      "Scalable system",
    ],
  },
  {
    id: "enphase-5p",
    name: "IQ Battery 5P",
    manufacturer: "Enphase",
    capacity: "5.0 kWh",
    warranty: "15 years",
    efficiency: "96%",
    price: 8500,
    features: [
      "Modular design",
      "Hot-swappable",
      "Built-in microinverters",
      "Enlighten monitoring",
      "Grid-forming capability",
    ],
  },
  {
    id: "franklin-wh-a2",
    name: "aPower A2",
    manufacturer: "Franklin WH",
    capacity: "13.6 kWh",
    warranty: "12 years",
    efficiency: "95%",
    price: 12800,
    features: [
      "Iron phosphate chemistry",
      "Integrated inverter",
      "Smart energy management",
      "Mobile app control",
      "Expandable capacity",
    ],
  },
  {
    id: "solaredge-home",
    name: "Home Battery",
    manufacturer: "SolarEdge",
    capacity: "9.7 kWh",
    warranty: "10 years",
    efficiency: "94.5%",
    price: 11200,
    features: [
      "DC-coupled system",
      "Compact design",
      "Fire safety features",
      "Remote monitoring",
      "Weather-resistant",
    ],
  },
];

function SystemDesign() {
  const [selectedBatteryIndex, setSelectedBatteryIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(2);
  const [showPrequalModal, setShowPrequalModal] = useState<boolean>(false);
  const batteryModelRef = useRef<any>(null);
  const navigate = useNavigate();

  const selectedBattery = batteries[selectedBatteryIndex];
  const totalPrice = selectedBattery.price * quantity;

  // Calculate monthly payment for battery system
  const baseSolarSystemCost = 7000 * 2; // 7kW * $2/watt = $14,000
  const totalSystemCost = baseSolarSystemCost + totalPrice;

  const calculateMonthlyPayment = (
    principal: number,
    rate: number,
    years: number
  ) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  const baseSolarPayment = calculateMonthlyPayment(
    baseSolarSystemCost,
    4.49,
    25
  );
  const totalSystemPayment = calculateMonthlyPayment(totalSystemCost, 4.49, 25);
  const batteryMonthlyPayment = totalSystemPayment - baseSolarPayment;

  const navigateToPrevious = () => {
    setSelectedBatteryIndex(
      selectedBatteryIndex > 0 ? selectedBatteryIndex - 1 : batteries.length - 1
    );
  };

  const navigateToNext = () => {
    setSelectedBatteryIndex(
      selectedBatteryIndex < batteries.length - 1 ? selectedBatteryIndex + 1 : 0
    );
  };

  const handleRotateRequest = (direction: "left" | "right") => {
    if (batteryModelRef.current) {
      batteryModelRef.current.rotateModel(direction);
    }
  };

  const gotoNextScreen = () => {
    navigate("/choose-plan");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Mobile Layout - 3D Model at Top */}
        <div className="lg:hidden">
          <div className="relative flex items-center justify-center mb-8 sm:mb-12">
            <button
              onClick={navigateToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors z-10 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            <div className="w-full max-w-sm sm:max-w-md aspect-square bg-black rounded-2xl flex items-center justify-center border border-gray-700 overflow-hidden">
              <BatteryModel
                ref={batteryModelRef}
                position="front"
                isInteractive={true}
                scale={1.0}
                rotationY={0}
                onRotateRequest={handleRotateRequest}
                isMobile={true}
                containerHeight={300}
              />
            </div>

            <button
              onClick={navigateToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors z-10 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <span className="text-sm text-gray-300">
                {selectedBatteryIndex + 1} of {batteries.length}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <BatterySpecCard
              battery={selectedBattery}
              quantity={quantity}
              onQuantityChange={setQuantity}
              monthlyPayment={Math.round(batteryMonthlyPayment)}
              onPrequalify={() => setShowPrequalModal(true)}
            />
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:block bg-black">
          <div className="grid grid-cols-5 gap-8 xl:gap-12 items-start">
            <div className="col-span-2 relative flex items-center justify-center">
              <button
                onClick={navigateToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors z-10 shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="w-full max-w-lg aspect-square bg-black rounded-2xl flex items-center justify-center border border-gray-700 overflow-hidden">
                <BatteryModel
                  ref={batteryModelRef}
                  position="front"
                  isInteractive={true}
                  scale={1.0}
                  rotationY={0}
                  onRotateRequest={handleRotateRequest}
                  isMobile={false}
                  containerHeight={500}
                />
              </div>

              <button
                onClick={navigateToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors z-10 shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="text-sm text-gray-300">
                  {selectedBatteryIndex + 1} of {batteries.length}
                </span>
              </div>
            </div>

            <div className="col-span-3 flex justify-start">
              <div className="w-full max-w-2xl">
                <BatterySpecCard
                  battery={selectedBattery}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  monthlyPayment={Math.round(batteryMonthlyPayment)}
                  onPrequalify={() => setShowPrequalModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-16 text-center">
          <p className="text-gray-300 text-sm">
            Don't need a battery?{" "}
            <button
            onClick={gotoNextScreen}
             className="text-white hover:text-gray-300 transition-colors underline">
              Skip
            </button>
          </p>
        </div>
      </div>

      <PrequalificationModal
        isOpen={showPrequalModal}
        onClose={() => setShowPrequalModal(false)}
        systemCost={totalSystemCost}
        monthlyPayment={Math.round(totalSystemPayment)}
      />
    </div>
  );
}

export default SystemDesign;
