import React, { useState } from 'react';
import { Sun, Battery, Zap, Home, Plus, Minus, CreditCard, Shield, Phone, ArrowRight, TrendingUp, DollarSign, Leaf, ToggleLeft, ToggleRight, Lock, CheckCircle, AlertTriangle, Receipt, Wrench, Camera, UserCheck, Award, AlertOctagon, Clock, X, AlertCircle as AlertIcon } from 'lucide-react';
import ExpertContactModal from './ExpertContactModal';
import FinancingOptionsIframe from './FinancingOptionsIframe';

interface SystemOrderSummaryProps {
  systemSize: number;
  batteryCount: number;
  batteryType: string;
  hasEVCharger: boolean;
  hasReRoof: boolean;
  hasElectricalUpgrade: boolean;
  onEVChargerChange: (value: boolean) => void;
  onReRoofChange: (value: boolean) => void;
  onElectricalUpgradeChange: (value: boolean) => void;
  onBatteryCountChange: (count: number) => void;
  pricePerWatt: number;
  solarOnlyPrice: number;
  batteryPrice: number;
  batteryTotalPrice: number;
  systemPrice: number;
  evChargerPrice: number;
  reRoofPrice: number;
  electricalUpgradePrice: number;
  selectedPlan: string;
  totalPrice: number;
  onPaymentSuccess: () => void;
  onPlanChange: (plan: string) => void;
}

