import React, { useState, useEffect } from 'react';

interface EnergyOffsetChartProps {
  offset: number;
  panelCount: number;
  maxPanels?: number;
}

export const EnergyOffsetChart: React.FC<EnergyOffsetChartProps> = ({ 
  offset, 
  panelCount, 
  maxPanels = 50 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animatedOffset, setAnimatedOffset] = useState(0);
  
  // Animate the offset change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(offset);
    }, 100);
    return () => clearTimeout(timer);
  }, [offset]);
  
  // Calculate percentages - handle over 100% scenarios
  const solarPercentage = Math.min(animatedOffset, 100);
  const utilityPercentage = Math.max(0, 100 - solarPercentage);
  const isOverProducing = animatedOffset > 100;
  const excessPercentage = Math.max(0, animatedOffset - 100);
  
  // SVG circle properties
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate stroke dash offsets
  const solarStrokeDashoffset = circumference - (solarPercentage / 100) * circumference;
  const utilityStrokeDashoffset = circumference - (utilityPercentage / 100) * circumference;
  
  // Colors - clean, modern palette
  const solarColor = '#22c55e'; // Bright green for solar
  const utilityColor = '#f87171'; // Light red for utility
  const excessColor = '#3b82f6'; // Blue for excess production
  const backgroundColor = '#f3f4f6'; // Light gray background

  return (
    <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-xl p-4 lg:p-6 border border-[#e5e7eb]">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-white text-base lg:text-lg font-semibold">Energy Offset</h3>
        <div className="text-right">
          <div className={`text-xl lg:text-2xl font-bold ${animatedOffset >= 100 ? 'text-green-400' : 'text-white'}`}>
            {Math.round(animatedOffset)}%
          </div>
          <div className="text-xs text-white/70">
            {isOverProducing ? 'surplus generation' : 'solar coverage'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-4 lg:mb-6">
        <div 
          className="relative cursor-pointer transform transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              stroke={backgroundColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx="100"
              cy="100"
            />
            
            {/* Utility portion (light red) - only show if below 100% */}
            {utilityPercentage > 0 && (
              <circle
                stroke={utilityColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
                r={normalizedRadius}
                cx="100"
                cy="100"
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: isHovered ? `drop-shadow(0 0 8px ${utilityColor}66)` : 'none'
                }}
              />
            )}
            
            {/* Solar portion (bright green) */}
            <circle
              stroke={solarColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={solarStrokeDashoffset}
              r={normalizedRadius}
              cx="100"
              cy="100"
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isHovered ? `drop-shadow(0 0 12px ${solarColor}88)` : `drop-shadow(0 0 4px ${solarColor}44)`
              }}
            />
            
            {/* Excess production circle (over 100%) */}
            {isOverProducing && (
              <circle
                stroke={excessColor}
                fill="transparent"
                strokeWidth={8}
                strokeDasharray={`${circumference * 0.7} ${circumference * 0.7}`}
                strokeDashoffset={circumference * 0.7 * (1 - Math.min(excessPercentage / 50, 1))}
                r={normalizedRadius - 20}
                cx="100"
                cy="100"
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: isHovered ? `drop-shadow(0 0 6px ${excessColor}66)` : 'none'
                }}
              />
            )}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl lg:text-4xl font-bold transition-all duration-300 ${
                isHovered 
                  ? animatedOffset >= 100 ? 'text-green-400 scale-110' : 'text-white scale-110'
                  : animatedOffset >= 100 ? 'text-green-400' : 'text-white'
              }`}>
                {Math.round(animatedOffset)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: solarColor }}></div>
            <span className="text-white/70 text-xs lg:text-sm font-medium">Solar Generation</span>
          </div>
          <div className="text-right">
            <div className="text-xs lg:text-sm font-bold" style={{ color: solarColor }}>
              {Math.round(Math.min(animatedOffset, 100))}%
            </div>
            <div className="text-xs text-white/70">{panelCount} panels</div>
          </div>
        </div>
        
        {utilityPercentage > 0 && (
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: utilityColor }}></div>
              <span className="text-white/70 text-xs lg:text-sm font-medium">Utility Dependency</span>
            </div>
            <div className="text-right">
              <div className="text-xs lg:text-sm font-bold" style={{ color: utilityColor }}>{Math.round(utilityPercentage)}%</div>
              <div className="text-xs text-white/70">from grid</div>
            </div>
          </div>
        )}
        
        {isOverProducing && (
          <div className="p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] flex-shrink-0"></div>
                <span className="text-white/70 text-xs lg:text-sm font-medium">Excess Production</span>
              </div>
              <div className="text-[#3b82f6] text-xs lg:text-sm font-bold">{Math.round(excessPercentage)}%</div>
            </div>
            <div className="text-xs text-white/70 mb-2">Options for surplus energy:</div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded border border-white/20">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-white/70">Store Power</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-white/70">Sell Back</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {panelCount === 0 && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20 border-dashed">
          <p className="text-white/70 text-xs lg:text-sm text-center">
            Select an offset target to see energy breakdown
          </p>
        </div>
      )}
    </div>
  );
};