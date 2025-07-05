import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Sun,
  ArrowRight,
  Download,
  Calendar,
  Phone,
  Upload,
  Wrench,
  Camera,
  UserCheck,
  Award,
  Home,
  Clock,
  FileText,
  Shield,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

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
          .from("stripe_user_orders")
          .select("*")
          .order("order_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching order data:", error);
        } else if (data) {
          setOrderData(data);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-8 text-center animate-fade-in shadow-lg">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-4xl p-8 animate-fade-in shadow-xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">
            Order Complete!
          </h1>
          <p className="text-lg text-gray-400">
            Your solar system order has been confirmed and contract signed
          </p>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-4 flex items-center space-x-2">
              <Sun className="w-5 h-5 text-white" />
              <span>Order Summary</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400">Order ID</div>
                <div className="font-medium text-white">
                  #{orderData.order_id}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Deposit Amount</div>
                <div className="font-medium text-white">
                  {formatCurrency(orderData.amount_total, orderData.currency)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Payment Status</div>
                <div className="font-medium text-white capitalize">
                  {orderData.payment_status}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Order Date</div>
                <div className="font-medium text-white">
                  {formatDate(orderData.order_date)}
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">
                  Order Confirmed & Contract Signed
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Your $500 deposit has been processed and your installation
                contract has been signed. Your solar system order is now fully
                confirmed and ready for the next steps.
              </p>
            </div>
          </div>
        )}

        {/* Next Steps Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-white mb-6">
            What happens next?
          </h2>
          <div className="space-y-6">
            {/* Steps 1 to 6 */}
            {[...Array(6)].map((_, idx) => {
              const steps = [
                {
                  icon: <CheckCircle className="w-6 h-6 text-white" />,
                  bg: "bg-green-600",
                  title: "1. Order Confirmed ✓",
                  text: "Deposit paid and contract signed",
                  status: "Completed",
                  statusColor: "text-green-400",
                },
                {
                  icon: <Camera className="w-6 h-6 text-white" />,
                  bg: "bg-blue-600",
                  title: "2. Upload Home Photos",
                  text: "Share photos of your home and electrical panel/meter for your installer to prepare necessary permits",
                  status: "Next: Within 24 hours",
                  statusColor: "text-blue-400",
                },
                {
                  icon: <FileText className="w-6 h-6 text-white" />,
                  bg: "bg-gray-600",
                  title: "3. Permit Application",
                  text: "Your installer will handle all permits and communication with your city and utility company",
                  status: "Timeline: 2-4 weeks",
                  statusColor: "text-gray-400",
                },
                {
                  icon: <Wrench className="w-6 h-6 text-white" />,
                  bg: "bg-gray-700",
                  title: "4. Installation Day",
                  text: "Professional installation typically completed in 1-3 days",
                  status: "Timeline: 4-8 weeks",
                  statusColor: "text-gray-400",
                },
                {
                  icon: <Shield className="w-6 h-6 text-white" />,
                  bg: "bg-gray-800",
                  title: "5. Inspection",
                  text: "City and utility inspections to ensure safety and compliance",
                  status: "Timeline: 1-2 weeks after installation",
                  statusColor: "text-gray-400",
                },
                {
                  icon: <Sun className="w-6 h-6 text-white" />,
                  bg: "bg-gray-900",
                  title: "6. PTO (Permission to Operate)",
                  text: "Final approval from utility company to activate your system",
                  status: "Timeline: 1-4 weeks after inspection",
                  statusColor: "text-gray-400",
                },
              ];

              const step = steps[idx];

              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 ${step.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{step.text}</p>
                    <div className={`text-xs ${step.statusColor}`}>
                      {step.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Installer Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-white" />
            <span className="font-medium text-white">
              SunLink Verified Installer Program
            </span>
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
          <p className="text-sm text-gray-400">
            Your installation will be performed by a carefully vetted contractor
            who meets our strict quality and experience standards.
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
            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-white bg-white/10 hover:bg-white/20">
              <Download className="w-4 h-4" />
              <span>Download Contract</span>
            </button>
            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-white bg-white/10 hover:bg-white/20">
              <Calendar className="w-4 h-4" />
              <span>Schedule Survey</span>
            </button>
            <button className="tesla-button-secondary flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-white bg-white/10 hover:bg-white/20">
              <Phone className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 mb-2">
            Questions about your order? We're here to help!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="text-white font-medium">📞 1-800-SOLAR-GO</span>
            <span className="text-gray-500">|</span>
            <span className="text-white font-medium">
              ✉️ support@sunlink.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
