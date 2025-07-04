import React, { useState } from 'react';
import { X, Phone, Mail, User, MessageSquare, CheckCircle, Send } from 'lucide-react';

interface ExpertContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpertContactModal: React.FC<ExpertContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      preferredTime: ''
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="tesla-card rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">Speak with a Solar Expert</h3>
              <p className="text-sm text-gray-500">Get personalized guidance for your solar journey</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {!isSubmitted ? (
            <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">How can we help you?</h4>
                <p className="text-gray-600">
                  Our solar experts are here to answer your questions about system design, financing options, 
                  installation timeline, and more. Fill out the form below and we'll be in contact shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h5 className="text-md font-medium text-gray-900 mb-4">Contact Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="tesla-input block w-full pl-10 pr-3 py-3 rounded-lg"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="tesla-input block w-full px-3 py-3 rounded-lg"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="tesla-input block w-full pl-10 pr-3 py-3 rounded-lg"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="tesla-input block w-full pl-10 pr-3 py-3 rounded-lg"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Time */}
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="tesla-input block w-full px-3 py-3 rounded-lg"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Questions or Comments
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="tesla-input block w-full pl-10 pr-3 py-3 rounded-lg resize-none"
                      placeholder="Tell us about your specific needs, questions about financing, installation timeline, or anything else we can help with..."
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h6 className="font-medium text-black mb-2">What to expect:</h6>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Expert consultation within 24 hours</li>
                    <li>• Personalized system recommendations</li>
                    <li>• Detailed financing options review</li>
                    <li>• Installation timeline and process overview</li>
                    <li>• No pressure, just helpful guidance</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="tesla-button-primary flex-1 py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Request Expert Consultation</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="tesla-button-secondary px-6 py-4 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Success State
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-light text-gray-900 mb-4">Thank You!</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We've received your request and one of our solar experts will be in contact with you shortly. 
                Expect to hear from us within 24 hours.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-8 max-w-md mx-auto border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-5 h-5 text-black" />
                  <span className="font-medium text-black">Next Steps</span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• Review your system configuration</p>
                  <p>• Discuss financing options in detail</p>
                  <p>• Schedule site assessment if needed</p>
                  <p>• Answer all your questions</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="tesla-button-primary py-3 px-8 rounded-xl font-medium"
              >
                Continue
              </button>

              <div className="mt-6 text-sm text-gray-500">
                <p>Need immediate assistance?</p>
                <p className="font-medium text-black">Call us at 1-800-SOLAR-GO</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertContactModal;