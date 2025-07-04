import React, { useState } from 'react';
import { X, CheckCircle, Shield } from 'lucide-react';

interface PrequalificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemCost: number;
  monthlyPayment: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  annualIncome: string;
  ssn: string;
  dateOfBirth: string;
}

export const PrequalificationModal: React.FC<PrequalificationModalProps> = ({
  isOpen,
  onClose,
  systemCost,
  monthlyPayment
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'approved'>('form');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    annualIncome: '',
    ssn: '',
    dateOfBirth: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'annualIncome', 'ssn', 'dateOfBirth'];
    const isValid = requiredFields.every(field => formData[field as keyof FormData].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Show processing step
    setStep('processing');
    
    // Simulate processing time and auto-approve
    setTimeout(() => {
      setStep('approved');
    }, 3000);
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Solar Financing Pre-Qualification</h2>
            <p className="text-gray-400 text-sm mt-1">Quick approval • No credit impact</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {step === 'form' && (
            <div>
              {/* System Summary */}
              <div className="bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-blue-300 text-sm">System Cost</p>
                    <p className="text-white font-bold text-lg">${systemCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Monthly Payment</p>
                    <p className="text-white font-bold text-lg">${monthlyPayment}/mo</p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm">Loan Term</p>
                    <p className="text-white font-bold text-lg">25 years @ 4.49%</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center bg-green-900/20 rounded-lg p-3 mb-6 border border-green-500/20">
                <Shield className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-300 text-sm font-medium">Secure & Confidential</p>
                  <p className="text-green-400 text-xs">Your information is encrypted and will not impact your credit score</p>
                </div>
              </div>

              {/* Application Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Social Security Number *
                      </label>
                      <input
                        type="text"
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleInputChange}
                        placeholder="XXX-XX-XXXX"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Financial Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Annual Household Income *
                    </label>
                    <select
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">Select Income Range</option>
                      <option value="under-50k">Under $50,000</option>
                      <option value="50k-75k">$50,000 - $75,000</option>
                      <option value="75k-100k">$75,000 - $100,000</option>
                      <option value="100k-150k">$100,000 - $150,000</option>
                      <option value="150k-200k">$150,000 - $200,000</option>
                      <option value="over-200k">Over $200,000</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                  >
                    Submit Pre-Qualification Application
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    By submitting, you agree to our terms and privacy policy. This will not affect your credit score.
                  </p>
                </div>
              </form>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Your Application</h3>
              <p className="text-gray-400">Please wait while we review your information...</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Verifying personal information
                </div>
                <div className="flex items-center justify-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Checking income requirements
                </div>
                <div className="flex items-center justify-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Finalizing pre-qualification
                </div>
              </div>
            </div>
          )}

          {step === 'approved' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
              <p className="text-xl text-green-400 mb-4">You're Pre-Qualified!</p>
              
              <div className="bg-green-900/20 rounded-xl p-6 mb-6 border border-green-500/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-300 text-sm">Approved Amount</p>
                    <p className="text-white font-bold text-2xl">${systemCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-green-300 text-sm">Monthly Payment</p>
                    <p className="text-white font-bold text-2xl">${monthlyPayment}/mo</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-left bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white">Next Steps:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Schedule your free home energy consultation
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Receive custom system design and proposal
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    Complete final loan application and installation
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue Exploring Options
                </button>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Schedule Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};