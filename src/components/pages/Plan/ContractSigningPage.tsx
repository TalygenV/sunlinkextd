import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  User,
  Home,
  Calendar,
  ArrowRight,
  X,
  Shield,
  AlertCircle,
  Download,
} from "lucide-react";

interface ContractSigningPageProps {
  onSigningComplete: () => void;
  onBack: () => void;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
  systemDetails: {
    size: string;
    batteryCount: number;
    totalPrice: number;
    selectedPlan: string;
  };
}

const ContractSigningPage: React.FC<ContractSigningPageProps> = ({
  onSigningComplete,
  onBack,
  customerInfo,
  systemDetails,
}) => {
  const [signingStep, setSigningStep] = useState<
    "review" | "signing" | "processing" | "complete"
  >("review");
  const [showDocuSignIframe, setShowDocuSignIframe] = useState(false);

  const handleStartSigning = () => {
    setSigningStep("signing");
    setShowDocuSignIframe(true);
  };

  const handleDocuSignComplete = () => {
    setSigningStep("processing");
    setShowDocuSignIframe(false);

    // Simulate processing time
    setTimeout(() => {
      setSigningStep("complete");
      setTimeout(() => {
        onSigningComplete();
      }, 3000);
    }, 2000);
  };

  const DocuSignIframe: React.FC = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-fade-in shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">
                Home Improvement Contract
              </h3>
              <p className="text-sm text-gray-400">
                SunLink Solar Installation Agreement
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDocuSignIframe(false)}
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* DocuSign Iframe Simulation */}
        <div className="flex-1 overflow-hidden bg-gray-800">
          <div className="h-full flex flex-col">
            <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">Solar Installation Contract</div>
                  <div className="text-sm opacity-80">
                    Please review and sign below
                  </div>
                </div>
              </div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded">
                Step 1 of 3
              </div>
            </div>

            <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center border-b border-gray-700 pb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    HOME IMPROVEMENT CONTRACT
                  </h1>
                  <p className="text-gray-400">
                    Solar Energy System Installation Agreement
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Contract #: SL-{Date.now().toString().slice(-6)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">Contractor</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>SunLink Solar Solutions LLC</div>
                      <div>123 Solar Drive</div>
                      <div>Energy City, CA 90210</div>
                      <div>License #: C-46 123456</div>
                      <div>Phone: (555) 123-SOLAR</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3">Customer</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>{customerInfo.name}</div>
                      <div>{customerInfo.address}</div>
                      <div>{customerInfo.email}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-950 border border-blue-800 rounded-lg p-6">
                  <h3 className="font-medium text-blue-200 mb-4">
                    Solar Energy System Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-300">
                        System Size:
                      </span>
                      <span className="ml-2 text-blue-100">
                        {systemDetails.size} kW
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-300">
                        Battery Storage:
                      </span>
                      <span className="ml-2 text-blue-100">
                        {systemDetails.batteryCount} units
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-300">
                        Total Contract Price:
                      </span>
                      <span className="ml-2 text-blue-100">
                        ${systemDetails.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-300">
                        Financing:
                      </span>
                      <span className="ml-2 text-blue-100">
                        {systemDetails.selectedPlan === "cash"
                          ? "Cash Payment"
                          : "Solar Loan"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Key Contract Terms</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">
                          Installation Timeline:
                        </span>{" "}
                        Work will commence within 30-60 days of permit approval
                        and be completed within 1-3 days of installation start.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Warranty Coverage:</span>{" "}
                        25-year manufacturer warranty on solar panels, 10-year
                        warranty on installation workmanship.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">
                          Permits & Inspections:
                        </span>{" "}
                        Contractor will obtain all necessary permits and
                        coordinate required inspections.
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Right to Cancel:</span>{" "}
                        Customer has 3 business days to cancel this contract
                        without penalty.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="font-medium text-white mb-4">
                    Electronic Signature Required
                  </h3>
                  <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-300">
                        <p className="font-medium mb-1">
                          Please Review Carefully
                        </p>
                        <p>
                          By signing below, you acknowledge that you have read,
                          understood, and agree to all terms and conditions of
                          this contract. This is a legally binding agreement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center bg-blue-950">
                      <div className="text-blue-300 mb-2">
                        <User className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="font-medium text-blue-200 mb-1">
                        Customer Signature
                      </div>
                      <div className="text-sm text-blue-100 mb-4">
                        {customerInfo.name}
                      </div>
                      <button
                        onClick={handleDocuSignComplete}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Click to Sign
                      </button>
                    </div>

                    <div className="border border-gray-600 rounded-lg p-6 text-center bg-gray-800">
                      <div className="text-gray-400 mb-2">
                        <User className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="font-medium text-gray-300 mb-1">
                        Contractor Signature
                      </div>
                      <div className="text-sm text-gray-400 mb-4">
                        SunLink Solar Solutions
                      </div>
                      <div className="text-xs text-gray-500">
                        Will be signed after customer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (signingStep === "processing") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-2xl p-8 text-center animate-fade-in shadow-xl">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-white mb-4">
            Processing Your Contract
          </h2>
          <p className="text-gray-400 mb-6">
            Finalizing your solar installation agreement...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (signingStep === "complete") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-2xl p-8 text-center animate-fade-in shadow-xl">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-white mb-4">
            Contract Signed Successfully!
          </h2>
          <p className="text-gray-400 mb-6">
            Your solar installation agreement has been completed and processed.
          </p>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to order confirmation...
            </p>
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="tesla-card rounded-2xl w-full max-w-4xl mt-8 p-8 animate-fade-in bg-gray-900 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">
            Installation Contract
          </h1>
          <p className="text-gray-400">
            Review and sign your home improvement agreement
          </p>
        </div>

        {/* Contract Overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">
            Contract Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Customer</div>
                <div className="font-medium text-white">
                  {customerInfo.name}
                </div>
                <div className="text-sm text-gray-500">
                  {customerInfo.email}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">
                  Installation Address
                </div>
                <div className="font-medium text-white">
                  {customerInfo.address}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">System Details</div>
                <div className="font-medium text-white">
                  {systemDetails.size} kW Solar System
                </div>
                <div className="text-sm text-gray-500">
                  {systemDetails.batteryCount} Battery Units
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Contract Value</div>
                <div className="font-medium text-white">
                  ${systemDetails.totalPrice.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {systemDetails.selectedPlan === "cash"
                    ? "Cash Payment"
                    : "Solar Financing"}
                </div>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
            <h3 className="font-medium text-white mb-3">Key Contract Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">
                  25-year equipment warranty
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">
                  10-year installation warranty
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">All permits included</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">3-day right to cancel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-300 mb-2">
                Important Information
              </h3>
              <div className="text-sm text-yellow-200 space-y-2">
                <p>• This is a legally binding home improvement contract</p>
                <p>• You have 3 business days to cancel without penalty</p>
                <p>
                  • All work will be performed by licensed, insured contractors
                </p>
                <p>• Installation timeline: 30–60 days from permit approval</p>
                <p>• Final payment due upon system activation and inspection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleStartSigning}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex-1 py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
          >
            <FileText className="w-6 h-6" />
            <span>Review & Sign Contract</span>
          </button>

          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white flex-1 py-4 px-8 rounded-xl font-medium flex items-center justify-center space-x-2"
          >
            <span>Back to Payment</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>
              Secured by DocuSign • Legally binding electronic signature
            </span>
          </div>
        </div>
      </div>

      {/* DocuSign Iframe Modal */}
      {showDocuSignIframe && <DocuSignIframe />}
    </div>
  );
};

export default ContractSigningPage;
