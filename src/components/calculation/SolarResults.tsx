/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Sun,
  ArrowRight,
  ArrowLeft,
  Zap,
  Home,
  Award,
  Gift,
  Star,
  Info,
  Layout,
  Settings,
  CreditCard,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface SolarResultsProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  utilityCompany: string;
  powerBill: string;
  onBack: () => void;
  onContinue: () => void;
}

const SolarResults: React.FC<SolarResultsProps> = ({
  firstName,
  lastName,
  email,
  phone,
  address,
  utilityCompany,
  powerBill,
  onBack,
  onContinue,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // Fixed system specifications as requested
  const systemSize = 7.2; // kW
  const annualProduction = 11232; // kWh/year
  const panels = 22; // panels
  const monthlyBill = 150;
  const solarPricePerWatt = 2.0;
  const systemCost = systemSize * 1000 * solarPricePerWatt; // $14,400 before incentives
  const federalTaxCredit = Math.round(systemCost * 0.3); // 30% federal tax credit
  const localIncentives = 2500; // Example local incentive amount
  const totalIncentives = federalTaxCredit + localIncentives;
  const firstYearSavings = Math.round(monthlyBill * 12 * 0.75);
  const projectedSavings = Math.round(firstYearSavings * 25);

  // Calculate utility costs for chart - showing every 3 years for 30 years
  const chartYears = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
  const utilityData = chartYears.map((year) => ({
    year,
    cost: monthlyBill * 12 * Math.pow(1.03, year),
  }));

  // Calculate 30-year total utility spending with 3% annual increase
  const thirtyYearUtilitySpending = Array.from(
    { length: 31 },
    (_, i) => monthlyBill * 12 * Math.pow(1.03, i)
  ).reduce((sum, cost) => sum + cost, 0);

  // Get max cost for chart scaling
  const maxCost = Math.max(...utilityData.map((d) => d.cost));

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    setIsVisible(true);
    const timer1 = setTimeout(() => setAnimateCards(true), 300);
    const timer2 = setTimeout(() => setAnimateChart(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-orange/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-teal/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-slate-600/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="tesla-heading text-4xl lg:text-5xl text-white mb-4">
              Your Personalized Solar Solution
            </h1>
            <p className="tesla-body text-xl text-gray-300">
              Here's what SunLink recommends
            </p>
          </div>

          {/* Main Cards */}
          <div
            className={`grid md:grid-cols-2 gap-8 mb-12 transition-all duration-700 delay-400 ${
              animateCards
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Our Recommended Setup Card */}
            <div className="tesla-card tesla-glass p-8 shadow-2xl hover:shadow-brand-orange/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="tesla-heading text-2xl text-white">
                  Our Recommended Setup
                </h3>
                <div className="w-14 h-14 bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg flex items-center justify-center">
                  <Sun className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                {/* System Specs */}
                <div className="flex items-center justify-between">
                  <span className="tesla-body text-gray-300 text-lg">
                    System Size
                  </span>
                  <span className="tesla-heading text-3xl text-brand-teal">
                    {systemSize} kW
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="tesla-body text-gray-300 text-lg">
                    Solar Panels
                  </span>
                  <span className="tesla-heading text-3xl text-brand-teal">
                    {panels} panels
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="tesla-body text-gray-300 text-lg">
                    Annual Production
                  </span>
                  <span className="tesla-heading text-2xl text-brand-teal">
                    {annualProduction.toLocaleString()} kWh
                  </span>
                </div>

                {/* Available Incentives Section */}
                <div className="tesla-gradient-bg rounded-lg p-6 border border-brand-teal/10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-brand-orange" />
                    <h4 className="tesla-subheading text-white text-xl">
                      Available Incentives
                    </h4>
                    <Star className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="tesla-card bg-white p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-brand-teal" />
                        <span className="tesla-caption text-gray-400 text-sm">
                          Federal Tax Credit
                        </span>
                      </div>
                      <p className="tesla-heading text-2xl text-brand-teal">
                        ${federalTaxCredit.toLocaleString()}
                      </p>
                      <p className="tesla-body text-gray-500 text-xs">
                        30% of system cost
                      </p>
                    </div>

                    <div className="tesla-card bg-white p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-brand-orange" />
                        <span className="tesla-caption text-gray-400 text-sm">
                          Local Incentives
                        </span>
                      </div>
                      <p className="tesla-heading text-2xl text-brand-orange">
                        ${localIncentives.toLocaleString()}
                      </p>
                      <p className="tesla-body text-gray-500 text-xs">
                        State & utility rebates
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg p-3 text-center mb-4">
                    <p className="tesla-subheading text-xl text-white">
                      Total Incentives: ${totalIncentives.toLocaleString()}
                    </p>
                  </div>

                  {/* SunLink Disclaimer */}
                  <div className="mb-4 tesla-glass rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                      <p className="tesla-body text-gray-300 text-xs">
                        <strong>Important:</strong> SunLink does not guarantee
                        any incentives. Incentive availability and amounts vary
                        by location, income, and other factors. Please consult
                        with your installer and tax advisor to confirm your
                        eligibility for specific incentives.
                      </p>
                    </div>
                  </div>

                  {/* Tax Credit Disclaimer */}
                  <div className="tesla-glass rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                      <p className="tesla-body text-gray-300 text-xs">
                        <strong>Tax Credit Disclaimer:</strong> The federal
                        solar tax credit allows you to deduct 30% of the cost of
                        installing a solar energy system from your federal
                        taxes. This credit is available through 2032, then
                        decreases to 26% in 2033 and 22% in 2034. Consult your
                        tax advisor to determine your eligibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Without Solar Card */}
            <div className="tesla-card tesla-glass p-8 shadow-2xl hover:shadow-brand-teal/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="tesla-heading text-2xl text-white">
                  Without Solar
                </h3>
                <div className="w-14 h-14 bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Current Bill */}
                <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-5 h-5 text-brand-teal" />
                    <span className="tesla-caption text-gray-400">
                      Current Monthly Bill
                    </span>
                  </div>
                  <p className="tesla-heading text-brand-orange text-2xl">
                    ${monthlyBill}/month
                  </p>
                </div>

                {/* Interactive Chart */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                    <span className="tesla-subheading text-white text-lg">
                      Rising Utility Costs
                    </span>
                  </div>

                  {/* Chart Container */}
                  <div className="relative h-48 tesla-card bg-white p-4 border border-red-200 overflow-hidden">
                    <div className="flex items-end justify-between h-full">
                      {utilityData.map((data, index) => {
                        const height = Math.max((data.cost / maxCost) * 85, 8); // Minimum 8% height, max 85%
                        const isHovered = hoveredYear === data.year;

                        return (
                          <div
                            key={data.year}
                            className="relative flex flex-col items-center group cursor-pointer"
                            style={{
                              width: `${100 / utilityData.length - 1}%`,
                            }}
                            onMouseEnter={() => setHoveredYear(data.year)}
                            onMouseLeave={() => setHoveredYear(null)}
                          >
                            {/* Tooltip */}
                            {isHovered && (
                              <div className="absolute bottom-full mb-2 bg-red-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 shadow-lg transform -translate-x-1/2 left-1/2">
                                <div className="tesla-subheading">
                                  Year {data.year}
                                </div>
                                <div className="tesla-body">
                                  ${Math.round(data.cost).toLocaleString()}
                                  /year
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
                              </div>
                            )}

                            {/* Bar */}
                            <div
                              className={`w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 border border-red-500 ${
                                isHovered
                                  ? "opacity-100 shadow-lg scale-105"
                                  : "opacity-90 hover:opacity-95"
                              }`}
                              style={{
                                height: `${height}%`,
                                minHeight: "12px",
                              }}
                            />

                            {/* Year Label */}
                            <div className="tesla-caption text-xs text-gray-300 mt-2 text-center">
                              {data.year === 0 ? "Now" : `${data.year}y`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="tesla-caption text-red-700 text-sm">
                      Hover over bars to see projected costs
                    </p>
                  </div>
                </div>

                {/* 30-Year Projected Spending */}
                <div className="tesla-gradient-bg rounded-lg p-6 border border-brand-teal/10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <TrendingUp className="w-6 h-6 text-brand-teal" />
                    <span className="tesla-subheading text-gray-400 text-lg">
                      30-Year Projected Spending
                    </span>
                  </div>
                  <p className="tesla-heading text-4xl lg:text-5xl text-brand-orange mb-2">
                    ${Math.round(thirtyYearUtilitySpending).toLocaleString()}
                  </p>
                  <p className="tesla-body text-gray-300 text-sm">
                    Based on 3% annual rate increases
                  </p>
                </div>

                {/* Rising Costs Warning */}
                <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-brand-orange" />
                    <span className="tesla-subheading text-gray-400">
                      Rising Utility Rates
                    </span>
                  </div>
                  <p className="tesla-body text-gray-300 text-sm">
                    Utility rates increase every year. Lock in your energy costs
                    with solar and avoid these rising expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Header */}
          <div
            className={`text-center mb-8 transition-all duration-700 delay-500 ${
              animateCards
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="tesla-heading text-3xl lg:text-4xl text-white mb-4">
              Next Steps
            </h2>
          </div>

          {/* What's Next - Individual Cards */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-600 ${
              animateCards
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="tesla-card tesla-glass p-6 shadow-lg hover:shadow-brand-orange/20 transition-all duration-300 text-center group">
              <div className="w-14 h-14 tesla-gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-brand-orange/30 group-hover:to-brand-teal/30 transition-all duration-300">
                <Layout className="w-7 h-7 text-brand-teal" />
              </div>
              <h4 className="tesla-subheading text-white text-lg mb-2">
                Design Layout
              </h4>
              <p className="tesla-body text-gray-300 text-sm">
                Custom panel placement optimized for your roof
              </p>
            </div>

            <div className="tesla-card tesla-glass p-6 shadow-lg hover:shadow-brand-teal/20 transition-all duration-300 text-center group">
              <div className="w-14 h-14 tesla-gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-brand-teal/30 group-hover:to-brand-orange/30 transition-all duration-300">
                <Settings className="w-7 h-7 text-brand-orange" />
              </div>
              <h4 className="tesla-subheading text-white text-lg mb-2">
                Choose Equipment
              </h4>
              <p className="tesla-body text-gray-300 text-sm">
                Premium panels & inverters for maximum efficiency
              </p>
            </div>

            <div className="tesla-card tesla-glass p-6 shadow-lg hover:shadow-brand-orange/20 transition-all duration-300 text-center group">
              <div className="w-14 h-14 tesla-gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-brand-orange/30 group-hover:to-brand-teal/30 transition-all duration-300">
                <CreditCard className="w-7 h-7 text-brand-teal" />
              </div>
              <h4 className="tesla-subheading text-white text-lg mb-2">
                Choose Your Plan
              </h4>
              <p className="tesla-body text-gray-300 text-sm">
                Flexible financing options to fit your budget
              </p>
            </div>

            <div className="tesla-card tesla-glass p-6 shadow-lg hover:shadow-brand-teal/20 transition-all duration-300 text-center group">
              <div className="w-14 h-14 tesla-gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-brand-teal/30 group-hover:to-brand-orange/30 transition-all duration-300">
                <Wrench className="w-7 h-7 text-brand-orange" />
              </div>
              <h4 className="tesla-subheading text-white text-lg mb-2">
                Get Installed
              </h4>
              <p className="tesla-body text-gray-300 text-sm">
                Professional installation by certified technicians
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className={`text-center mb-8 transition-all duration-700 delay-700 ${
              animateChart
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="tesla-heading text-2xl text-white mb-2">
              Ready to Start Saving?
            </h3>
            <p className="tesla-body text-gray-300 text-lg">
              Let's design your custom solar system and secure these incentives
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto transition-all duration-700 delay-800 ${
              animateChart
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <button
              onClick={onBack}
              className="tesla-button flex-1 bg-brand-gray hover:bg-brand-gray/80 text-gray-700 py-4 px-6 flex items-center justify-center gap-2 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Form
            </button>
            <button
              onClick={onContinue}
              className="tesla-button flex-1 bg-gradient-to-r from-brand-orange to-brand-teal hover:from-brand-orange-dark hover:to-brand-teal-dark text-white py-4 px-6 flex items-center justify-center gap-2 group"
            >
              Design My System
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarResults;
