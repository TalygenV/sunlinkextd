import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    'System Design',
    'Financing',
    'Add-ons',
    'Review & Confirm'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-lg ${
                index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/90 text-gray-500 backdrop-blur-sm'
              }`}>
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                index <= currentStep ? 'text-white drop-shadow-sm' : 'text-white/70'
              }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded-full ${
                index < currentStep ? 'bg-green-500' : 'bg-white/30'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;