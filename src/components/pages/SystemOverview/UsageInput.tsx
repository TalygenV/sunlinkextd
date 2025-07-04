import React, { useState, useEffect } from 'react';
import { Calendar, Zap, Edit3, Check, X } from 'lucide-react';

interface UsageInputProps {
  annualUsage: number;
  onUsageChange: (usage: number) => void;
}

export const UsageInput: React.FC<UsageInputProps> = ({ annualUsage, onUsageChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputMode, setInputMode] = useState<'annual' | 'monthly'>('annual');
  const [tempAnnualUsage, setTempAnnualUsage] = useState(annualUsage);
  const [monthlyUsage, setMonthlyUsage] = useState<number[]>(() => {
    // Initialize with average monthly usage
    const avgMonthly = Math.round(annualUsage / 12);
    return Array(12).fill(avgMonthly);
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Update monthly values when annual usage changes externally
  useEffect(() => {
    if (!isEditing) {
      const avgMonthly = Math.round(annualUsage / 12);
      setMonthlyUsage(Array(12).fill(avgMonthly));
      setTempAnnualUsage(annualUsage);
    }
  }, [annualUsage, isEditing]);

  const handleMonthlyChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newMonthlyUsage = [...monthlyUsage];
    newMonthlyUsage[index] = numValue;
    setMonthlyUsage(newMonthlyUsage);
  };

  const calculateAnnualFromMonthly = () => {
    return monthlyUsage.reduce((sum, month) => sum + month, 0);
  };

  const handleSave = () => {
    let newAnnualUsage;
    if (inputMode === 'annual') {
      newAnnualUsage = tempAnnualUsage;
    } else {
      newAnnualUsage = calculateAnnualFromMonthly();
    }
    
    onUsageChange(newAnnualUsage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempAnnualUsage(annualUsage);
    const avgMonthly = Math.round(annualUsage / 12);
    setMonthlyUsage(Array(12).fill(avgMonthly));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-lg p-4 border border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/70 text-xs uppercase tracking-wide font-medium mb-2">Annual Usage</div>
            <div className="text-white text-xl lg:text-2xl font-bold">{annualUsage.toLocaleString()}</div>
            <div className="text-white/70 text-sm">kWh</div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex-shrink-0"
            title="Edit usage"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-lg p-4 border border-[#ff6b35] col-span-full lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-white" />
          <h4 className="text-white font-semibold text-sm lg:text-base">Edit Annual Usage</h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-all duration-200"
            title="Save changes"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toggle between input modes */}
      <div className="flex bg-white/10 rounded-lg p-1 mb-4 border border-white/20">
        <button
          onClick={() => setInputMode('annual')}
          className={`flex-1 py-2 px-3 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
            inputMode === 'annual'
              ? 'bg-white text-slate-700'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Annual Total
        </button>
        <button
          onClick={() => setInputMode('monthly')}
          className={`flex-1 py-2 px-3 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
            inputMode === 'monthly'
              ? 'bg-white text-slate-700'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Monthly Breakdown
        </button>
      </div>

      {inputMode === 'annual' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-xs lg:text-sm font-medium mb-2">
              Total Annual Usage (kWh)
            </label>
            <input
              type="number"
              value={tempAnnualUsage}
              onChange={(e) => setTempAnnualUsage(parseInt(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors text-sm lg:text-base"
              placeholder="Enter annual usage"
            />
          </div>
          <div className="text-xs text-white/70">
            Average monthly: {Math.round(tempAnnualUsage / 12).toLocaleString()} kWh
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
            {months.map((month, index) => (
              <div key={month}>
                <label className="block text-white/70 text-xs font-medium mb-1">
                  {month}
                </label>
                <input
                  type="number"
                  value={monthlyUsage[index]}
                  onChange={(e) => handleMonthlyChange(index, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white placeholder-white/50 text-xs lg:text-sm focus:border-white/40 focus:outline-none transition-colors"
                  placeholder="kWh"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
            <span className="text-white/70 text-xs lg:text-sm font-medium">Annual Total</span>
            <span className="text-white font-bold text-sm lg:text-base">
              {calculateAnnualFromMonthly().toLocaleString()} kWh
            </span>
          </div>
        </div>
      )}
    </div>
  );
};