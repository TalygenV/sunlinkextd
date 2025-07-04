import React, { useState } from 'react';
import { Battery } from './BatteryCard';
import { getBackupOptions } from './BackupDurationCard';
import { getSavingsData } from './SavingsChart';
import { Minus, Plus, Zap, Shield, DollarSign, BarChart3, Home, Lightbulb, Settings, Clock } from 'lucide-react';

interface BatterySpecCardProps {
  battery: Battery;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  monthlyPayment: number;
  onPrequalify: () => void;
}

type TabType = 'specs' | 'backup' | 'savings';

export const BatterySpecCard: React.FC<BatterySpecCardProps> = ({
  battery,
  quantity,
  onQuantityChange,
  monthlyPayment,
  onPrequalify
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [operatingMode, setOperatingMode] = useState<string>('self-consumption');

  const totalCapacity = parseFloat(battery.capacity) * quantity;
  const totalPrice = battery.price * quantity;
  const backupOptions = getBackupOptions(quantity);
  const savingsData = getSavingsData();

  // Calculate projected backup hours based on average home consumption
  const projectedBackupHours = Math.round((totalCapacity / 1.25) * 10) / 10;

  // Calculate dynamic savings based on quantity - more batteries = more savings
  const getDynamicSavingsData = () => {
    const baseMultiplier = Math.min(quantity * 0.8, 3.0); // Cap at 3x for realism
    return savingsData.map(item => ({
      ...item,
      withBattery: Math.max(item.withBattery - (quantity - 1) * 8, item.withBattery * 0.6),
      savings: Math.min(item.savings * baseMultiplier, item.withoutBattery * 0.7)
    }));
  };

  const dynamicSavingsData = getDynamicSavingsData();

  const operatingModes = [
    { id: 'backup', label: 'Backup Only', description: 'Emergency power only', color: 'bg-orange-500' },
    { id: 'self-consumption', label: 'Self-Consumption', description: 'Use solar first, then battery', color: 'bg-teal-500' },
    { id: 'time-of-use', label: 'Time-of-Use', description: 'Avoid peak hour rates', color: 'bg-gray-400' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'specs':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Features Only */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Key Features</h4>
              <div className="space-y-2">
                {battery.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-white bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-4">
            {/* Operating Mode Selection */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Operating Mode</h4>
              <div className="space-y-2">
                {operatingModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setOperatingMode(mode.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      operatingMode === mode.id
                        ? 'border-white/30 bg-white/10 text-white'
                        : 'border-white/20 bg-white/5 text-white/80 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${mode.color} mr-3`}></div>
                      <div>
                        <div className="font-medium text-sm">{mode.label}</div>
                        <div className="text-xs text-white/60">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Backup Duration Scenarios */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Backup Duration Scenarios</h4>
              <div className="space-y-3">
                {backupOptions.map((option) => (
                  <div key={option.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${option.color} mr-3`}>
                          {React.cloneElement(option.icon as React.ReactElement, { className: "w-4 h-4 text-white" })}
                        </div>
                        <div>
                          <h5 className="font-semibold text-white text-sm">{option.title}</h5>
                          <p className="text-xs text-white/60">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-white">{option.duration}</div>
                        <div className="text-xs text-white/60">days</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
                      {option.items.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-white/50 rounded-full mr-2"></div>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Energy Arbitrage Header */}
            <div className="text-center">
              <h4 className="text-white font-semibold text-base sm:text-lg mb-1">Energy arbitrage</h4>
              <p className="text-white/60 text-sm">Average monthly utility bill</p>
            </div>

            {/* Utility Bill Savings Toggle */}
            <div className="flex justify-center">
              <div className="bg-white/10 rounded-lg p-1 border border-white/20">
                <button className="px-3 sm:px-4 py-2 bg-white text-gray-900 rounded-md text-xs sm:text-sm font-medium shadow-sm">
                  Utility bill savings
                </button>
                <button className="px-3 sm:px-4 py-2 text-white/60 text-xs sm:text-sm font-medium hover:text-white transition-colors">
                  Daily usage
                </button>
              </div>
            </div>

            {/* Comparison Cards - Dynamic based on quantity */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-white/60 mb-1">Solar only</div>
                  <div className="text-lg sm:text-2xl font-bold text-white mb-1">
                    ${(39.89 + (quantity - 1) * 5).toFixed(2)}
                  </div>
                  <div className="text-xs text-white/50">
                    <span>{(13.66 + (quantity - 1) * 2).toFixed(1)} kWh</span> • <span>21.53 ¢/kWh</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-white/60 mb-1">Solar + battery</div>
                  <div className="text-lg sm:text-2xl font-bold text-white mb-1">
                    ${Math.max(25.34, 39.34 - (quantity - 1) * 8).toFixed(2)}
                  </div>
                  <div className="text-xs text-white/50">
                    <span>{Math.max(8.05, 11.05 - (quantity - 1) * 1.5).toFixed(1)} kWh</span> • <span>18.2 ¢/kWh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart at Bottom - Mobile Optimized */}
            <div className="space-y-4">
              {/* Chart Title */}
              <div className="text-center">
                <h5 className="text-white font-medium text-sm mb-3">Monthly Cost Comparison</h5>
              </div>

              {/* Horizontal Bar Chart - Mobile Responsive */}
              <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="space-y-3 sm:space-y-4">
                  {/* Chart area with Y-axis labels - Responsive Height */}
                  <div className="relative">
                    {/* Y-axis labels on the left - Smaller on mobile */}
                    <div className="absolute left-0 top-0 h-16 sm:h-24 flex flex-col justify-between text-xs sm:text-sm text-white/60 pr-2 sm:pr-3">
                      <span>$80</span>
                      <span>$60</span>
                      <span>$40</span>
                      <span>$20</span>
                      <span>$0</span>
                    </div>
                    
                    {/* Chart container with left margin for Y-axis - Mobile Responsive */}
                    <div className="ml-8 sm:ml-10 bg-white/5 rounded-lg p-2 sm:p-3 h-16 sm:h-24 border border-white/10">
                      <div className="h-full flex items-end justify-between">
                        {dynamicSavingsData.slice(0, 12).map((item, index) => {
                          const maxValue = 80;
                          const gridOnlyHeight = Math.min(95, Math.max(5, (item.withoutBattery / maxValue) * 100));
                          const solarBatteryHeight = Math.min(95, Math.max(5, (item.withBattery / maxValue) * 100));
                          
                          return (
                            <div key={index} className="flex flex-col items-center" style={{ width: '7%' }}>
                              {/* Bar container - Mobile Responsive */}
                              <div className="w-full flex justify-center space-x-0.5 sm:space-x-1 items-end h-12 sm:h-20">
                                {/* Grid only bar */}
                                <div 
                                  className="bg-gray-400 rounded-t-sm hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                                  style={{ 
                                    width: '45%',
                                    height: `${gridOnlyHeight}%`,
                                    minHeight: '3px'
                                  }}
                                  title={`Solar only: $${item.withoutBattery.toFixed(2)}`}
                                />
                                {/* Solar + battery bar */}
                                <div 
                                  className="bg-green-400 rounded-t-sm hover:bg-green-300 transition-all duration-300 cursor-pointer"
                                  style={{ 
                                    width: '45%',
                                    height: `${solarBatteryHeight}%`,
                                    minHeight: '3px'
                                  }}
                                  title={`Solar + battery: $${item.withBattery.toFixed(2)}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* X-axis labels (months) - Mobile Responsive */}
                  <div className="ml-8 sm:ml-10 flex justify-between text-xs text-white/60">
                    {dynamicSavingsData.slice(0, 12).map((item, index) => (
                      <span key={index} className="text-center" style={{ width: '7%' }}>
                        {item.month}
                      </span>
                    ))}
                  </div>
                  
                  {/* Legend - Mobile Responsive */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm pt-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded mr-1 sm:mr-2"></div>
                      <span className="text-white/60">Solar only</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded mr-1 sm:mr-2"></div>
                      <span className="text-white/60">Solar + battery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Savings Summary - Dynamic */}
              <div className="bg-green-500/20 rounded-xl p-3 sm:p-4 border border-green-400/30">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 text-sm">Annual Savings</span>
                  <span className="text-lg sm:text-xl font-bold text-green-200">
                    ${Math.round(dynamicSavingsData.reduce((sum, item) => sum + item.savings, 0)).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-green-300 mt-1">
                  With {quantity} batter{quantity === 1 ? 'y' : 'ies'} • Scales with quantity
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden w-full shadow-xl bg-black">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{battery.manufacturer}</h2>
            <p className="text-white/70 text-sm leading-relaxed mt-1">
              Perfect for homeowners seeking reliability and smart features. Integrates seamlessly with Tesla 
              solar and provides advanced monitoring capabilities.
            </p>
          </div>
        </div>

        {/* Quantity Controls and Backup Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white/70 text-sm">Quantity</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all shadow-sm"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => onQuantityChange(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Projected Backup Hours */}
          <div className="flex items-center space-x-3 bg-orange-500/20 rounded-xl p-3 border border-orange-400/30">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
            <span className="text-white/80 text-sm">Projected backup hours:</span>
            <span className="text-white font-bold text-base sm:text-lg">{projectedBackupHours}h</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Mobile Optimized */}
      <div className="flex bg-white/5 p-1 sm:p-2 gap-1">
        {[
          { id: 'specs', label: 'Specifications', shortLabel: 'Specs', icon: Zap, bgColor: '#E4EEF0', textColor: 'text-gray-800' },
          { id: 'backup', label: 'Backup', shortLabel: 'Backup', icon: Shield, bgColor: '#F47121', textColor: 'text-white' },
          { id: 'savings', label: 'Savings', shortLabel: 'Savings', icon: BarChart3, bgColor: '#1F5B65', textColor: 'text-white' }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg border ${
                activeTab === tab.id
                  ? 'transform scale-105 shadow-lg border-white/30'
                  : 'hover:transform hover:scale-102 border-white/10 hover:border-white/20'
              }`}
              style={{ 
                backgroundColor: tab.bgColor,
                color: activeTab === tab.id ? (tab.textColor === 'text-white' ? 'white' : '#1f2937') : (tab.textColor === 'text-white' ? 'rgba(255,255,255,0.8)' : 'rgba(31,41,55,0.8)')
              }}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content - Mobile Optimized */}
      <div className="p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] max-h-[500px] sm:max-h-[600px] overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Footer - Pricing and CTA - Mobile Optimized */}
      <div className="p-4 sm:p-6 border-t border-white/20 bg-white/5">
        <div className="space-y-4">
          {/* Key Stats - Mobile Responsive Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 border border-white/20">
              <div className="text-lg sm:text-xl font-bold text-white">{totalCapacity.toFixed(1)} kWh</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">Capacity</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 border border-white/20">
              <div className="text-lg sm:text-xl font-bold text-white">${totalPrice.toLocaleString()}</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">Price</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 sm:p-3 border border-white/20">
              <div className="text-lg sm:text-xl font-bold text-white">${monthlyPayment}/mo</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">Payment</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onPrequalify}
            className="w-full py-3 bg-white text-gray-900 rounded-xl hover:bg-white/90 transition-all font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            SELECT THIS BATTERY
          </button>
          
          <p className="text-xs text-white/60 text-center">
            Will not impact your credit score
          </p>
        </div>
      </div>
    </div>
  );
};