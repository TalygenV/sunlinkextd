import React from "react";
import { Shield, Clock, Wrench, Zap } from "lucide-react";

const Warranties: React.FC = () => {
  const warranties = [
    {
      icon: Shield,
      title: "Product Warranty",
      duration: "25 Years",
      description:
        "Complete coverage for solar panels against manufacturing defects",
      color: "bg-white",
    },
    {
      icon: Zap,
      title: "Performance Warranty",
      duration: "25 Years",
      description: "Guaranteed 80% power output after 25 years of operation",
      color: "bg-gray-400",
    },
    {
      icon: Wrench,
      title: "Installation Warranty",
      duration: "10 Years",
      description:
        "Comprehensive workmanship guarantee on all installation work",
      color: "bg-gray-500",
    },
    {
      icon: Clock,
      title: "Battery Warranty",
      duration: "10 Years",
      description:
        "Tesla Powerwall warranty with 70% capacity retention guarantee",
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="rounded-2xl p-8 bg-white/5 border border-white/10 animate-fade-in">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-gray-900" />
        </div>
        <div>
          <h2 className="text-2xl font-light text-white">
            Warranty Protection
          </h2>
          <p className="text-sm text-gray-400">
            Comprehensive coverage for your peace of mind
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warranties.map((warranty, index) => {
          const Icon = warranty.icon;
          return (
            <div
              key={index}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 ${warranty.color} bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{warranty.title}</h3>
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {warranty.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {warranty.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Benefits */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">
          Additional Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 hover:bg-white/10 flex items-center space-x-3 p-4 rounded-lg transition-colors">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              24/7 Monitoring
            </span>
          </div>
          <div className="bg-white/5 hover:bg-white/10 flex items-center space-x-3 p-4 rounded-lg transition-colors">
            <Wrench className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Free Maintenance
            </span>
          </div>
          <div className="bg-white/5 hover:bg-white/10 flex items-center space-x-3 p-4 rounded-lg transition-colors">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Remote Diagnostics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranties;
