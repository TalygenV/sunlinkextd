import React from 'react';

interface SavingsData {
  month: string;
  withoutBattery: number;
  withBattery: number;
  savings: number;
}

interface SavingsChartProps {
  data: SavingsData[];
  showSavings: boolean;
}

export const SavingsChart: React.FC<SavingsChartProps> = ({ data, showSavings }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.withoutBattery, d.withBattery)));
  
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {showSavings ? 'Monthly Savings' : 'Energy Costs'}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          {!showSavings && (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-gray-400">Grid Only</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-400">Solar + Battery</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-12 text-sm text-gray-400 mr-4">{item.month}</div>
            
            {showSavings ? (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">Savings</span>
                  <span className="text-sm font-semibold text-green-400">
                    ${item.savings}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.savings / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-1">
                <div className="flex">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Grid Only</span>
                      <span className="text-xs text-red-400">${item.withoutBattery}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
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
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(item.withBattery / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showSavings && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Annual Savings</span>
            <span className="text-2xl font-bold text-green-400">
              ${data.reduce((sum, item) => sum + item.savings, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const getSavingsData = (): SavingsData[] => [
  { month: 'Jan', withoutBattery: 245, withBattery: 156, savings: 89 },
  { month: 'Feb', withoutBattery: 198, withBattery: 134, savings: 64 },
  { month: 'Mar', withoutBattery: 287, withBattery: 167, savings: 120 },
  { month: 'Apr', withoutBattery: 312, withBattery: 189, savings: 123 },
  { month: 'May', withoutBattery: 356, withBattery: 213, savings: 143 },
  { month: 'Jun', withoutBattery: 398, withBattery: 245, savings: 153 },
  { month: 'Jul', withoutBattery: 421, withBattery: 267, savings: 154 },
  { month: 'Aug', withoutBattery: 409, withBattery: 259, savings: 150 },
  { month: 'Sep', withoutBattery: 367, withBattery: 224, savings: 143 },
  { month: 'Oct', withoutBattery: 298, withBattery: 178, savings: 120 },
  { month: 'Nov', withoutBattery: 234, withBattery: 145, savings: 89 },
  { month: 'Dec', withoutBattery: 267, withBattery: 167, savings: 100 }
];