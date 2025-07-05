import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Home,
  MessageSquare,
  FileText,
  Bell,
  Users,
  Settings,
  Sun,
  Battery,
  Zap,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Send,
  Gift,
  Share2,
  Copy,
  ExternalLink,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  Award,
  Shield,
  TrendingUp,
  DollarSign,
  Leaf,
} from "lucide-react";

interface CustomerPortalProps {
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
  systemDetails: {
    size: number;
    batteryCount: number;
    batteryType: string;
    totalPrice: number;
    selectedPlan: string;
  };
  onBackToMain: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({
  customerInfo,
  systemDetails,
  onBackToMain,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Mike Johnson - SunLink Installer",
      message:
        "Hi! I've been assigned as your installer. I've reviewed your photos and everything looks great. We should have permits approved within 2-3 weeks.",
      timestamp: "2024-01-20 10:30 AM",
      isFromInstaller: true,
      avatar: "MJ",
    },
    {
      id: 2,
      sender: "You",
      message:
        "Great to meet you Mike! Do you need any additional information from me?",
      timestamp: "2024-01-20 11:15 AM",
      isFromInstaller: false,
      avatar: customerInfo.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    },
    {
      id: 3,
      sender: "Mike Johnson - SunLink Installer",
      message:
        "Everything looks good! I'll keep you updated on permit status. Feel free to reach out if you have any questions.",
      timestamp: "2024-01-20 2:45 PM",
      isFromInstaller: true,
      avatar: "MJ",
    },
  ]);
  const [referralCode] = useState(
    "SUNLINK-" + Math.random().toString(36).substr(2, 6).toUpperCase()
  );

  // Refs for managing focus and scroll
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendTimeoutRef = useRef<NodeJS.Timeout>();

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "referrals", label: "Refer Friends", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const installationSteps = [
    {
      id: "site-survey",
      title: "Site Survey Approval",
      description: "Photos reviewed and site approved for installation",
      status: "completed",
      date: "2024-01-15",
      progress: 100,
    },
    {
      id: "permits",
      title: "Permit Application",
      description: "Submitting permits to local authority",
      status: "in-progress",
      date: "2024-01-20",
      progress: 75,
    },
    {
      id: "installer",
      title: "Installer Assignment",
      description: "Matching with certified SunLink installer",
      status: "pending",
      date: "TBD",
      progress: 0,
    },
    {
      id: "installation",
      title: "Installation Day",
      description: "Professional installation (1-3 days)",
      status: "pending",
      date: "TBD",
      progress: 0,
    },
    {
      id: "inspection",
      title: "Inspection",
      description: "City and utility inspections",
      status: "pending",
      date: "TBD",
      progress: 0,
    },
    {
      id: "pto",
      title: "PTO (Permission to Operate)",
      description: "Final approval to activate system",
      status: "pending",
      date: "TBD",
      progress: 0,
    },
  ];

  const documents = [
    {
      id: 1,
      name: "Solar Installation Contract",
      type: "Contract",
      date: "2024-01-15",
      size: "2.4 MB",
      status: "Signed",
    },
    {
      id: 2,
      name: "System Design Layout",
      type: "Design",
      date: "2024-01-18",
      size: "1.8 MB",
      status: "Final",
    },
    {
      id: 3,
      name: "Permit Application",
      type: "Permit",
      date: "2024-01-20",
      size: "3.2 MB",
      status: "Submitted",
    },
    {
      id: 4,
      name: "Equipment Specifications",
      type: "Specs",
      date: "2024-01-15",
      size: "1.1 MB",
      status: "Final",
    },
    {
      id: 5,
      name: "Warranty Information",
      type: "Warranty",
      date: "2024-01-15",
      size: "890 KB",
      status: "Active",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "Permit Application Submitted",
      message:
        "Your solar permit application has been submitted to the city. Expected approval in 2-4 weeks.",
      type: "info",
      date: "2024-01-20",
      read: false,
    },
    {
      id: 2,
      title: "Installer Assigned",
      message:
        "Mike Johnson has been assigned as your certified installer. He will contact you soon.",
      type: "success",
      date: "2024-01-19",
      read: true,
    },
    {
      id: 3,
      title: "Photos Approved",
      message:
        "Your home photos have been reviewed and approved. Moving to permit phase.",
      type: "success",
      date: "2024-01-18",
      read: true,
    },
    {
      id: 4,
      title: "Welcome to SunLink",
      message:
        "Thank you for choosing SunLink Solar! Your journey to clean energy begins now.",
      type: "info",
      date: "2024-01-15",
      read: true,
    },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Optimized message input handler
  const handleMessageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewMessage(value);

      // Clear any existing timeout
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }

      // Set typing indicator
      if (!isTyping && value.length > 0) {
        setIsTyping(true);
      }

      // Clear typing indicator after user stops typing
      sendTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    },
    [isTyping]
  );

  // Optimized send message handler
  const handleSendMessage = useCallback(() => {
    const messageText = newMessage.trim();
    if (!messageText) return;

    const userAvatar = customerInfo.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const timestamp = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newMsg = {
      id: Date.now(), // Use timestamp for unique ID
      sender: "You",
      message: messageText,
      timestamp,
      isFromInstaller: false,
      avatar: userAvatar,
    };

    // Add message immediately
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    // Clear input immediately
    setNewMessage("");
    setIsTyping(false);

    // Clear any pending timeouts
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
    }

    // Focus back to input
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    // Simulate installer response after 2 seconds
    setTimeout(() => {
      const installerResponse = {
        id: Date.now() + 1,
        sender: "Mike Johnson - SunLink Installer",
        message:
          "Thanks for your message! I'll get back to you with more details soon.",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        isFromInstaller: true,
        avatar: "MJ",
      };
      setMessages((prevMessages) => [...prevMessages, installerResponse]);
    }, 2000);
  }, [newMessage, customerInfo.name]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    // Show toast notification in real app
  };

  const shareReferralLink = () => {
    const referralLink = `https://sunlink.com/ref/${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    // Show toast notification in real app
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-gotham-light mb-2">
              Welcome Back, {customerInfo.name.split(" ")[0]}!
            </h2>
            <p className="text-blue-100">
              Your solar installation is in progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">System Size</div>
            <div className="text-3xl font-gotham-bold">
              {systemDetails.size} kW
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
              <Sun className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-300">Solar Panels</div>
              <div className="text-xl font-gotham-bold text-white">
                26 Panels
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {systemDetails.size} kW System
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <Battery className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-300">Battery Storage</div>
              <div className="text-xl font-gotham-bold text-white">
                {systemDetails.batteryCount} Units
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {systemDetails.batteryType}
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-300">Annual Output</div>
              <div className="text-xl font-gotham-bold text-white">
                14,300 kWh
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Estimated production</div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-300">Install Date</div>
              <div className="text-xl font-gotham-bold text-white">TBD</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Pending permits</div>
        </div>
      </div>

      {/* Mapbox Solar Layout */}
      <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-300" />
            <h3 className="text-lg font-gotham-medium text-white">
              Confirmed Solar Layout
            </h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Your custom solar panel design and placement
          </p>
        </div>
        <div className="h-96 bg-gray-800 relative">
          <iframe
            src="about:blank"
            className="w-full h-full border-0"
            title="Solar Layout Design"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 font-gotham-medium">
                Interactive Solar Layout
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Mapbox integration will display your confirmed solar design
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Progress */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">
          Installation Progress
        </h3>

        <div className="space-y-6">
          {installationSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : step.status === "in-progress" ? (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-gotham-medium text-white">
                    {step.title}
                  </h4>
                  <span className="text-sm text-gray-400">{step.date}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{step.description}</p>

                {step.status === "in-progress" && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Preview */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">
          Your Solar Investment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-green-500/30">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-gotham-bold text-white">$89,000</div>
            <div className="text-sm text-gray-400">30-Year Savings</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-gotham-bold text-white">285%</div>
            <div className="text-sm text-gray-400">Return on Investment</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
              <Leaf className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-gotham-bold text-white">25 tons</div>
            <div className="text-sm text-gray-400">CO₂ Avoided (30 years)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const MessagesTab = () => (
    <div className="bg-white/10 border border-white/20 rounded-xl h-[600px] flex flex-col">
      {/* Messages Header */}
      <div className="p-6 border-b border-white/20 flex-shrink-0">
        <h3 className="text-lg font-gotham-medium text-white">Messages</h3>
        <p className="text-sm text-gray-400">
          Chat with your installer and support team
        </p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isFromInstaller ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.isFromInstaller
                  ? ""
                  : "flex-row-reverse space-x-reverse"
              }`}
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-gotham-medium text-white flex-shrink-0">
                {message.avatar}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.isFromInstaller
                    ? "bg-white/10 border border-white/20"
                    : "bg-blue-600 text-white"
                }`}
              >
                <div
                  className={`text-sm font-gotham-medium mb-1 ${
                    message.isFromInstaller ? "text-white" : "text-white"
                  }`}
                >
                  {message.isFromInstaller ? message.sender : "You"}
                </div>
                <div
                  className={`text-sm ${
                    message.isFromInstaller ? "text-gray-300" : "text-white"
                  }`}
                >
                  {message.message}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.isFromInstaller ? "text-gray-500" : "text-blue-100"
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-gotham-medium text-white">
                {customerInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                <div className="text-sm text-gray-400 italic">Typing...</div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/20 flex-shrink-0">
        <div className="flex space-x-3">
          <input
            ref={messageInputRef}
            type="text"
            value={newMessage}
            onChange={handleMessageInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            autoComplete="off"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="bg-white/10 border border-white/20 rounded-xl">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-lg font-gotham-medium text-white">Documents</h3>
        <p className="text-sm text-gray-400">
          All your solar installation documents in one place
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-gotham-medium text-white">{doc.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{doc.type}</span>
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-gotham-medium ${
                    doc.status === "Signed" ||
                    doc.status === "Final" ||
                    doc.status === "Active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {doc.status}
                </span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="bg-white/10 border border-white/20 rounded-xl">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-lg font-gotham-medium text-white">Notifications</h3>
        <p className="text-sm text-gray-400">
          Stay updated on your solar installation progress
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.read
                  ? "border-white/20 bg-white/5"
                  : "border-blue-500/30 bg-blue-500/10"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-green-500/20 border border-green-500/30"
                      : notification.type === "warning"
                      ? "bg-yellow-500/20 border border-yellow-500/30"
                      : "bg-blue-500/20 border border-blue-500/30"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : notification.type === "warning" ? (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Bell className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-gotham-medium text-white">
                      {notification.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {notification.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReferralsTab = () => (
    <div className="space-y-6">
      {/* Referral Program Overview */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="w-8 h-8" />
          <h2 className="text-2xl font-gotham-light">
            Refer Friends & Earn Rewards
          </h2>
        </div>
        <p className="text-green-100 mb-6">
          Share the benefits of solar with friends and family. You both save
          money when they go solar with SunLink!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-gotham-bold mb-1">$500</div>
            <div className="text-sm text-green-100">You Earn</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-gotham-bold mb-1">$500</div>
            <div className="text-sm text-green-100">Friend Saves</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-gotham-bold mb-1">Unlimited</div>
            <div className="text-sm text-green-100">Referrals</div>
          </div>
        </div>
      </div>

      {/* Your Referral Code */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-4">
          Your Referral Code
        </h3>

        <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-gotham-bold text-white mb-1">
                {referralCode}
              </div>
              <div className="text-sm text-gray-400">
                Share this code with friends
              </div>
            </div>
            <button
              onClick={copyReferralCode}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={shareReferralLink}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Referral Link</span>
          </button>

          <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>View Terms</span>
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Share2 className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-gotham-medium text-white mb-2">
              1. Share Your Code
            </h4>
            <p className="text-sm text-gray-400">
              Send your referral code to friends interested in solar
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <Sun className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="font-gotham-medium text-white mb-2">
              2. Friend Goes Solar
            </h4>
            <p className="text-sm text-gray-400">
              They use your code and complete their solar installation
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="font-gotham-medium text-white mb-2">
              3. Both Earn Rewards
            </h4>
            <p className="text-sm text-gray-400">
              You get $500, they save $500 on their installation
            </p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-4">
          Referral History
        </h3>

        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No referrals yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start sharing your code to see your referrals here
          </p>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">
          Profile Settings
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-gotham-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={customerInfo.name}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-gotham-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={customerInfo.email}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-gotham-medium text-gray-300 mb-2">
              Installation Address
            </label>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={customerInfo.address}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-gotham-medium text-white">
                Email Notifications
              </div>
              <div className="text-sm text-gray-400">
                Receive updates about your installation
              </div>
            </div>
            <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-gotham-medium text-white">SMS Updates</div>
              <div className="text-sm text-gray-400">
                Get text messages for important updates
              </div>
            </div>
            <button className="bg-gray-600 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-gotham-medium text-white">
                Marketing Communications
              </div>
              <div className="text-sm text-gray-400">
                Receive solar tips and company updates
              </div>
            </div>
            <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-gotham-medium text-white mb-6">Support</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-gotham-medium text-white">Call Support</div>
              <div className="text-sm text-gray-400">1-800-SOLAR-GO</div>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-gotham-medium text-white">Email Support</div>
              <div className="text-sm text-gray-400">support@sunlink.com</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "messages":
        return <MessagesTab />;
      case "documents":
        return <DocumentsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "referrals":
        return <ReferralsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 text-white">
      {/* Header */}
      {/* <div className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToMain}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Main</span>
              </button>
              <div className="text-2xl font-gotham-light text-white tracking-tight">
                SunLink Portal
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Welcome, {customerInfo.name.split(" ")[0]}
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8  mt-16">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-neutral-800/80 border border-white/10 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors font-gotham-book ${
                        activeTab === tab.id
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
