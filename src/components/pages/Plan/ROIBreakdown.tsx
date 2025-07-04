import React, { useState } from 'react';
import { TrendingUp, DollarSign, Zap, Leaf, BarChart3, List, Calculator } from 'lucide-react';

interface ROIBreakdownProps {
  systemSize: number;
  totalPrice: number;
}

const ROIBreakdown: React.FC<ROIBreakdownProps> = ({ systemSize, totalPrice }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'timeline' | 'analysis'>('chart');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  
  // Calculations based on average solar production and electricity rates
  const annualProduction = systemSize * 1350; // kWh per year (conservative estimate)
  const electricityRate = 0.13; // Average cost per kWh
  const rateIncrease = 0.03; // 3% annual electricity rate increase

  const calculateSavings = (years: number) => {
    let totalSavings = 0;
    for (let i = 1; i <= years; i++) {
      const yearRate = electricityRate * Math.pow(1 + rateIncrease, i - 1);
      totalSavings += annualProduction * yearRate;
    }
    return totalSavings;
  };

  const thirtyYearSavings = calculateSavings(30);
  const roi = ((thirtyYearSavings - totalPrice) / totalPrice) * 100;

  // Generate data for chart (yearly data points)
  const chartData = [];
  let cumulativeSavings = 0;
  for (let year = 1; year <= 30; year++) {
    const yearRate = electricityRate * Math.pow(1 + rateIncrease, year - 1);
    const yearSavings = annualProduction * yearRate;
    cumulativeSavings += yearSavings;
    const netSavings = cumulativeSavings - totalPrice;
    chartData.push({
      year,
      yearSavings,
      cumulativeSavings,
      netSavings,
      breakEven: netSavings >= 0
    });
  }

  const milestones = [
    { year: 1, savings: calculateSavings(1) },
    { year: 5, savings: calculateSavings(5) },
    { year: 10, savings: calculateSavings(10) },
    { year: 15, savings: calculateSavings(15) },
    { year: 20, savings: calculateSavings(20) },
    { year: 25, savings: calculateSavings(25) },
    { year: 30, savings: calculateSavings(30) }
  ];

  const maxSavings = Math.max(...chartData.map(d => d.cumulativeSavings));
  const breakEvenYear = chartData.find(d => d.breakEven)?.year || 30;

  // Calculate energy offset percentage (assuming average home uses 10,500 kWh/year)
  const averageHomeUsage = 10500; // kWh per year
  const energyOffset = Math.round((annualProduction / averageHomeUsage) * 100);

  const InteractiveChart: React.FC = () => {
    return (
      <div className="bg-black rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-lg font-medium">30-Year Savings Projection</h3>
          {hoveredYear && (
            <div className="text-left sm:text-right bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-sm opacity-80">Year {hoveredYear}</div>
              <div className="font-bold text-lg">
                ${chartData[hoveredYear - 1]?.cumulativeSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs opacity-70">
                Annual: ${chartData[hoveredYear - 1]?.yearSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
          )}
        </div>
        
        {/* Chart Container with Y-axis labels inside */}
        <div className="relative h-64 sm:h-80 mb-4">
          {/* Chart area */}
          <div className="relative h-full">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div key={percent} className="border-t border-white/20"></div>
              ))}
            </div>
            
            {/* Y-axis labels - positioned inside the chart area */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs pointer-events-none">
              {[100, 75, 50, 25, 0].map((percent) => (
                <div key={percent} className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                  ${((maxSavings * percent) / 100 / 1000).toFixed(0)}K
                </div>
              ))}
            </div>
            
            {/* Break-even line */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-green-400 opacity-80"
              style={{ bottom: `${(totalPrice / maxSavings) * 100}%` }}
            >
              <span className="absolute right-2 -top-6 text-xs bg-green-400 text-black px-2 py-1 rounded whitespace-nowrap font-medium">
                Break-even: ${(totalPrice / 1000).toFixed(0)}K
              </span>
            </div>
            
            {/* Savings line chart */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Cumulative savings line */}
              <polyline
                fill="none"
                stroke="rgba(34, 197, 94, 0.9)"
                strokeWidth="0.5"
                points={chartData.map((data, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (data.cumulativeSavings / maxSavings) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Fill area under the curve */}
              <polygon
                fill="url(#savingsGradient)"
                points={`0,100 ${chartData.map((data, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (data.cumulativeSavings / maxSavings) * 100;
                  return `${x},${y}`;
                }).join(' ')} 100,100`}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Interactive data points */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full">
              {chartData.map((data, index) => {
                const height = (data.cumulativeSavings / maxSavings) * 100;
                const isBreakEven = data.breakEven;
                
                return (
                  <div
                    key={data.year}
                    className="flex-1 flex flex-col justify-end h-full cursor-pointer group"
                    onMouseEnter={() => setHoveredYear(data.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    {/* Hover indicator */}
                    <div 
                      className={`w-full transition-all duration-200 ${
                        hoveredYear === data.year ? 'bg-white/30' : 'bg-transparent hover:bg-white/10'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    
                    {/* Data point */}
                    <div
                      className={`w-2 h-2 mx-auto mb-1 rounded-full transition-all duration-200 ${
                        isBreakEven 
                          ? 'bg-green-400 shadow-lg' 
                          : 'bg-gray-400'
                      } ${hoveredYear === data.year ? 'scale-150 shadow-xl' : 'group-hover:scale-125'}`}
                    />
                    
                    {/* Year labels */}
                    {data.year % 5 === 0 && (
                      <div className="text-xs text-center opacity-60 mt-1">
                        {data.year}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="opacity-80">Payback Period</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="opacity-80">Profit Years</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="opacity-80">Break-even: Year {breakEvenYear}</div>
          </div>
        </div>
      </div>
    );
  };

  const AnalysisView: React.FC = () => {
    return (
      <div className="bg-black rounded-xl p-4 sm:p-6 text-white">
        <h3 className="text-lg font-medium mb-6">30-Year Financial Analysis</h3>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:p-6">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white">Total Savings</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              ${thirtyYearSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Over 30 years</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:p-6">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white">ROI</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">{roi.toFixed(0)}%</div>
            <div className="text-xs sm:text-sm text-gray-300">Return on investment</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:p-6">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white">Annual Production</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">{annualProduction.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-gray-300">kWh per year</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:p-6">
            <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white">CO₂ Avoided</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">{(annualProduction * 0.92 * 30 / 1000).toFixed(0)}</div>
            <div className="text-xs sm:text-sm text-gray-300">tons over 30 years</div>
          </div>
        </div>

        {/* Additional Analysis Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">Energy Independence</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Annual Energy Offset</span>
                <span className="font-medium text-white">{energyOffset}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Break-even Point</span>
                <span className="font-medium text-white">Year {breakEvenYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">System Lifespan</span>
                <span className="font-medium text-white">25+ years</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">Financial Benefits</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Net Profit (30 years)</span>
                <span className="font-medium text-green-400">${(thirtyYearSavings - totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Average Annual Savings</span>
                <span className="font-medium text-white">${(thirtyYearSavings / 30).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Property Value Increase</span>
                <span className="font-medium text-white">${(totalPrice * 0.04).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">Analysis Assumptions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="space-y-2">
              <div>• Annual production: {annualProduction.toLocaleString()} kWh</div>
              <div>• Current electricity rate: ${electricityRate}/kWh</div>
              <div>• Annual rate increase: {(rateIncrease * 100).toFixed(1)}%</div>
            </div>
            <div className="space-y-2">
              <div>• System degradation: 0.5% annually</div>
              <div>• Maintenance costs: Minimal</div>
              <div>• Federal tax credit: 30%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tesla-card rounded-2xl p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-white">30-Year ROI Analysis</h2>
            <p className="text-sm text-gray-300">Based on {systemSize} kW system producing {annualProduction.toLocaleString()} kWh/year</p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'chart'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Chart</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('analysis')}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'analysis'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Analysis</span>
          </button>
        </div>
      </div>

      {/* Interactive Content */}
      {viewMode === 'chart' ? (
        <InteractiveChart />
      ) : viewMode === 'analysis' ? (
        <AnalysisView />
      ) : (
        <div>
          <h3 className="text-lg font-medium text-white mb-4 sm:mb-6">Cumulative Savings Timeline</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="tesla-hover flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/10 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-black font-bold">
                    {milestone.year}
                  </div>
                  <div>
                    <div className="font-medium text-white">Year {milestone.year}</div>
                    <div className="text-sm text-gray-300">
                      {milestone.year === 1 ? 'First year savings' : `${milestone.year} years of solar power`}
                    </div>
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    ${milestone.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-gray-300">
                    {milestone.savings > totalPrice ? 
                      `+$${(milestone.savings - totalPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })} profit` : 
                      `$${(totalPrice - milestone.savings).toLocaleString('en-US', { maximumFractionDigits: 0 })} to break even`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ROIBreakdown;