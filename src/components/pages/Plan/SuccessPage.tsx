import React, { useEffect, useState } from 'react';
import { CheckCircle, Sun, ArrowRight, Download, Calendar, Phone, Upload, Wrench, Camera, UserCheck, Award, Home, Clock, FileText, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SuccessPageProps {
  onUploadPhotos: () => void;
}

interface OrderData {
  order_id: number;
  checkout_session_id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onUploadPhotos }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .order('order_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching order data:', error);
        } else if (data) {
          setOrderData(data);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="tesla-card rounded-xl p-8 text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="tesla-card rounded-2xl w-full max-w-4xl p-8 animate-fade-in">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Order Complete!</h1>
          <p className="text-lg text-gray-300">Your solar system order has been confirmed and contract signed</p>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-4 flex items-center space-x-2">
              <Sun className="w-5 h-5 text-white" />
              <span>Order Summary</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-300">Order ID</div>
                <div className="font-medium text-white">#{orderData.order_id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Deposit Amount</div>
                <div className="font-medium text-white">
                  {formatCurrency(orderData.amount_total, orderData.currency)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Payment Status</div>
                <div className="font-medium text-white capitalize">
                  {orderData.payment_status}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Order Date</div>
                <div className="font-medium text-white">
                  {formatDate(orderData.order_date)}
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">Order Confirmed & Contract Signed</span>
              </div>
              <p className="text-sm text-gray-300">
                Your $500 deposit has been processed and your installation contract has been signed. 
                Your solar system order is now fully confirmed and ready for the next steps.
              </p>
            </div>
          </div>
        )}

        {/* What Happens Next - Enhanced with Updated Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-6">What happens next?</h2>
          
          {/* Progress Timeline */}
          <div className="space-y-6">
            {/* Step 1: Complete */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">1. Order Confirmed ✓</h3>
                <p className="text-sm text-gray-300 mb-2">Deposit paid and contract signed</p>
                <div className="text-xs text-green-400">Completed</div>
              </div>
            </div>

            {/* Step 2: Next - Upload Photos */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">2. Upload Home Photos</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Share photos of your home and electrical panel/meter for your installer to prepare necessary permits
                </p>
                <div className="text-xs text-blue-400">Next: Within 24 hours</div>
              </div>
            </div>

            {/* Step 3: Permit Application */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">3. Permit Application</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Your installer will handle all permits and communication with your city and utility company
                </p>
                <div className="text-xs text-gray-400">Timeline: 2-4 weeks</div>
              </div>
            </div>

            {/* Step 4: Installation Day */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">4. Installation Day</h3>
                <p className="text-sm text-gray-300 mb-2">Professional installation typically completed in 1-3 days</p>
                <div className="text-xs text-gray-400">Timeline: 4-8 weeks</div>
              </div>
            </div>

            {/* Step 5: Inspection */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">5. Inspection</h3>
                <p className="text-sm text-gray-300 mb-2">City and utility inspections to ensure safety and compliance</p>
                <div className="text-xs text-gray-400">Timeline: 1-2 weeks after installation</div>
              </div>
            </div>

            {/* Step 6: PTO */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">6. PTO (Permission to Operate)</h3>
                <p className="text-sm text-gray-300 mb-2">Final approval from utility company to activate your system</p>
                <div className="text-xs text-gray-400">Timeline: 1-4 weeks after inspection</div>
              </div>
            </div>
          </div>
        </div>

        {/* SunLink Verified Installer Info */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-white" />
            <span className="font-medium text-white">SunLink Verified Installer Program</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300 mb-4">
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

          <p className="text-sm text-gray-300">
            Your installation will be performed by a carefully vetted contractor who meets our strict quality and experience standards.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onUploadPhotos}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Photos</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium">
              <Download className="w-4 h-4" />
              <span>Download Contract</span>
            </button>

            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium">
              <Calendar className="w-4 h-4" />
              <span>Schedule Survey</span>
            </button>

            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium">
              <Phone className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-gray-300 mb-2">
            Questions about your order? We're here to help!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="text-white font-medium">📞 1-800-SOLAR-GO</span>
            <span className="text-gray-400">|</span>
            <span className="text-white font-medium">✉️ support@sunlink.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;