import React, { useState, useCallback, useMemo, useRef } from 'react';
import { CreditCard, DollarSign, TrendingUp, CheckCircle, X, ExternalLink, Clock, AlertCircle, Shield, Battery, Mail, Send, Calculator, Info } from 'lucide-react';

interface FinancingOptionsIframeProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  totalPrice: number;
  solarOnlyPrice: number;
  batteryTotalPrice: number;
  batteryCount: number;
  onFinancingApproved?: (approved: boolean) => void;
}

const FinancingOptionsIframe: React.FC<FinancingOptionsIframeProps> = ({
  selectedPlan,
  onPlanChange,
  totalPrice,
  solarOnlyPrice,
  batteryTotalPrice,
  batteryCount,
  onFinancingApproved
}) => {
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [showLoanApp, setShowLoanApp] = useState(false);
  const [applicationStep, setApplicationStep] = useState<'form' | 'processing' | 'approved' | 'documents'>('form');
  const [documentsRequested, setDocumentsRequested] = useState(false);
  
  // Use refs for form data to prevent re-renders during typing
  const formDataRef = useRef({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    income: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Calculate re-amortizing loan payments
  const calculateReAmortizingLoan = useCallback((principal: number, years: number, rate: number) => {
    const monthlyRate = rate / 12 / 100;
    const totalMonths = years * 12;
    
    // Calculate the lowest possible payment (months 1-16)
    // This is based on a 360-month (30-year) amortization to get the lowest payment
    const amortizationMonths = 360; // 30 years for lowest payment
    const lowestPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths)) / 
                         (Math.pow(1 + monthlyRate, amortizationMonths) - 1);
    
    // Calculate principal balance after 16 months of lowest payments
    let balance = principal;
    for (let i = 0; i < 16; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = lowestPayment - interestPayment;
      balance -= principalPayment;
    }
    
    // Tax credit amount (30% of original principal)
    const taxCredit = principal * 0.30;
    
    // Remaining months after 16-month period
    const remainingMonths = totalMonths - 16;
    
    // Scenario 1: Customer applies tax credit to principal
    const balanceAfterTaxCredit = balance - taxCredit;
    const paymentWithTaxCredit = balanceAfterTaxCredit <= 0 ? 0 : 
      (balanceAfterTaxCredit * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
      (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    
    // Scenario 2: Customer chooses not to apply tax credit
    const paymentWithoutTaxCredit = (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                                   (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    
    return {
      lowestPayment, // Months 1-16 payment
      balanceAt16Months: balance,
      taxCredit,
      paymentWithTaxCredit: Math.max(0, paymentWithTaxCredit), // Months 17+ if credit applied
      paymentWithoutTaxCredit, // Months 17+ if credit not applied
      totalInterestWithCredit: (lowestPayment * 16) + (paymentWithTaxCredit * remainingMonths) - principal + taxCredit,
      totalInterestWithoutCredit: (lowestPayment * 16) + (paymentWithoutTaxCredit * remainingMonths) - principal
    };
  }, []);

  const loanOptions = useMemo(() => [
    {
      id: '10-year',
      term: '10 Years',
      years: 10,
      rate: 4.49,
      warrantyYears: 25,
      icon: TrendingUp,
      popular: false,
      badge: 'FASTEST PAYOFF',
      badgeColor: 'bg-blue-600 text-white',
      perks: [
        'Lowest total interest paid',
        'Build equity fastest',
        'Highest monthly tax benefits',
        'Best for high-income households'
      ],
      recommendation: 'Perfect if you want to own your system quickly and have strong monthly cash flow.',
      loanDetails: calculateReAmortizingLoan(totalPrice, 10, 4.49)
    },
    {
      id: '15-year',
      term: '15 Years',
      years: 15,
      rate: 4.49,
      warrantyYears: 25,
      icon: CreditCard,
      popular: true,
      badge: 'MOST POPULAR',
      badgeColor: 'bg-green-600 text-white',
      perks: [
        'Balanced payment & savings',
        'Moderate monthly commitment',
        'Good interest savings',
        'Flexible for most budgets'
      ],
      recommendation: 'The sweet spot between affordability and total cost - chosen by 70% of our customers.',
      loanDetails: calculateReAmortizingLoan(totalPrice, 15, 4.49)
    },
    {
      id: '25-year',
      term: '25 Years',
      years: 25,
      rate: 4.49,
      warrantyYears: 25,
      icon: CreditCard,
      popular: false,
      badge: 'LOWEST PAYMENT',
      badgeColor: 'bg-purple-600 text-white',
      perks: [
        'Lowest monthly payment',
        'Immediate positive cash flow',
        'Easier budget integration',
        'Long-term wealth building'
      ],
      recommendation: 'Ideal if you want maximum monthly savings from day one with minimal payment stress.',
      loanDetails: calculateReAmortizingLoan(totalPrice, 25, 4.49)
    }
  ], [totalPrice, calculateReAmortizingLoan]);

  const cashOption = useMemo(() => ({
    id: 'cash',
    term: 'Pay in Full',
    downPayment: totalPrice * 0.5,
    installPayment: totalPrice * 0.5,
    totalCost: totalPrice,
    warrantyYears: 25,
    icon: DollarSign,
    badge: 'MAXIMUM SAVINGS',
    badgeColor: 'bg-gray-800 text-white',
    perks: [
      'No interest charges ever',
      'Maximum ROI potential',
      'Immediate 100% ownership',
      'Highest property value increase'
    ],
    recommendation: 'Best long-term value if you have available capital and want maximum returns.'
  }), [totalPrice]);

  const handlePlanSelect = useCallback((planId: string) => {
    if (planId === 'cash') {
      // Cash option - no approval needed
      onPlanChange(planId);
      setShowFinancingModal(false);
      if (onFinancingApproved) {
        onFinancingApproved(true); // Cash is always "approved"
      }
    } else {
      // Financing option - need approval
      setSelectedTerm(planId);
      setShowLoanApp(true);
      setApplicationStep('form');
      setDocumentsRequested(false);
      // Reset form data when opening new application
      formDataRef.current = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ssn: '',
        income: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      };
    }
  }, [onPlanChange, onFinancingApproved]);

  const handlePreQualifyForCurrentPlan = useCallback(() => {
    if (selectedPlan === 'cash') {
      // Cash option doesn't need pre-qualification
      return;
    }
    
    // For financing plans, open the loan application
    setSelectedTerm(selectedPlan || '25-year'); // Default to 25-year if no plan selected
    setShowLoanApp(true);
    setApplicationStep('form');
    setDocumentsRequested(false);
    // Reset form data when opening new application
    formDataRef.current = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ssn: '',
      income: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
  }, [selectedPlan]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setApplicationStep('processing');
    
    // Simulate processing for 2 seconds then approve
    setTimeout(() => {
      setApplicationStep('approved');
    }, 2000);
  }, []);

  const handleContinueWithPlan = useCallback(() => {
    onPlanChange(selectedTerm);
    setShowLoanApp(false);
    setShowFinancingModal(false);
    setApplicationStep('form');
    setDocumentsRequested(false);
    if (onFinancingApproved) {
      onFinancingApproved(true);
    }
  }, [selectedTerm, onPlanChange, onFinancingApproved]);

  const handleRequestDocuments = useCallback(() => {
    setDocumentsRequested(true);
    setApplicationStep('documents');
    
    // Simulate sending documents
    setTimeout(() => {
      // Auto-close after showing documents sent confirmation
      setTimeout(() => {
        handleContinueWithPlan();
      }, 3000);
    }, 1000);
  }, [handleContinueWithPlan]);

  const handleCloseModal = useCallback(() => {
    setShowLoanApp(false);
    setApplicationStep('form');
    setSelectedTerm('');
    setDocumentsRequested(false);
  }, []);

  const getCurrentPlanDetails = () => {
    if (selectedPlan === 'cash') {
      return {
        type: 'Pay in Full Option',
        amount: cashOption.warrantyYears,
        term: '25 years comprehensive warranty',
        isMonthly: false
      };
    }
    
    const option = loanOptions.find(opt => opt.id === selectedPlan);
    if (option) {
      return {
        type: 'Monthly Payment (Months 1-16)',
        amount: option.loanDetails.lowestPayment,
        term: `${option.years} years at ${option.rate}% APR`,
        isMonthly: true,
        loanDetails: option.loanDetails
      };
    }
    
    // Default to 25-year if no plan selected
    const defaultOption = loanOptions.find(opt => opt.id === '25-year')!;
    return {
      type: 'Monthly Payment (Months 1-16)',
      amount: defaultOption.loanDetails.lowestPayment,
      term: `${defaultOption.years} years at ${defaultOption.rate}% APR`,
      isMonthly: true,
      loanDetails: defaultOption.loanDetails
    };
  };

  const currentPlan = getCurrentPlanDetails();

  const stateOptions = useMemo(() => [
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'NY', label: 'New York' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'IL', label: 'Illinois' },
    { value: 'OH', label: 'Ohio' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'MI', label: 'Michigan' }
  ], []);

  // Optimized input component that doesn't cause re-renders
  const OptimizedInput = React.memo<{
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required?: boolean;
    autoComplete?: string;
    maxLength?: number;
    pattern?: string;
    className?: string;
    formatter?: (value: string) => string;
  }>(({ id, name, type, label, placeholder, required, autoComplete, maxLength, pattern, className, formatter }) => {
    const [localValue, setLocalValue] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Apply formatter if provided
      if (formatter) {
        value = formatter(value);
      }
      
      setLocalValue(value);
      formDataRef.current[name as keyof typeof formDataRef.current] = value;
    };

    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
          {label} {required && '*'}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={localValue}
          onChange={handleChange}
          className={className || "tesla-input block w-full px-4 py-3 rounded-lg text-black placeholder-gray-500"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
        />
      </div>
    );
  });

  // Optimized select component
  const OptimizedSelect = React.memo<{
    id: string;
    name: string;
    label: string;
    required?: boolean;
    autoComplete?: string;
    options: { value: string; label: string }[];
  }>(({ id, name, label, required, autoComplete, options }) => {
    const [localValue, setLocalValue] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setLocalValue(value);
      formDataRef.current[name as keyof typeof formDataRef.current] = value;
    };

    return (
      <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-black mb-2">
          {label} {required && '*'}
        </label>
        <select
          id={id}
          name={name}
          required={required}
          value={localValue}
          onChange={handleChange}
          className="tesla-input w-full px-4 py-3 rounded-lg text-black"
          autoComplete={autoComplete}
        >
          <option value="">Select State</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  });

  // Formatters for special fields
  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 9);
    let formatted = limitedDigits;
    if (limitedDigits.length > 3) {
      formatted = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3);
    }
    if (limitedDigits.length > 5) {
      formatted = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 5) + '-' + limitedDigits.slice(5);
    }
    return formatted;
  };

  const formatIncome = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits === '' ? '' : parseInt(digits, 10).toString();
  };

  const formatZipCode = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 5);
  };

  const LoanApplicationModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-black">Solar Loan Application</h3>
              <p className="text-sm text-gray-600">
                {selectedTerm === '10-year' && '10-Year Re-amortizing Loan at 4.49% APR'}
                {selectedTerm === '15-year' && '15-Year Re-amortizing Loan at 4.49% APR'}
                {selectedTerm === '25-year' && '25-Year Re-amortizing Loan at 4.49% APR'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            type="button"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {applicationStep === 'form' && (
            <div className="p-4 sm:p-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OptimizedInput
                      id="firstName"
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="Enter your first name"
                      required
                      autoComplete="given-name"
                    />
                    <OptimizedInput
                      id="lastName"
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Enter your last name"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OptimizedInput
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="your.email@example.com"
                      required
                      autoComplete="email"
                    />
                    <OptimizedInput
                      id="phone"
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="(555) 123-4567"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Financial Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OptimizedInput
                      id="ssn"
                      name="ssn"
                      type="text"
                      label="Social Security Number"
                      placeholder="XXX-XX-XXXX"
                      required
                      maxLength={11}
                      autoComplete="off"
                      formatter={formatSSN}
                    />
                    <div className="w-full">
                      <label htmlFor="income" className="block text-sm font-medium text-black mb-2">
                        Annual Income *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">$</span>
                        <OptimizedInput
                          id="income"
                          name="income"
                          type="text"
                          label=""
                          placeholder="75000"
                          required
                          className="tesla-input w-full pl-8 pr-4 py-3 rounded-lg text-black placeholder-gray-500"
                          formatter={formatIncome}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Address Information</h4>
                  <div className="space-y-4">
                    <OptimizedInput
                      id="address"
                      name="address"
                      type="text"
                      label="Street Address"
                      placeholder="123 Main Street"
                      required
                      autoComplete="street-address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <OptimizedInput
                        id="city"
                        name="city"
                        type="text"
                        label="City"
                        placeholder="City"
                        required
                        autoComplete="address-level2"
                      />
                      <OptimizedSelect
                        id="state"
                        name="state"
                        label="State"
                        required
                        autoComplete="address-level1"
                        options={stateOptions}
                      />
                      <OptimizedInput
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        label="ZIP Code"
                        placeholder="12345"
                        required
                        maxLength={5}
                        pattern="[0-9]{5}"
                        autoComplete="postal-code"
                        formatter={formatZipCode}
                      />
                    </div>
                  </div>
                </div>

                {/* Disclaimers */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Important Disclaimers:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• This application does not guarantee loan approval</li>
                        <li>• A soft credit check will be performed for pre-qualification</li>
                        <li>• Final loan terms may vary based on creditworthiness</li>
                        <li>• All information provided must be accurate and complete</li>
                        <li>• By submitting, you consent to credit and background checks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="submit"
                    className="bg-black text-white flex-1 py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Submit Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-100 text-black px-6 py-4 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {applicationStep === 'processing' && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-light text-black mb-4">Processing Your Application</h4>
              <p className="text-gray-600 mb-6">We're reviewing your information and checking your credit...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {applicationStep === 'approved' && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-light text-black mb-2">Congratulations! You're Pre-Approved!</h4>
              <p className="text-gray-600 mb-8">You qualify for solar financing up to ${totalPrice.toLocaleString()}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-black">4.49%</div>
                  <div className="text-sm text-gray-600">APR Rate</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-black">${totalPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Approved Amount</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-black">
                    {selectedTerm === '10-year' && '10 Years'}
                    {selectedTerm === '15-year' && '15 Years'}
                    {selectedTerm === '25-year' && '25 Years'}
                  </div>
                  <div className="text-sm text-gray-600">Loan Term</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Pre-Approval Benefits</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• No impact on credit score for pre-qualification</li>
                  <li>• Rate locked for 30 days</li>
                  <li>• No prepayment penalties</li>
                  <li>• Flexible payment options available</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleRequestDocuments}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
                  type="button"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Loan Documents to My Email</span>
                </button>
                <button
                  onClick={handleContinueWithPlan}
                  className="bg-black text-white flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2"
                  type="button"
                >
                  <span>Continue with This Plan</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need the loan documents for your records?
                </p>
                <p className="text-xs text-gray-500">
                  Look out for documents from <span className="font-medium text-black">"Sunlight Financial"</span> in your email inbox
                </p>
              </div>
            </div>
          )}

          {applicationStep === 'documents' && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-light text-black mb-2">Documents Sent Successfully!</h4>
              <p className="text-gray-600 mb-6">Your loan documents have been sent to your email address.</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Email Sent</span>
                </div>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>• Pre-approval letter with loan terms</p>
                  <p>• Next steps and timeline information</p>
                  <p>• Contact information for your loan specialist</p>
                  <p>• Frequently asked questions</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Important Note</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Look out for documents from <span className="font-semibold">"Sunlight Financial"</span> in your email inbox. 
                  Check your spam folder if you don't see them within 10 minutes.
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Continuing with your solar system order...
                </p>
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const FinancingModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col animate-fade-in shadow-2xl">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-black">Choose Your Payment Plan</h3>
              <p className="text-sm text-gray-600">Select the financing option that works best for you</p>
            </div>
          </div>
          <button
            onClick={() => setShowFinancingModal(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-black mb-2">Choose Your Payment Plan</h2>
            <p className="text-gray-600">Find the perfect financing solution for your solar investment</p>
          </div>

          {/* How It Works Section - Always Visible */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900">How Re-amortizing Solar Loans Work</h3>
                <p className="text-sm text-blue-700">Understanding your payment structure</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">1</div>
                <h4 className="font-medium text-blue-900 mb-2">Months 1-16: Lowest Payment</h4>
                <p className="text-sm text-blue-700">
                  You make the lowest possible payment based on a 30-year amortization schedule. 
                  This gives you time to file your taxes and receive your federal tax credit.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">2</div>
                <h4 className="font-medium text-blue-900 mb-2">Month 16: Tax Credit Decision</h4>
                <p className="text-sm text-blue-700">
                  You receive your 30% federal tax credit and decide whether to apply it to your loan 
                  principal or keep it as cash for other purposes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">3</div>
                <h4 className="font-medium text-blue-900 mb-2">Months 17+: Payment Adjusts</h4>
                <p className="text-sm text-blue-700">
                  If you apply the credit, your payment stays low or decreases. 
                  If you choose not to apply the credit, your payment increases to match your chosen loan term.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Industry Standard Structure</p>
                  <p>
                    This re-amortizing structure is the standard for solar financing and is designed to work 
                    with the federal tax credit timeline, giving you maximum flexibility in how to use your tax savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loan Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {loanOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  onClick={() => handlePlanSelect(option.id)}
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all bg-white hover:shadow-lg ${
                    selectedPlan === option.id
                      ? 'border-black shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`absolute -top-3 left-4 ${option.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
                    {option.badge}
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">{option.term}</h3>
                      <p className="text-sm text-gray-600">{option.rate}% APR</p>
                    </div>
                  </div>
                  
                  {/* Re-amortizing Payment Structure */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center mb-3">
                      <div className="text-sm font-medium text-black mb-1">Months 1-16 Payment</div>
                      <div className="text-2xl font-bold text-black">
                        ${option.loanDetails.lowestPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                      </div>
                      <div className="text-xs text-gray-500">Lowest payment period</div>
                    </div>
                    
                    {/* Payment Options After Month 16 */}
                    <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">After tax credit applied</span>
                        <span className="font-medium text-green-600">${option.loanDetails.paymentWithTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">If credit not applied</span>
                        <span className="font-medium text-red-600">${option.loanDetails.paymentWithoutTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <Shield className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-black">
                          {option.warrantyYears} Years
                        </div>
                        <div className="text-sm text-gray-600">Warranty Coverage</div>
                      </div>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="space-y-2 mb-4">
                    {option.perks.map((perk, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="text-xs font-medium text-blue-800 mb-1">RECOMMENDED FOR:</div>
                    <div className="text-sm text-blue-700">{option.recommendation}</div>
                  </div>

                  {/* Pre-Qualify Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(option.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                    type="button"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pre-Qualify Now</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pay in Full Option */}
          <div
            onClick={() => handlePlanSelect('cash')}
            className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all bg-white hover:shadow-lg ${
              selectedPlan === 'cash'
                ? 'border-black shadow-lg transform scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`absolute -top-3 left-4 ${cashOption.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
              {cashOption.badge}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">{cashOption.term}</h3>
                    <p className="text-sm text-gray-600">50% down, 50% at installation</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-black">
                      {cashOption.warrantyYears} Years
                    </div>
                    <div className="text-sm text-gray-600">Warranty Coverage</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {cashOption.perks.map((perk, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-blue-800 mb-1">RECOMMENDED FOR:</div>
                  <div className="text-sm text-blue-700">{cashOption.recommendation}</div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-medium text-black">
                      ${cashOption.downPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-gray-600">Due at signing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-black">
                      ${cashOption.installPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-gray-600">Due at installation</div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect('cash');
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    selectedPlan === 'cash'
                      ? 'bg-black text-white transform scale-[1.02] shadow-lg'
                      : 'bg-gray-100 text-black hover:bg-gray-200 hover:scale-[1.02] hover:shadow-md'
                  }`}
                  type="button"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{selectedPlan === 'cash' ? 'Selected' : 'Select'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Current Payment Display */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-black" />
            <span className="font-medium text-black">{currentPlan.type}</span>
          </div>
          <button 
            onClick={() => setShowFinancingModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Choose Different Plan
          </button>
        </div>
        <div className="text-3xl font-bold text-black">
          {currentPlan.isMonthly ? 
            `$${currentPlan.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo` : 
            `${currentPlan.amount} Years`
          }
        </div>
        <div className="text-sm text-gray-600">{currentPlan.term}</div>
        
        {/* Re-amortizing Loan Structure for Financing Options */}
        {currentPlan.isMonthly && selectedPlan !== 'cash' && currentPlan.loanDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-black mb-3">Re-amortizing Loan Structure</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Months 1-16</span>
                <span className="font-medium text-black">${currentPlan.loanDetails.lowestPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">After tax credit applied</span>
                <span className="font-medium text-green-600">${currentPlan.loanDetails.paymentWithTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">If credit not applied</span>
                <span className="font-medium text-red-600">${currentPlan.loanDetails.paymentWithoutTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Qualify Button - Only show for financing plans */}
        {selectedPlan !== 'cash' && selectedPlan !== '' && (
          <div className="mt-4">
            <button 
              onClick={handlePreQualifyForCurrentPlan}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pre-Qualify for This Plan</span>
            </button>
          </div>
        )}
      </div>

      {/* Financing Modal */}
      {showFinancingModal && <FinancingModal />}

      {/* Loan Application Modal */}
      {showLoanApp && <LoanApplicationModal />}
    </>
  );
};

export default FinancingOptionsIframe;