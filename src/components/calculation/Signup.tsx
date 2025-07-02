import { useState } from "react";
import {
  Search,
  Zap,
  ArrowRight,
  User,
  Building2,
  Mail,
  Phone,
  Home,
  X,
  BarChart3,
  Lock,
  Eye,
  EyeOff,
  Check,
  ChevronLeft,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import SolarResults from "./SolarResults";
import VerificationModal from "./VerificationModal";
import { motion } from "framer-motion";

function Signup() {
  const [currentStep, setCurrentStep] = useState<
    "form" | "verification" | "results"
  >("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [ownsHome, setOwnsHome] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [utilityCompany, setUtilityCompany] = useState("");
  const [powerBill, setPowerBill] = useState("");
  const [showIneligibleModal, setShowIneligibleModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [energyInputMode, setEnergyInputMode] = useState<"annual" | "monthly">(
    "annual"
  );
  const [annualUsage, setAnnualUsage] = useState("");
  const [monthlyUsages, setMonthlyUsages] = useState(Array(12).fill(""));
  const [ineligibilityReason, setIneligibilityReason] = useState<
    "renter" | "property-type"
  >("property-type");

  const utilityCompanies = [
    "Select your utility company",
    "Pacific Gas & Electric (PG&E)",
    "Southern California Edison (SCE)",
    "San Diego Gas & Electric (SDG&E)",
    "Los Angeles Department of Water & Power (LADWP)",
    "Sacramento Municipal Utility District (SMUD)",
    "Imperial Irrigation District (IID)",
    "Modesto Irrigation District (MID)",
    "Turlock Irrigation District (TID)",
    "Other",
  ];

  const propertyTypes = [
    "Select property type",
    "Single Family Home",
    "Townhome",
    "Condo",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Password validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(
    (req) => req
  );
  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Form validation - more lenient, only require essential fields
  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    isPasswordValid &&
    passwordsMatch &&
    address.trim() &&
    ownsHome &&
    propertyType &&
    utilityCompany &&
    powerBill.trim();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleContinue = () => {
    // Check if user is a renter
    if (ownsHome === "no") {
      setIneligibilityReason("renter");
      setShowIneligibleModal(true);
      return;
    }

    // Check if property type is eligible (only Single Family Home qualifies)
    if (propertyType === "Townhome" || propertyType === "Condo") {
      setIneligibilityReason("property-type");
      setShowIneligibleModal(true);
      return;
    }

    // If all validations pass, show verification modal
    setShowVerificationModal(true);
  };

  const handleVerificationComplete = () => {
    setShowVerificationModal(false);
    console.log("Account created and verified:", {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      ownsHome,
      propertyType,
      utilityCompany,
      powerBill,
    });
    setCurrentStep("results");

    // Scroll to top when navigating to results
    setTimeout(scrollToTop, 100);
  };

  const handleBack = () => {
    setCurrentStep("form");

    // Scroll to top when navigating back to form
    setTimeout(scrollToTop, 100);
  };

  const handleContinueToDesign = () => {
    console.log("Continue to design phase");
    // This would navigate to the next step in the flow
    // Scroll to top for any future navigation
    setTimeout(scrollToTop, 100);
  };

  const closeIneligibleModal = () => {
    setShowIneligibleModal(false);
  };

  const openEnergyModal = () => {
    setShowEnergyModal(true);
  };

  const closeEnergyModal = () => {
    setShowEnergyModal(false);
  };

  const handleEnergySubmit = () => {
    if (energyInputMode === "annual" && annualUsage) {
      // Convert annual kWh to estimated monthly bill (assuming ~$0.15/kWh average)
      const estimatedMonthlyBill = Math.round(
        (parseInt(annualUsage) * 0.15) / 12
      );
      setPowerBill(estimatedMonthlyBill.toString());
    } else if (energyInputMode === "monthly") {
      // Calculate total annual usage and convert to estimated monthly bill
      const totalAnnualUsage = monthlyUsages.reduce(
        (sum, usage) => sum + (parseInt(usage) || 0),
        0
      );
      const estimatedMonthlyBill = Math.round((totalAnnualUsage * 0.15) / 12);
      setPowerBill(estimatedMonthlyBill.toString());
    }
    closeEnergyModal();
  };

  const handleMonthlyUsageChange = (index: number, value: string) => {
    const newUsages = [...monthlyUsages];
    newUsages[index] = value;
    setMonthlyUsages(newUsages);
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 400 } },
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  if (currentStep === "results") {
    return (
      <SolarResults
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        address={address}
        utilityCompany={utilityCompany}
        powerBill={powerBill}
        onBack={handleBack}
        onContinue={handleContinueToDesign}
      />
    );
  }

  return (
    <motion.div
      key="design-form-container"
      className="w-full"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full max-w-2xl mx-auto ">
        {/* <motion.div
          className="absolute -inset-8 rounded-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.4, 0.2],
            scale: [1, 1.015, 1.015, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.4, 0.6, 1],
            repeatType: "loop",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-white/20 to-blue-500/20 rounded-3xl blur-[60px] opacity-60" />
        </motion.div> */}

        <motion.div
          className="relative mx-4 md:mx-8 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden mt-50 sm:p-8 md:p-12"
          animate={{
            boxShadow: [
              "0 0 20px 0 rgba(255,255,255,0.1)",
              "0 0 25px 2px rgba(255,255,255,0.12)",
              "0 0 25px 2px rgba(255,255,255,0.12)",
              "0 0 20px 0 rgba(255,255,255,0.1)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.4, 0.6, 1],
            repeatType: "loop",
          }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 mb-4">
              Design Your Solar System
            </h2>
            <p className="text-gray-400 text-lg">
              Create your personalized account and get a solar estimate tailored
              to your home
            </p>
          </motion.div>

          <div className="mx-auto z-10">
            <div className="items-center">
              <div className="bg-black/40 backdrop-blur-2xl p-8 lg:p-12 shadow-2xl rounded-3xl border border-white/10">
                <div className="space-y-8">
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="Create Password"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Property Address"
                      className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                    />

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Do you own your home?
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          className="py-3 px-5 rounded-full bg-white/10 text-white border border-white/20"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="py-3 px-5 rounded-full bg-white/10 text-white border border-white/20"
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <select className="py-3 px-5 rounded-full w-full overflow-y-auto bg-black/80 border border-white/10 text-white shadow-lg">
                      <option disabled selected>
                        Select Property Type
                      </option>
                      <option>Single Family</option>
                      <option>Multi Family</option>
                      <option>Townhouse</option>
                    </select>

                    <select
                      value={utilityCompany}
                      onChange={(e) => setUtilityCompany(e.target.value)}
                      className="w-full py-3 px-5 rounded-full overflow-y-auto bg-black/80 border border-white/10 text-white shadow-lg"
                    >
                      {utilityCompanies.map((company, index) => (
                        <option
                          key={index}
                          value={index === 0 ? "" : company}
                          disabled={index === 0}
                        >
                          {company}
                        </option>
                      ))}
                    </select>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="Average Electric Bill"
                        className="w-full pl-10 py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        /mo
                      </span>
                    </div>
                    <span>
                      <button
                        onClick={openEnergyModal}
                        className="mt-2 text-brand-teal hover:text-brand-teal-dark text-white text-sm transition-colors duration-200 flex items-center gap-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        or enter your energy consumption
                      </button>
                    </span>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wider group disabled:opacity-50"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wider group disabled:opacity-50"
                      >
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </div>
                  </form>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wider group disabled:opacity-50"
                  >
                    Go to Solar Results
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Modal */}
          <VerificationModal
            isOpen={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            onVerificationComplete={handleVerificationComplete}
            email={email}
            phone={phone}
            firstName={firstName}
          />

          {/* Energy Consumption Modal */}
          {showEnergyModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="tesla-card tesla-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="tesla-heading text-2xl text-white">
                        Energy Consumption
                      </h3>
                    </div>
                    <button
                      onClick={closeEnergyModal}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Toggle Buttons */}
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      onClick={() => setEnergyInputMode("annual")}
                      className={`tesla-button flex-1 py-3 px-4 ${
                        energyInputMode === "annual"
                          ? "bg-white text-brand-teal shadow-sm"
                          : "text-white hover:text-white"
                      }`}
                    >
                      Annual Total
                    </button>
                    <button
                      onClick={() => setEnergyInputMode("monthly")}
                      className={`tesla-button flex-1 py-3 px-4 ${
                        energyInputMode === "monthly"
                          ? "bg-white text-brand-teal shadow-sm"
                          : "text-white hover:text-white"
                      }`}
                    >
                      Month by Month
                    </button>
                  </div>

                  {/* Annual Input */}
                  {energyInputMode === "annual" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Total Annual Energy Usage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={annualUsage}
                            onChange={(e) => setAnnualUsage(e.target.value)}
                            className="tesla-input w-full pr-16 pl-4 py-4 text-lg"
                            placeholder="12000"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-lg">
                            kWh/year
                          </span>
                        </div>
                      </div>
                      <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10">
                        <p className="tesla-body text-white text-sm">
                          <strong>Tip:</strong> You can find your annual usage
                          on your utility bill or by adding up 12 months of
                          usage from your online account.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Monthly Input */}
                  {energyInputMode === "monthly" && (
                    <div className="space-y-4">
                      <p className="tesla-body text-white text-sm mb-4">
                        Enter your monthly energy usage for each month (in kWh).
                        You can find this information on your utility bills.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {monthNames.map((month, index) => (
                          <div key={month}>
                            <label className="block tesla-caption text-xs text-white mb-1">
                              {month}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={monthlyUsages[index]}
                                onChange={(e) =>
                                  handleMonthlyUsageChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="tesla-input w-full pr-10 pl-3 py-2 text-sm"
                                placeholder="1000"
                              />
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs">
                                kWh
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10">
                        <p className="tesla-body text-white text-sm">
                          <strong>Total Annual Usage:</strong>{" "}
                          {monthlyUsages
                            .reduce(
                              (sum, usage) => sum + (parseInt(usage) || 0),
                              0
                            )
                            .toLocaleString()}{" "}
                          kWh
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={closeEnergyModal}
                      className="tesla-button flex-1 bg-brand-gray hover:bg-brand-gray/80 text-white py-3 px-6"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEnergySubmit}
                      disabled={
                        (energyInputMode === "annual" && !annualUsage) ||
                        (energyInputMode === "monthly" &&
                          monthlyUsages.every((usage) => !usage))
                      }
                      className="tesla-button flex-1 bg-gradient-to-r from-brand-orange to-brand-teal hover:from-brand-orange-dark hover:to-brand-teal-dark text-white py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Use This Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ineligible Modal */}
          {showIneligibleModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="tesla-card tesla-glass max-w-md w-full p-8 relative shadow-2xl">
                <button
                  onClick={closeIneligibleModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="text-center">
                  <div className="w-16 h-16 tesla-gradient-bg rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Home className="w-8 h-8 text-brand-orange" />
                  </div>

                  <h3 className="tesla-heading text-2xl text-white mb-4">
                    We're Sorry
                  </h3>

                  {ineligibilityReason === "renter" ? (
                    <>
                      <p className="tesla-body text-white text-lg mb-6">
                        Solar installation is only available for homeowners. As
                        a renter, you would need permission from your landlord
                        and they would receive the benefits of the solar system.
                      </p>

                      <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10 mb-6">
                        <p className="tesla-body text-white text-sm">
                          <strong>Homeowners only:</strong> Solar systems
                          require property ownership for installation,
                          financing, and to receive tax credits and incentives.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="tesla-body text-white text-lg mb-6">
                        Your property type is not eligible for solar
                        installation at this time. Solar systems work best on
                        single-family homes with adequate roof space and proper
                        orientation.
                      </p>

                      <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10 mb-6">
                        <p className="tesla-body text-white text-sm">
                          <strong>Eligible property types:</strong>{" "}
                          Single-family homes with suitable roof conditions for
                          solar panel installation. Townhomes and condos
                          typically have shared roofs or HOA restrictions that
                          prevent solar installation.
                        </p>
                      </div>
                    </>
                  )}

                  <button
                    onClick={closeIneligibleModal}
                    className="tesla-button w-full bg-gradient-to-r from-brand-orange to-brand-teal hover:from-brand-orange-dark hover:to-brand-teal-dark text-white py-3 px-6"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Signup;
