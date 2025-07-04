import React, { useState, useCallback, useMemo, useRef } from 'react';
import { CreditCard, DollarSign, TrendingUp, CheckCircle, X, ExternalLink, Clock, AlertCircle, Shield, Battery, ToggleLeft, ToggleRight, Calculator, Info } from 'lucide-react';

interface FinancingOptionsProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  totalPrice: number;
  solarOnlyPrice: number;
  batteryTotalPrice: number;
  batteryCount: number;
}

const FinancingOptions: React.FC<FinancingOptionsProps> = ({
  selectedPlan,
  onPlanChange,
  totalPrice,
  solarOnlyPrice,
  batteryTotalPrice,
  batteryCount
}) => {
  const [showLoanApp, setShowLoanApp] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [applicationStep, setApplicationStep] = useState<'form' | 'processing' | 'approved'>('form');
  const [showTaxCreditDetails, setShowTaxCreditDetails] = useState(false);
  const [formData, setFormData] = useState({
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
    
    // Initial 16-month payment (based on full term)
    const initialPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    // Principal balance after 16 months
    let balance = principal;
    for (let i = 0; i < 16; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = initialPayment - interestPayment;
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
    
    // Scenario 2: Customer keeps tax credit
    const paymentWithoutTaxCredit = (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                                   (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    
    return {
      initialPayment,
      balanceAt16Months: balance,
      taxCredit,
      paymentWithTaxCredit: Math.max(0, paymentWithTaxCredit),
      paymentWithoutTaxCredit,
      totalInterestWithCredit: (initialPayment * 16) + (paymentWithTaxCredit * remainingMonths) - principal + taxCredit,
      totalInterestWithoutCredit: (initialPayment * 16) + (paymentWithoutTaxCredit * remainingMonths) - principal
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

  const handlePreQualify = useCallback((termId: string) => {
    if (termId === 'cash') {
      onPlanChange(termId);
      return;
    }
    
    setSelectedTerm(termId);
    setShowLoanApp(true);
    setApplicationStep('form');
    setFormData({
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
  }, [onPlanChange]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      if (prev[field as keyof typeof prev] === value) {
        return prev;
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setApplicationStep('processing');
    
    setTimeout(() => {
      setApplicationStep('approved');
    }, 2000);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLoanApp(false);
    setApplicationStep('form');
    setSelectedTerm('');
  }, []);

  const handleContinueWithPlan = useCallback(() => {
    onPlanChange(selectedTerm);
    setShowLoanApp(false);
    setApplicationStep('form');
  }, [selectedTerm, onPlanChange]);

  // Re-amortizing loan details component
  const LoanDetailsCard: React.FC<{ option: typeof loanOptions[0]; showDetails: boolean }> = ({ option, showDetails }) => (
    <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-white">Payment Structure</div>
        <button
          onClick={() => setShowTaxCreditDetails(!showTaxCreditDetails)}
          className="text-xs text-gray-300 hover:text-white flex items-center space-x-1"
        >
          <Info className="w-3 h-3" />
          <span>How it works</span>
        </button>
      </div>
      
      {/* Initial Payment Period */}
      <div className="space-y-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Months 1-16</span>
            <span className="text-lg font-bold text-white">
              ${option.loanDetails.initialPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
            </span>
          </div>
          <div className="text-xs text-gray-400">Initial payment period</div>
        </div>
        
        {/* Tax Credit Decision Point */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm font-medium text-yellow-800 mb-2">Month 16: Tax Credit Decision</div>
          <div className="text-xs text-yellow-700">
            Apply your ${option.loanDetails.taxCredit.toLocaleString()} tax credit to reduce your loan balance
          </div>
        </div>
        
        {/* Payment Options After Month 16 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Apply Tax Credit</span>
            </div>
            <div className="text-lg font-bold text-green-800">
              ${option.loanDetails.paymentWithTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
            </div>
            <div className="text-xs text-green-600">Months 17-{option.years * 12}</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <X className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Keep Tax Credit</span>
            </div>
            <div className="text-lg font-bold text-red-800">
              ${option.loanDetails.paymentWithoutTaxCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
            </div>
            <div className="text-xs text-red-600">Months 17-{option.years * 12}</div>
          </div>
        </div>
      </div>
      
      {/* Total Interest Comparison */}
      <div className="border-t border-white/20 pt-3">
        <div className="text-sm font-medium text-white mb-2">Total Interest Paid</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="text-green-400 font-medium">
              ${option.loanDetails.totalInterestWithCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-gray-400">With tax credit applied</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-medium">
              ${option.loanDetails.totalInterestWithoutCredit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-gray-400">Without tax credit applied</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tax Credit Information Modal
  const TaxCreditInfoModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="tesla-card-light rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-black">Re-amortizing Solar Loan</h3>
              <p className="text-sm text-gray-600">How traditional solar financing works</p>
            </div>
          </div>
          <button
            onClick={() => setShowTaxCreditDetails(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-black mb-3">How Re-amortizing Loans Work</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-3 text-sm text-blue-800">
                  <p><strong>Months 1-16:</strong> You make payments based on the full loan amount and term.</p>
                  <p><strong>Month 16:</strong> You receive your federal tax credit (30% of system cost).</p>
                  <p><strong>Decision Point:</strong> Apply the tax credit to your loan or keep it as cash.</p>
                  <p><strong>Months 17+:</strong> Your payment adjusts based on your decision.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-black mb-3">Tax Credit Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Apply to Loan</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Lower monthly payments</li>
                    <li>• Less total interest paid</li>
                    <li>• Faster loan payoff</li>
                    <li>• Payment stays the same or decreases</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Keep as Cash</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Higher monthly payments</li>
                    <li>• More total interest paid</li>
                    <li>• Cash available for other uses</li>
                    <li>• Payment increases significantly</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-black mb-3">Industry Standard</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  This re-amortizing structure is used by all major solar lenders including Mosaic, 
                  Sunlight Financial, GoodLeap, and others. It's designed to work with the federal 
                  tax credit timeline and gives you flexibility in how to use your tax savings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // SSN Input component
  const SSNInput = React.memo(() => {
    const [localSSN, setLocalSSN] = useState(formData.ssn);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const digits = value.replace(/\D/g, '');
      const limitedDigits = digits.slice(0, 9);
      
      let formatted = limitedDigits;
      if (limitedDigits.length > 3) {
        formatted = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3);
      }
      if (limitedDigits.length > 5) {
        formatted = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 5) + '-' + limitedDigits.slice(5);
      }
      
      setLocalSSN(formatted);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setFormData(prev => ({ ...prev, ssn: formatted }));
      }, 100);
    };

    return (
      <div>
        <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-2">
          Social Security Number *
        </label>
        <input
          id="ssn"
          name="ssn"
          type="text"
          required
          value={localSSN}
          onChange={handleSSNChange}
          className="tesla-input w-full px-4 py-3 rounded-lg"
          placeholder="XXX-XX-XXXX"
          maxLength={11}
          autoComplete="off"
        />
      </div>
    );
  });

  // Income Input component
  const IncomeInput = React.memo(() => {
    const [localIncome, setLocalIncome] = useState(formData.income);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const digits = value.replace(/\D/g, '');
      const numericValue = digits === '' ? '' : parseInt(digits, 10).toString();
      
      setLocalIncome(numericValue);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setFormData(prev => ({ ...prev, income: numericValue }));
      }, 100);
    };

    return (
      <div>
        <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
          Annual Income *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            id="income"
            name="income"
            type="text"
            required
            value={localIncome}
            onChange={handleIncomeChange}
            className="tesla-input w-full pl-8 pr-4 py-3 rounded-lg"
            placeholder="75000"
          />
        </div>
      </div>
    );
  });

  // Form Input component
  const FormInput = React.memo<{
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    autoComplete?: string;
    maxLength?: number;
    pattern?: string;
  }>(({ id, name, type, label, placeholder, value, onChange, required, autoComplete, maxLength, pattern }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tesla-input w-full px-4 py-3 rounded-lg"
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
      />
    </div>
  ));

  // Form Select component
  const FormSelect = React.memo<{
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    autoComplete?: string;
    options: { value: string; label: string }[];
  }>(({ id, name, label, value, onChange, required, autoComplete, options }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tesla-input w-full px-4 py-3 rounded-lg"
        autoComplete={autoComplete}
      >
        <option value="">Select State</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  ));

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

  const LoanApplicationModal: React.FC = React.memo(() => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="tesla-card-light rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {applicationStep === 'form' && (
            <div className="p-4 sm:p-6">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="firstName"
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      required
                      autoComplete="given-name"
                    />
                    <FormInput
                      id="lastName"
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      required
                      autoComplete="email"
                    />
                    <FormInput
                      id="phone"
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Financial Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SSNInput />
                    <IncomeInput />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-medium text-black mb-4">Address Information</h4>
                  <div className="space-y-4">
                    <FormInput
                      id="address"
                      name="address"
                      type="text"
                      label="Street Address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(value) => handleInputChange('address', value)}
                      required
                      autoComplete="street-address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormInput
                        id="city"
                        name="city"
                        type="text"
                        label="City"
                        placeholder="City"
                        value={formData.city}
                        onChange={(value) => handleInputChange('city', value)}
                        required
                        autoComplete="address-level2"
                      />
                      <FormSelect
                        id="state"
                        name="state"
                        label="State"
                        value={formData.state}
                        onChange={(value) => handleInputChange('state', value)}
                        required
                        autoComplete="address-level1"
                        options={stateOptions}
                      />
                      <FormInput
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        label="ZIP Code"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={(value) => handleInputChange('zipCode', value)}
                        required
                        maxLength={5}
                        pattern="[0-9]{5}"
                        autoComplete="postal-code"
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
                    className="tesla-button-primary flex-1 py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Submit Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="tesla-button-secondary px-6 py-4 rounded-xl font-medium"
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
                  onClick={handleContinueWithPlan}
                  className="tesla-button-primary flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2"
                  type="button"
                >
                  <span>Continue with This Plan</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="tesla-button-secondary px-6 py-3 rounded-xl font-medium"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <div className="tesla-card rounded-2xl p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-light text-white">Choose Your Payment Plan</h2>
          <p className="text-sm text-gray-300 mt-2">Re-amortizing loans with tax credit flexibility</p>
        </div>
        
        {/* Loan Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {loanOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => onPlanChange(option.id)}
                className={`tesla-hover relative p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all bg-white/10 ${
                  selectedPlan === option.id
                    ? 'border-white shadow-lg'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`absolute -top-3 left-4 ${option.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
                  {option.badge}
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{option.term}</h3>
                    <p className="text-sm text-gray-300">{option.rate}% APR</p>
                  </div>
                </div>
                
                {/* Re-amortizing Loan Details */}
                <LoanDetailsCard option={option} showDetails={selectedPlan === option.id} />
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center border border-white/30">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {option.warrantyYears} Years
                      </div>
                      <div className="text-sm text-gray-300">Warranty Coverage</div>
                    </div>
                  </div>
                </div>

                {/* Perks */}
                <div className="space-y-2 mb-4">
                  {option.perks.map((perk, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="bg-white/10 rounded-lg p-3 mb-4 border border-white/20">
                  <div className="text-xs font-medium text-white mb-1">RECOMMENDED FOR:</div>
                  <div className="text-sm text-gray-300">{option.recommendation}</div>
                </div>

                {/* Pre-Qualify Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreQualify(option.id);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
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
          onClick={() => onPlanChange('cash')}
          className={`tesla-hover relative p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all bg-white/10 ${
            selectedPlan === 'cash'
              ? 'border-white shadow-lg'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <div className={`absolute -top-3 left-4 ${cashOption.badgeColor} px-3 py-1 rounded-full text-xs font-medium`}>
            {cashOption.badge}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{cashOption.term}</h3>
                  <p className="text-sm text-gray-300">50% down, 50% at installation</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center border border-white/30">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {cashOption.warrantyYears} Years
                  </div>
                  <div className="text-sm text-gray-300">Warranty Coverage</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {cashOption.perks.map((perk, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{perk}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="text-xs font-medium text-white mb-1">RECOMMENDED FOR:</div>
                <div className="text-sm text-gray-300">{cashOption.recommendation}</div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-medium text-white">
                    ${cashOption.downPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-300">Due at signing</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-white">
                    ${cashOption.installPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-300">Due at installation</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreQualify('cash');
                }}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  selectedPlan === 'cash'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white transform scale-[1.02] shadow-lg'
                    : 'bg-gradient-to-r from-white/20 to-white/30 text-white hover:from-white/30 hover:to-white/40 hover:scale-[1.02] hover:shadow-md'
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

      {/* Loan Application Modal */}
      {showLoanApp && <LoanApplicationModal />}

      {/* Tax Credit Information Modal */}
      {showTaxCreditDetails && <TaxCreditInfoModal />}
    </>
  );
};

export default FinancingOptions;