const SystemOrderSummary: React.FC<SystemOrderSummaryProps> = ({
  systemSize,
  batteryCount,
  batteryType,
  hasEVCharger,
  hasReRoof,
  hasElectricalUpgrade,
  onEVChargerChange,
  onReRoofChange,
  onElectricalUpgradeChange,
  onBatteryCountChange,
  pricePerWatt,
  solarOnlyPrice,
  batteryPrice,
  batteryTotalPrice,
  systemPrice,
  evChargerPrice,
  reRoofPrice,
  electricalUpgradePrice,
  selectedPlan,
  totalPrice,
  onPaymentSuccess,
  onPlanChange
}) => {
  const [showIncentives, setShowIncentives] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [isFinancingApproved, setIsFinancingApproved] = useState(false);

  // Calculate number of panels (assuming 400W panels)
  const panelWattage = 400; // watts per panel
  const panelCount = Math.round((systemSize * 1000) / panelWattage);

  // Calculate backup duration based on battery count (rough estimate)
  const backupHours = batteryCount * 8; // Assuming 8 hours per battery for average home

  // Check if current plan is financing (not cash)
  const isFinancingPlan = selectedPlan !== 'cash' && selectedPlan !== '';
  
  // Check if user can proceed with payment
  const canProceedWithPayment = selectedPlan === 'cash' || (isFinancingPlan && isFinancingApproved);

  const handleStripePayment = async (cardData: any) => {
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Create a payment intent with Stripe
      // 2. Confirm the payment with the card data
      // 3. Handle the response
      
      console.log('🧪 TEST MODE: Simulating successful payment with card data:', cardData);
      
      setPaymentStep('success');
      
      // Auto-close after 3 seconds and trigger success callback
      setTimeout(() => {
        setShowStripeForm(false);
        setPaymentStep('form');
        onPaymentSuccess();
      }, 3000);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Please try again or contact support.'}`);
      setPaymentStep('form');
    }
  };

  const handleDepositClick = () => {
    if (!canProceedWithPayment) {
      // Show alert for financing approval requirement
      alert('Please complete financing approval before proceeding with your deposit.');
      return;
    }
    setShowStripeForm(true);
  };

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: (value: boolean) => void }> = ({ 
    checked, 
    onChange 
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          checked ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
        }`}
      />
    </button>
  );

  const BatteryCounter: React.FC = () => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onBatteryCountChange(batteryCount - 1)}
        disabled={batteryCount <= 0}
        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="bg-white/20 rounded-lg px-4 py-2 min-w-[60px] text-center border border-white/30">
        <div className="text-2xl font-bold text-white">{batteryCount}</div>
        <div className="text-sm text-gray-300">Units</div>
      </div>
      <button
        onClick={() => onBatteryCountChange(batteryCount + 1)}
        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  const IntegratedStripeForm: React.FC = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const formatCardNumber = (value: string) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = matches && matches[0] || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        return parts.join(' ');
      } else {
        return v;
      }
    };

    const formatExpiryDate = (value: string) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
      }
      return v;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleStripePayment({
        cardNumber,
        expiryDate,
        cvc,
        name,
        email
      });
    };

    if (paymentStep === 'processing') {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-black border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-2xl font-light text-white mb-4">Processing Payment</h4>
          <p className="text-white/60 mb-6">Securing your solar system order...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }

    if (paymentStep === 'success') {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-black border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-2xl font-light text-white mb-4">Payment Successful!</h4>
          <p className="text-white/60 mb-6">Your $500 deposit has been processed successfully.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Order Confirmed</span>
            </div>
            <p className="text-sm text-green-700">
              You'll receive a confirmation email shortly with next steps.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TEST MODE WARNING */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertOctagon className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">🧪 TEST MODE ACTIVE</span>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <p className="font-medium">This is a demonstration. No real charges will be made.</p>
            <p>Use test card: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</span></p>
            <p>Any future expiry date and any 3-digit CVC</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="font-medium text-black mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Solar System ({systemSize} kW)</span>
              <span className="font-medium text-black">${solarOnlyPrice.toLocaleString()}</span>
            </div>
            {batteryCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Battery Storage ({batteryCount}x)</span>
                <span className="font-medium text-black">${batteryTotalPrice.toLocaleString()}</span>
              </div>
            )}
            {hasEVCharger && (
              <div className="flex justify-between">
                <span className="text-gray-600">EV Charger</span>
                <span className="font-medium text-black">${evChargerPrice.toLocaleString()}</span>
              </div>
            )}
            {hasReRoof && (
              <div className="flex justify-between">
                <span className="text-gray-600">Roof Replacement</span>
                <span className="font-medium text-black">${reRoofPrice.toLocaleString()}</span>
              </div>
            )}
            {hasElectricalUpgrade && (
              <div className="flex justify-between">
                <span className="text-gray-600">Electrical Upgrade</span>
                <span className="font-medium text-black">${electricalUpgradePrice.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-black">Total System Cost</span>
                <span className="text-black">${totalPrice.toLocaleString()}</span>
              </div>
              {showIncentives && (
                <div className="flex justify-between text-green-600 text-sm mt-1">
                  <span>After Tax Credits</span>
                  <span>${(totalPrice * 0.70).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-5 h-5 text-black" />
            <span className="font-medium text-black">Deposit Required</span>
          </div>
          <div className="text-2xl font-bold text-black mb-1">$500 <span className="text-sm font-normal text-yellow-600">(TEST)</span></div>
          <div className="text-sm text-gray-600">
            Secure your order and lock in current pricing. Applied to final balance.
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Payment Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Cardholder Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="tesla-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tesla-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-white mb-2">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="tesla-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-white mb-2">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                className="tesla-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-white mb-2">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="tesla-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Locks in current system pricing</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Reserves installation slot</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>100% refundable within 3 days</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
          >
            <Lock className="w-4 h-4" />
            <span>Pay $500 Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => setShowStripeForm(false)}
            className="bg-white/60 px-6 py-3 rounded-xl font-medium text-white"
          >
            Cancel
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secured by Stripe • 256-bit SSL encryption</span>
          </div>
          <div className="text-xs text-yellow-600 font-medium mt-1">
            🧪 TEST MODE: Use card 4242 4242 4242 4242 with any future date and CVC
          </div>
        </div>
      </form>
    );
  };

  const StripeModal: React.FC = () => (
    <div className="fixed inset-0 bg-white/20 z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-light text-white">Secure Your Solar System</h3>
              <p className="text-sm text-white/60">Complete your $500 deposit payment</p>
            </div>
          </div>
          <button
            onClick={() => setShowStripeForm(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <IntegratedStripeForm />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Solar + Storage Plan Card */}
      <div className="tesla-card rounded-2xl p-4 sm:p-6 lg:p-8 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-light text-white mb-6 lg:mb-8">Solar + Storage Plan</h2>
        
        {/* Solar Design Preview - RESTORED */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Your Solar Design</h3>
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20">
            <iframe
              src="about:blank"
              className="w-full h-64 sm:h-80 lg:h-96 rounded-lg bg-white border border-gray-200"
              title="Solar Design Layout"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">Interactive solar panel layout will be displayed here</p>
              <p className="text-xs text-gray-400 mt-1">Ready for Mapbox/Nearmap integration for confirmed solar design</p>
            </div>
          </div>
        </div>

        {/* Main System Configuration */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solar System - LARGER FONT */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sun className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{panelCount} Solar Panels</h3>
                  <p className="text-sm text-gray-300">{systemSize} kW System</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Solar System Cost</span>
                <span className="text-lg font-bold text-white">${solarOnlyPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Battery Storage - LARGER FONT */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Battery className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Battery Storage</h3>
                  <p className="text-sm text-gray-300 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~{backupHours} hours backup</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-300">Battery Cost</span>
                <span className="text-lg font-bold text-white">${batteryTotalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-center">
                <BatteryCounter />
              </div>
            </div>
          </div>

          {/* Blended Total Cost and Tax Credit Section - WHITE BACKGROUND */}
          <div className="border-t border-white/20 pt-6 mt-6">
            <div className="rounded-xl p-6 border border-gray-200">
              {/* Total System Cost Header */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-medium text-white">Total System Cost (Before Incentives)</span>
                <span className="text-2xl font-bold text-white">${totalPrice.toLocaleString()}</span>
              </div>

              {/* Tax Credit Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-base font-medium text-white">Apply Tax Incentives</span>
                </div>
                <button
                  onClick={() => setShowIncentives(!showIncentives)}
                  className="flex items-center"
                >
                  {showIncentives ? (
                    <ToggleRight className="w-8 h-8 text-white" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-white/60" />
                  )}
                </button>
              </div>

              {/* Tax Credit Details */}
              {showIncentives && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Federal Tax Credit</span>
                  </div>
                  <div className="text-2xl font-bold text-green-800 mb-1">
                    -${(totalPrice * 0.30).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-green-600">30% of system cost</div>
                </div>
              )}

              {/* Net Cost After Incentives - WHITE BACKGROUND WITH BLACK TEXT */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-900" />
                  <span className="font-medium text-gray-900">
                    {showIncentives ? 'Net Cost After Incentives' : 'Total Cost'}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ${(showIncentives ? totalPrice * 0.70 : totalPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-600">
                  {showIncentives ? 'Effective cost after 30% federal credit' : 'Before incentives'}
                </div>
              </div>

              {/* Tax Credit Disclaimer */}
              {showIncentives && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Tax Credit Information</p>
                      <p>
                        Federal tax credits are subject to eligibility requirements and may vary based on your tax situation. 
                        Consult with a tax professional to determine your specific benefits.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financing Options Iframe Component */}
        <FinancingOptionsIframe
          selectedPlan={selectedPlan}
          onPlanChange={onPlanChange}
          totalPrice={totalPrice}
          solarOnlyPrice={solarOnlyPrice}
          batteryTotalPrice={batteryTotalPrice}
          batteryCount={batteryCount}
          onFinancingApproved={setIsFinancingApproved}
        />

        {/* Financing Approval Status */}
        {isFinancingPlan && (
          <div className={`p-4 rounded-lg border mb-6 ${
            isFinancingApproved 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isFinancingApproved ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertIcon className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-medium ${
                isFinancingApproved ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {isFinancingApproved ? 'Financing Approved!' : 'Financing Approval Required'}
              </span>
            </div>
            <p className={`text-sm ${
              isFinancingApproved ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {isFinancingApproved 
                ? 'You are pre-approved for financing. You can now proceed with your deposit.'
                : 'Please complete the financing approval process before proceeding with your deposit.'
              }
            </p>
          </div>
        )}

        {/* Add-on Services - Integrated */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Add-on Services</h3>
          
          <div className="space-y-3">
            {/* EV Charger */}
            <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">EV Charger Installation</h4>
                  <p className="text-xs text-gray-300">${evChargerPrice.toLocaleString()}</p>
                </div>
              </div>
              <ToggleSwitch checked={hasEVCharger} onChange={onEVChargerChange} />
            </div>

            {/* Roof Replacement */}
            <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Roof Replacement</h4>
                  <p className="text-xs text-gray-300">${reRoofPrice.toLocaleString()}</p>
                </div>
              </div>
              <ToggleSwitch checked={hasReRoof} onChange={onReRoofChange} />
            </div>

            {/* Electrical Upgrade */}
            <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Electrical Panel Upgrade</h4>
                  <p className="text-xs text-gray-300">${electricalUpgradePrice.toLocaleString()}</p>
                </div>
              </div>
              <ToggleSwitch checked={hasElectricalUpgrade} onChange={onElectricalUpgradeChange} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleDepositClick}
            disabled={!canProceedWithPayment}
            className={`flex-1 py-5 px-8 rounded-xl font-semibold text-xl flex items-center justify-center space-x-3 transition-all duration-200 transform shadow-lg ${
              canProceedWithPayment
                ? 'bg-blue-500 hover:bg-blue-700 text-white hover:scale-[1.02] hover:shadow-xl'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Lock className="w-7 h-7" />
            <span>$500 Deposit with Stripe</span>
          </button>
          
          <button 
            onClick={() => setShowExpertModal(true)}
            className="bg-white/80 py-5 px-8 rounded-xl font-medium flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Chat with Expert</span>
          </button>
        </div>

        {/* Payment Restriction Notice */}
        {!canProceedWithPayment && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertIcon className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {isFinancingPlan 
                  ? 'Financing approval required before proceeding with deposit'
                  : 'Please select a payment plan to continue'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* What's Next - Separate Card for Better Mobile Visibility */}
      <div className="tesla-card rounded-2xl p-4 sm:p-6 lg:p-8 animate-fade-in">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span>What's Next?</span>
        </h3>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Steps - Mobile Optimized */}
          <div className="space-y-6 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:space-x-4">
            {/* Step 1: Confirm Order */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h4 className="font-medium text-white mb-2">Confirm Order</h4>
              <p className="text-sm text-gray-300">Submit your $500 deposit to secure your system</p>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400 hidden sm:block" />
            <div className="w-full h-px bg-white/20 sm:hidden"></div>
            
            {/* Step 2: Upload Photos */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-white mb-2">Upload Photos</h4>
              <p className="text-sm text-gray-300">Share photos of your home for system design</p>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400 hidden sm:block" />
            <div className="w-full h-px bg-white/20 sm:hidden"></div>
            
            {/* Step 3: Get Professional Installer */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-3">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-white mb-2">Get Professional Installer</h4>
              <p className="text-sm text-gray-300">Connect with certified installers in your area</p>
            </div>
          </div>
          
          {/* SunLink Verified Installer Info */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-white" />
              <span className="font-medium text-white">What is a SunLink Verified Installer?</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="font-medium">NABCEP CERTIFIED</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="font-medium">5+ YEARS IN BUSINESS</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="font-medium">LICENSED AND INSURED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Stripe Modal */}
      {showStripeForm && <StripeModal />}

      {/* Expert Contact Modal */}
      <ExpertContactModal 
        isOpen={showExpertModal} 
        onClose={() => setShowExpertModal(false)} 
      />
    </div>
  );
};

export default SystemOrderSummary;