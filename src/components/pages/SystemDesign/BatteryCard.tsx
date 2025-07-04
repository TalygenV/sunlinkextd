import React from 'react';
import { Check, Zap, Minus, Plus } from 'lucide-react';

export interface Battery {
  id: string;
  name: string;
  manufacturer: string;
  capacity: string;
  warranty: string;
  efficiency: string;
  price: number;
  features: string[];
  image?: string;
}

interface BatteryCardProps {
  battery: Battery;
  isSelected: boolean;
  onSelect: (id: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  showQuantityControls: boolean;
  isComparisonMode?: boolean;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({ 
  battery, 
  isSelected, 
  onSelect, 
  quantity, 
  onQuantityChange, 
  showQuantityControls,
  isComparisonMode = false
}) => {
  const totalCapacity = parseFloat(battery.capacity) * quantity;
  const totalPrice = battery.price * quantity;

  // Calculate monthly payment for this battery configuration
  // Base 7kW system at $2.00/watt = $14,000
  const baseSolarSystemCost = 7000 * 2;
  const totalSystemCost = baseSolarSystemCost + totalPrice;
  
  const calculateMonthlyPayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const baseSolarPayment = calculateMonthlyPayment(baseSolarSystemCost, 4.49, 25);
  const totalSystemPayment = calculateMonthlyPayment(totalSystemCost, 4.49, 25);
  const batteryMonthlyPayment = totalSystemPayment - baseSolarPayment;

  return (
    <div 
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        isComparisonMode 
          ? 'hover:scale-102 hover:shadow-lg' 
          : 'hover:scale-105'
      } ${
        isSelected 
          ? 'border-white/30 shadow-xl shadow-black/20' 
          : 'border-white/20 hover:border-white/30'
      } ${isComparisonMode ? 'min-h-[400px]' : ''}`}
      style={{ backgroundColor: '#3C3C3C' }}
      onClick={() => onSelect(battery.id)}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10 shadow-lg">
          <Check className="w-5 h-5 text-gray-900" />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`${isComparisonMode ? 'text-lg' : 'text-xl'} font-bold text-white`}>
            {battery.name}
          </h3>
          <p className="text-white/70 text-sm">{battery.manufacturer}</p>
        </div>
        <Zap className="w-8 h-8 text-white" />
      </div>

      {/* Quantity Controls - Only show for selected battery and not in comparison mode */}
      {showQuantityControls && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Quantity</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(Math.max(1, quantity - 1));
                }}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="text-lg font-bold text-white w-8 text-center">{quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(quantity + 1);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-white/70">Capacity</span>
          <span className="text-white font-semibold">
            {showQuantityControls && quantity > 1 
              ? `${totalCapacity.toFixed(1)} kWh (${quantity}x ${battery.capacity})`
              : battery.capacity
            }
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Warranty</span>
          <span className="text-white font-semibold">{battery.warranty}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Efficiency</span>
          <span className="text-white font-semibold">{battery.efficiency}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {battery.features.slice(0, isComparisonMode ? 3 : 5).map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-white/90">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 flex-shrink-0"></div>
            <span className="truncate">{feature}</span>
          </div>
        ))}
        {isComparisonMode && battery.features.length > 3 && (
          <div className="text-xs text-white/60">
            +{battery.features.length - 3} more features
          </div>
        )}
      </div>

      <div className="border-t border-white/20 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Monthly Payment</span>
          <span className={`${isComparisonMode ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
            As low as ${Math.round(showQuantityControls && quantity > 1 ? batteryMonthlyPayment : calculateMonthlyPayment(baseSolarSystemCost + battery.price, 4.49, 25) - baseSolarPayment)}/mo
          </span>
        </div>
        <p className="text-xs text-white/60 mt-1">25 year term at 4.49% APR</p>
        
        {isComparisonMode && isSelected && (
          <div className="mt-2 px-3 py-1 bg-white/20 rounded-full">
            <p className="text-xs text-white text-center">Currently Selected</p>
          </div>
        )}
      </div>
    </div>
  );
};