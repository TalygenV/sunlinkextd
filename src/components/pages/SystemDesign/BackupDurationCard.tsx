import React, { useState } from 'react';
import { Home, Lightbulb, Zap, BarChart3, Settings } from 'lucide-react';

interface BackupOption {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  items: string[];
}

interface SavingsData {
  month: string;
  withoutBattery: number;
  withBattery: number;
  savings: number;
}

interface BackupDurationCardProps {
  backupOptions: BackupOption[];
  savingsData: SavingsData[];
  operatingMode: string;
  onOperatingModeChange: (mode: string) => void;
}

export const BackupDurationCard: React.FC<BackupDurationCardProps> = ({ 
  backupOptions, 
  savingsData,
  operatingMode,
  onOperatingModeChange
}) => {
  const [showSavings, setShowSavings] = useState(false);
  const maxValue = Math.max(...savingsData.map(d => Math.max(d.withoutBattery, d.withBattery)));

  const operatingModes = [
    { id: 'backup', label: 'Backup', description: 'Emergency power only' },
    { id: 'self-consumption', label: 'Self-Consumption', description: 'Use solar first, then battery' },
    { id: 'time-of-use', label: 'Time-of-Use', description: 'Avoid peak hour rates' }
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {showSavings ? 'Energy Savings Analysis' : 'Backup Duration & Operating Mode'}
        </h3>
        
        {/* Toggle Button */}
        <div className="flex items-center bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setShowSavings(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              !showSavings 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Backup
            </div>
          </button>
          <button
            onClick={() => setShowSavings(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              showSavings 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Savings
            </div>
          </button>
        </div>
      </div>
      
      {/* Content Area with Smooth Transition */}
      <div className="relative overflow-hidden">
        <div 
          className={`transition-all duration-500 ease-in-out ${
            showSavings ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
          style={{ display: showSavings ? 'none' : 'block' }}
        >
          {/* Operating Mode Selection */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-blue-400 mr-2" />
              <h4 className="text-lg font-semibold text-white">Operating Mode</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {operatingModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onOperatingModeChange(mode.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    operatingMode === mode.id
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-sm">{mode.label}</div>
                  <div className="text-xs text-gray-400">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Backup Duration Content */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Backup Duration Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {backupOptions.map((option) => (
                <div key={option.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${option.color} mr-3`}>
                      {option.icon}
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">{option.title}</h5>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white">{option.duration}</div>
                    <div className="text-sm text-gray-400">days</div>
                  </div>
                  
                  <div className="space-y-1">
                    {option.items.map((item, index) => (
                      <div key={index} className="text-xs text-gray-300 flex items-center">
                        <div className="w-1 h-1 bg-gray-500 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div 
          className={`transition-all duration-500 ease-in-out ${
            showSavings ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ display: showSavings ? 'block' : 'none' }}
        >
          {/* Savings Content */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-gray-400">Grid Only</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-400">Solar + Battery</span>
              </div>
            </div>

            {savingsData.slice(0, 8).map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-12 text-sm text-gray-400 mr-4">{item.month}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Grid Only</span>
                        <span className="text-xs text-red-400">${item.withoutBattery}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-red-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${(item.withoutBattery / maxValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Solar + Battery</span>
                        <span className="text-xs text-green-400">${item.withBattery}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${(item.withBattery / maxValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-blue-400">
                      Save ${item.savings}/mo
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Annual Savings</span>
                <span className="text-2xl font-bold text-green-400">
                  ${savingsData.reduce((sum, item) => sum + item.savings, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getBackupOptions = (quantity: number = 1): BackupOption[] => {
  // Calculate backup duration multiplier based on quantity
  const multiplier = quantity;
  
  return [
    {
      id: 'essentials',
      title: 'Essentials',
      description: 'Critical systems only',
      duration: `${Math.round(7 * multiplier)}+`,
      icon: <Lightbulb className="w-5 h-5 text-white" />,
      color: 'bg-green-600',
      items: [
        'Refrigerator',
        'Lights (LED)',
        'Phone charging',
        'Internet/WiFi',
        'Security system'
      ]
    },
    {
      id: 'appliances',
      title: 'Appliances',
      description: 'Most home appliances',
      duration: `${(2.1 * multiplier).toFixed(1)}`,
      icon: <Zap className="w-5 h-5 text-white" />,
      color: 'bg-blue-600',
      items: [
        'All essentials',
        'Washer/Dryer',
        'Dishwasher',
        'Microwave',
        'TV & Electronics'
      ]
    },
    {
      id: 'whole-home',
      title: 'Whole Home',
      description: 'Complete home backup',
      duration: `${(0.6 * multiplier).toFixed(1)}`,
      icon: <Home className="w-5 h-5 text-white" />,
      color: 'bg-purple-600',
      items: [
        'All appliances',
        'HVAC system',
        'Electric vehicle charging',
        'Pool/Spa equipment',
        'Workshop tools'
      ]
    }
  ];
};