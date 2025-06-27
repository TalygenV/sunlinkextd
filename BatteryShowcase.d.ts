import React from 'react';

interface BatteryShowcaseProps {
  // Optional props
  updateCurrentBatteryName?: (battery: any) => void;
  selectedBatteryDetails?: any;
  onContinue?: () => void;
}

declare const BatteryShowcase: React.FC<BatteryShowcaseProps>;

export default BatteryShowcase;