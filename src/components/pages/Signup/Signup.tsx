import { useEffect, useRef, useState } from "react";
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
  CheckCircle,
} from "lucide-react";
import SolarResults from "./SolarResults";
import VerificationModal from "./VerificationModal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GenabilityData, SolarData, Tariff } from "@/domain/types";
import { CallToAction } from "../../sections";

type Territory = {
  name: string;
  code: string;
  websiteHome: string;
  lseId: number;
};

const GENABILITY_APP_ID =
  import.meta.env.GENABILITY_APP_ID || "db91730b-5e06-47b5-b720-772d79852505";
const GENABILITY_API_KEY =
  import.meta.env.GENABILITY_API_KEY || "e9fd3859-80a0-4802-86b1-add58689c540";
const base_url = "https://api.genability.com";
const basic_token =
  "NjQ2M2ZmM2EtMTJjZS00MjQ0LWFiMTEtMWQwOTZiNTQwN2M1OjFkMGM5NTI4LTU1NDktNDhhMy1iYTg5LTZkMWJlYTllMzllNQ==";

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
  const [address, setAddress] = useState({ lat: 0, lng: 0 });
  const [ownsHome, setOwnsHome] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [utilityCompany, setUtilityCompany] = useState("");
  const [powerBill, setPowerBill] = useState(0);
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
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(
    null
  );
  const [showNoTariffModal, setShowNoTariffModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showKwh, setShowKwh] = useState(false);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [isAddressSupported, setIsAddressSupported] = useState(true);
  const [genabilityData, setGenabilityData] = useState<GenabilityData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //navigate hook

  const navigate = useNavigate();

  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addressInputRef.current && window.google) {
      console.log("addressInputRef", addressInputRef);
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          componentRestrictions: { country: "us" },
          fields: ["address_components", "formatted_address", "geometry"],
          types: ["address"],
        }
      );
      console.log("autocomplete", autocomplete);
      autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace();
        console.log(
          "addressInputRef.current?.value",
          addressInputRef.current?.value
        );
        const address = addressInputRef.current?.value;
        const lataddress = place.geometry?.location?.lat();
        const lngaddress = place.geometry?.location?.lng();
        let postalCode: string | undefined = undefined;

        // Extract postal code from address_components
        if (place.address_components) {
          for (const component of place.address_components) {
            if (component.types.includes("postal_code")) {
              postalCode = component.long_name;
              break;
            }
          }
        }

        if (address && place.geometry?.location) {
          setFormattedAddress(address);
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setAddress({ lat, lng });
          }

          try {
            const response = await fetch(
              `${base_url}/rest/public/lses?addressString=${address}&country=US&residentialServiceTypes=ELECTRICITY&sortOn=totalCustomers&sortOrder=DESC`,
              {
                method: "GET",
                headers: {
                  Authorization: `Basic ${basic_token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const data = (await response.json()) as {
              status: string;
              results: Territory[];
            };

            if (data.status === "success") {
              const utilityList = data.results || [];

              // You can filter if needed — for example, ignore records without names or websites:
              const filteredList = utilityList.filter(
                (u) => u.name && u.websiteHome
              );

              setTerritories(filteredList); // Though this should ideally be named setUtilities or similar
            } else {
              setTerritories([]);
            }
          } catch (error) {
            console.error("Error fetching utilities:", error);
          }
        }
      });
    }
  }, []);

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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleNextScreen = () => {
    navigate(`/solar-results`);
  };

  const fetchUtilityAndTariff = async () => {
    try {
      // Input validation
      if (!address.lat || !address.lng || powerBill <= 0)
        throw new Error("Provide a valid address and monthly bill.");
      if (!selectedTerritory?.lseId) throw new Error("No utility selected.");
      if (!GENABILITY_APP_ID || !GENABILITY_API_KEY)
        throw new Error("Missing API credentials.");

      const lseId = selectedTerritory.lseId;
      const today = new Date().toISOString().split("T")[0];
      const lastYear = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
        .toISOString()
        .split("T")[0];
      const annualBill = powerBill * 12;
      const randomId = Math.floor(Math.random() * 100000);
      const providerAccountId = `provider-account-${randomId}`;
      const accountName = `customer-account-${randomId}`;

      setIsLoading(true);
      setError(null);

      // 1. Create Genability Account
      const accountRes = await fetch(`${base_url}/rest/v1/accounts`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerAccountId,
          accountName,
          address: { addressString: formattedAddress },
          properties: {
            customerClass: {
              keyName: "customerClass",
              dataValue: "1",
            },
          },
        }),
      });

      if (!accountRes.ok) throw new Error(await accountRes.text());
      const accountData = await accountRes.json();
      const accountId = accountData?.results?.[0]?.accountId;
      if (!accountId) throw new Error("Account ID not found in response.");

      // 2. Set lseId property
      await fetch(`${base_url}/rest/v1/accounts/${accountId}/properties`, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${basic_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyName: "lseId",
          dataValue: lseId,
        }),
      });

      // 3. Estimate kWh from annual bill
      const kwhCalcRes = await fetch(
        `${base_url}/rest/v1/accounts/${accountId}/calculate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${basic_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromDateTime: lastYear,
            toDateTime: today,
            billingPeriod: "false",
            groupBy: "MONTH",
            detailLevel: "TOTAL",
            propertyInputs: [
              { keyName: "total", dataValue: annualBill, unit: "cost" },
              { keyName: "baselineType", dataValue: "typicalElectricity" },
            ],
          }),
        }
      );

      if (!kwhCalcRes.ok) throw new Error(await kwhCalcRes.text());
      const kwhData = await kwhCalcRes.json();
      const pricePerKwh = kwhData?.results?.[0]?.summary?.kWh;
      const estimatedMonthlyKwh = kwhData?.results?.[0]?.summary?.kW;
      if (!pricePerKwh) throw new Error("kWh estimate not found.");

      // 4. Estimate system size in kW (used later for solar profile and display)

      const recommendedSizeKw = estimatedMonthlyKwh * 1000;
      await fetch(`${base_url}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerAccountId: providerAccountId,
          providerProfileId: `Annual-Consumption-${providerAccountId}`,
          profileName: `Annual Consumption for ${providerAccountId}`,
          isDefault: true,
          serviceTypes: "ELECTRICITY",
          sourceId: "ReadingEntry",
          readingData: [
            {
              fromDateTime: lastYear,
              toDateTime: today,
              quantityUnit: "kWh",
              quantityValue: pricePerKwh,
            },
          ],
        }),
      });

      // if (!profileResAnnual.ok) throw new Error(await profileResAnnual.text());
      // const profileDataAnnual = await profileResAnnual.json();
      // 5. Create Solar Profile
      await fetch(`${base_url}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerAccountId: providerAccountId,
          providerProfileId: `Solar-Production-PVWatts-6kW-${providerAccountId}`,
          groupBy: "YEAR",
          serviceTypes: "SOLAR_PV",
          source: { sourceId: "PVWatts", sourceVersion: "8" },
          properties: {
            systemSize: {
              keyName: "systemSize",
              dataValue: estimatedMonthlyKwh,
            },
            azimuth: { keyName: "azimuth", dataValue: "180" },
            losses: { keyName: "losses", dataValue: "15" },
            inverterEfficiency: {
              keyName: "inverterEfficiency",
              dataValue: "96",
            },
            tilt: { keyName: "tilt", dataValue: "25" },
          },
        }),
      });

      // if (!profileRes.ok) throw new Error(await profileRes.text());
      // const profileData = await profileRes.json();

      const analysis = await fetch(`${base_url}/rest/v1/accounts/analysis`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerAccountId: providerAccountId,
          fromDateTime: today,
          useIntelligentBaselining: true,
          propertyInputs: [
            {
              keyName: "providerProfileId",
              dataType: "STRING",
              dataValue: `Annual-Consumption-${providerAccountId}`,
              scenarios: "before,after",
              dataFactor: 1.0,
            },
            {
              keyName: "providerProfileId",
              dataType: "STRING",
              dataValue: `Solar-Production-PVWatts-6kW-${providerAccountId}`,
              scenarios: "solar,after",
              dataFactor: 1.0,
            },
            {
              keyName: "projectDuration",
              dataType: "INTEGER",
              dataValue: "25",
            },
            {
              keyName: "rateInflation",
              dataType: "DECIMAL",
              dataValue: "3.0",
              scenarios: "before,after",
            },
            {
              keyName: "rateInflation",
              dataType: "DECIMAL",
              dataValue: "2.0",
              scenarios: "solar",
            },
            {
              keyName: "solarDegradation",
              dataType: "DECIMAL",
              dataValue: "0.5",
              scenarios: "solar",
            },
          ],
          rateInputs: [
            {
              chargeType: "CONSUMPTION_BASED",
              chargePeriod: "MONTHLY",
              transactionType: "BUY",
              rateBands: [
                {
                  rateAmount: 0.15,
                },
              ],
              scenarios: "solar",
            },
          ],
        }),
      });

      if (!analysis.ok) throw new Error(await analysis.text());
      const analysisData = await analysis.json();
      // Pull only the first result
      const seriesResult = analysisData?.results?.[0];

      const estimatedAnnualSavings =
        estimatedMonthlyKwh * 12 * pricePerKwh * 0.8; // 80% savings
      const penalCount = recommendedSizeKw / 400;
      console.log("pricePerKwh", pricePerKwh);
      console.log("selectedTerritory.name", selectedTerritory.name);
      console.log("estimatedMonthlyKwh", estimatedMonthlyKwh);
      console.log("recommendedSizeKw", recommendedSizeKw);
      console.log("estimatedAnnualSavings", estimatedAnnualSavings);
      console.log("penalCount", penalCount);
      console.log("providerAccountId", providerAccountId);

      return {
        utilityName: selectedTerritory.name || "Unknown Utility",
        pricePerKwh,
        estimatedMonthlyKwh,
        recommendedSizeKw,
        estimatedAnnualSavings,
        providerAccountId,
        penalCount,
        seriesData: {
          series: seriesResult?.series || [],
          seriesData: seriesResult?.seriesData || [],
        },
      };
    } catch (error: unknown) {
      console.error("Genability API error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch utility data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  function isPointInBoundingBox(
    point: { lat: number; lng: number },
    boundingBox: {
      ne: { latitude: number; longitude: number };
      sw: { latitude: number; longitude: number };
    }
  ): boolean {
    return (
      point.lat >= boundingBox.sw.latitude &&
      point.lat <= boundingBox.ne.latitude &&
      point.lng >= boundingBox.sw.longitude &&
      point.lng <= boundingBox.ne.longitude
    );
  }

  const fetchSolarData = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsAddressSupported(true);
      setShowResults(true);

      // Validate coordinates
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("Invalid coordinates provided.");
      }

      const response = await fetch(
        `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(
          `Solar API error: ${data.error.message} (Code: ${data.error.code})`
        );
      }

      let addressSupported = true;

      if (data.boundingBox && data.boundingBox.ne && data.boundingBox.sw) {
        addressSupported = isPointInBoundingBox({ lat, lng }, data.boundingBox);
      }

      if (
        !data.solarPotential ||
        !data.solarPotential.solarPanels ||
        data.solarPotential.solarPanels.length < 10
      ) {
        addressSupported = false;
      }

      console.log("addressSupported:", addressSupported);
      console.log("power:", powerBill);
      console.log(
        "solarPanels length:",
        data?.solarPotential?.solarPanels?.length
      );
      setIsAddressSupported(addressSupported);
      const fallbackSolarData = {
        name: formattedAddress,
        coordinates: { latitude: lat, longitude: lng },
        postalCode: data.postalCode || "",
        administrativeArea: data.administrativeArea || "",
        isAutoPanelsSupported: false,
      };

      if (!addressSupported && (!powerBill || powerBill <= 0)) {
        setShowKwh(true);
        setError(
          "This address requires manual design. Please enter your average monthly energy consumption (kWh)."
        );
        setShowResults(false);
        setIsLoading(false);
        return fallbackSolarData; // instead of `null`
      }

      const processedData = addressSupported
        ? {
            ...data,
            isAutoPanelsSupported: true,
            coordinates: { latitude: lat, longitude: lng },
          }
        : fallbackSolarData;

      setSolarData(processedData);
      return processedData;
    } catch (error: unknown) {
      console.error("Error fetching solar data:", error);
      setShowResults(false);
      setError(
        "Unable to fetch solar data for this location. Please try another address."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    // Form validation - more lenient, only require essential fields
    const isValidForm =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      passwordsMatch &&
      ownsHome !== null &&
      propertyType !== "" &&
      powerBill !== 0;

    if (!isValidForm) {
      setError("Please enter a All Valid Details.");

      console.log(
        "form is not valid",
        firstName,
        lastName,
        email,
        phone,
        passwordsMatch
      );
    }

    console.log(selectedTerritory, address, powerBill);

    if (!address.lat || !selectedTerritory || !address.lng || powerBill <= 0) {
      setError("Please enter a valid address and monthly bill.");
      return;
    }

    setIsFormValid(isValidForm);

    try {
      setIsLoading(true);
      setError(null);

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

      const genabilityInfo = await fetchUtilityAndTariff();
      const solarInfo = await fetchSolarData(address.lat, address.lng);

      console.log(genabilityInfo, solarInfo);

      if (genabilityInfo) {
        setGenabilityData(genabilityInfo);
        solarInfo.estimatedMonthlyKwh = genabilityInfo.estimatedMonthlyKwh;
        setSolarData(solarInfo); // Update state here
        setShowResults(true);
      } else {
        setError("Failed to process data. Please try again.");
      }

      // If all validations pass, show verification modal
      setShowVerificationModal(true);
    } catch (err: unknown) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch utility or solar data."
      );
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
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

  const handleEnergyModal = (value: any) => {
    setShowEnergyModal(value);
  };

  const handleEnergySubmit = () => {
    if (energyInputMode === "annual" && annualUsage) {
      // Convert annual kWh to estimated monthly bill (assuming ~$0.15/kWh average)
      const estimatedMonthlyBill = Math.round(
        (parseInt(annualUsage) * 0.15) / 12
      );
      setPowerBill(estimatedMonthlyBill);
    } else if (energyInputMode === "monthly") {
      // Calculate total annual usage and convert to estimated monthly bill
      const totalAnnualUsage = monthlyUsages.reduce(
        (sum, usage) => sum + (parseInt(usage) || 0),
        0
      );
      const estimatedMonthlyBill = Math.round((totalAnnualUsage * 0.15) / 12);
      setPowerBill(estimatedMonthlyBill);
    }
    handleEnergyModal(false);
  };

  const handleMonthlyUsageChange = (index: number, value: string) => {
    const newUsages = [...monthlyUsages];
    newUsages[index] = value;
    setMonthlyUsages(newUsages);
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

  if (showResults && genabilityData && solarData) {
    return (
      <>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white text-center mb-16 md:mb-24">
          Solar for you, not sales people
        </h1>

        <div className="w-full max-w-[1200px] mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl font-medium text-blue-500 mr-3">
                  1
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-home w-6 h-6"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-medium text-white">
                Create YOUR custom design with our advanced AI design tool
              </h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl font-medium text-blue-500 mr-3">
                  2
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-sun w-6 h-6"
                  >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-medium text-white">
                Choose your plan
              </h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl font-medium text-blue-500 mr-3">
                  3
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-camera w-6 h-6"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-medium text-white">
                Upload photos of your home
              </h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center mb-3">
                <span className="text-2xl font-medium text-blue-500 mr-3">
                  4
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-wrench w-6 h-6"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-medium text-white">
                Get installed
              </h3>
            </div>
          </div>
        </div>

        <CallToAction
          data={{
            ...solarData,
            ...genabilityData,
            name: formattedAddress,
            targetMonthlyBill: powerBill,
            isAutoPanelsSupported: isAddressSupported,
            coordinates: {
              latitude: address.lat,
              longitude: address.lng,
            },
          }}
          monthlyConsumption={showKwh ? powerBill : 0}
          onContinue={() => {
            /* Handle continue */
          }}
          onBack={() => setShowResults(false)}
        />
      </>
    );
  }

  return (
    <body className="bg-black text-white m-0 p-0">
      <div className="min-h-screen flex items-start justify-center">
        <div className="w-full max-w-2xl mt-32">
          <motion.div
            className="mx-4 md:mx-8 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden sm:p-8 md:p-12"
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
            <div className="">
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
                  Create your personalized account and get a solar estimate
                  tailored to your home
                </p>
              </motion.div>

              <div className="mx-auto z-10">
                <div className="items-center">
                  <div className="bg-black/40 backdrop-blur-2xl p-8 lg:p-12 shadow-2xl rounded-3xl border border-white/10">
                    <div className="space-y-8">
                      {/* <form className="space-y-6"> */}
                      <form
                        onSubmit={(e) => e.preventDefault()}
                        className="relative space-y-10"
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="First Name"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <input
                            placeholder="Create Password"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Property Address"
                          className="w-full py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                          ref={addressInputRef}
                          // value={address}
                          // onChange={(e) => setAddress(e.target.value)}
                        />

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Do you own your home?
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              className={`py-3 px-5 rounded-full bg-white/10 text-white border border-white/20 ${
                                ownsHome === "yes"
                                  ? "border border-blue-300 bg-white text-blue-600 hover:border-brand-blue/50 hover:bg-brand-blue/5"
                                  : "border border-gray-300 bg-white text-gray-600 hover:border-brand-teal/50 hover:bg-brand-teal/5"
                              }`}
                              onClick={() => setOwnsHome("yes")}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setOwnsHome("no")}
                              className={`py-3 px-5 rounded-full bg-white/10 text-white border border-white/20 ${
                                ownsHome === "no"
                                  ? "border border-blue-300 bg-white text-blue-600 hover:border-brand-blue/50 hover:bg-brand-blue/5"
                                  : "border border-gray-300 bg-white text-gray-600 hover:border-brand-gray/50 hover:bg-brand-gray/5"
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="py-3 px-5 rounded-full w-full overflow-y-auto bg-black/80 border border-white/10 text-white shadow-lg"
                        >
                          {propertyTypes.map((type, index) => (
                            <option
                              key={index}
                              value={index === 0 ? "" : type}
                              disabled={index === 0}
                            >
                              {type}
                            </option>
                          ))}
                        </select>

                        {territories.length > 0 && (
                          <div className="mt-4 relative">
                            {/* Styled input that acts like a dropdown toggle */}
                            <div
                              className="relative group cursor-pointer"
                              onClick={() => setShowDropdown(!showDropdown)}
                            >
                              <input
                                readOnly
                                value={
                                  selectedTerritory
                                    ? `${selectedTerritory.name}`
                                    : ""
                                }
                                placeholder="Select a Utility"
                                className="w-full py-3 px-5 rounded-full overflow-y-auto bg-black/80 border border-white/10 text-white shadow-lg"
                              />
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                            {showNoTariffModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl w-full max-w-md text-center">
                                  <div className="flex justify-center mb-6">
                                    <CheckCircle className="w-16 h-16 text-green-400" />
                                  </div>
                                  <h2 className="text-2xl font-light text-white mb-4">
                                    Tariff Not Found
                                  </h2>
                                  <p className="text-gray-400 text-lg mb-8">
                                    No valid utility tariffs found for this
                                    address. Please select another address.
                                  </p>
                                  <motion.button
                                    onClick={() => setShowNoTariffModal(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wider"
                                  >
                                    Close
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                  </motion.button>
                                </div>
                              </div>
                            )}
                            {/* Dropdown list */}
                            {showDropdown && (
                              <ul className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-black/80 border border-white/10 rounded-xl text-white shadow-lg">
                                {territories.map((territory) => (
                                  <li
                                    key={territory.lseId}
                                    className="px-4 py-3 hover:bg-white/10 cursor-pointer transition"
                                    onClick={() => {
                                      console.log("1098", territory);
                                      setSelectedTerritory(territory);
                                      setShowDropdown(false);
                                    }}
                                  >
                                    {territory.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="Average Electric Bill"
                            className="w-full pl-10 py-3 px-5 bg-black/30 rounded-full border border-white/10 text-white placeholder-gray-400"
                            value={powerBill}
                            onChange={(e) =>
                              setPowerBill(parseInt(e.target.value))
                            }
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            /mo
                          </span>
                        </div>
                        <span>
                          <button
                            type="button"
                            onClick={() => {
                              handleEnergyModal(true), setShowKwh(true);
                            }}
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
                            type="button"
                            onClick={handleContinue}
                            //disabled={!isFormValid}
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
                        onClick={handleNextScreen}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 relative z-10 w-full h-[52px] flex items-center justify-center gap-3 px-8 text-white rounded-full shadow-xl transition-all duration-500 bg-blue-500 hover:bg-blue-600 text-sm font-medium tracking-wider group disabled:opacity-50"
                      >
                        Go to Solar Results
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400 text-sm font-medium">
                              {error}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-blue-400 text-sm font-medium">
                              Loading...
                            </p>
                          </div>
                        </motion.div>
                      )}
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
                  <div className="tesla-card tesla-glass max-w-2xl w-full max-h-[110vh] overflow-y-auto shadow-2xl">
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
                          onClick={() => handleEnergyModal(false)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Toggle Buttons */}
                      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                          onClick={() => setEnergyInputMode("annual")}
                          className={`tesla-button flex-1 py-3 px-4 rounded-lg transition-colors duration-200 ${
                            energyInputMode === "annual"
                              ? "bg-blue-500 text-white shadow-sm"
                              : "text-gray-800 hover:text-black"
                          }`}
                        >
                          Annual Total
                        </button>
                        <button
                          onClick={() => setEnergyInputMode("monthly")}
                          className={`tesla-button flex-1 py-3 px-4 rounded-lg transition-colors duration-200 ${
                            energyInputMode === "monthly"
                              ? "bg-blue-500 text-white shadow-sm"
                              : "text-gray-800 hover:text-black"
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
                              <strong>Tip:</strong> You can find your annual
                              usage on your utility bill or by adding up 12
                              months of usage from your online account.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Monthly Input */}
                      {energyInputMode === "monthly" && (
                        <div className="space-y-4">
                          <p className="tesla-body text-white text-sm mb-4">
                            Enter your monthly energy usage for each month (in
                            kWh). You can find this information on your utility
                            bills.
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
                          onClick={() => handleEnergyModal(false)}
                          className="tesla-button flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6"
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
                          className="tesla-button flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
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
                            Solar installation is only available for homeowners.
                            As a renter, you would need permission from your
                            landlord and they would receive the benefits of the
                            solar system.
                          </p>

                          <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10 mb-6">
                            <p className="tesla-body text-white text-sm">
                              <strong>Homeowners only:</strong> Solar systems
                              require property ownership for installation,
                              financing, and to receive tax credits and
                              incentives.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="tesla-body text-white text-lg mb-6">
                            Your property type is not eligible for solar
                            installation at this time. Solar systems work best
                            on single-family homes with adequate roof space and
                            proper orientation.
                          </p>

                          <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10 mb-6">
                            <p className="tesla-body text-white text-sm">
                              <strong>Eligible property types:</strong>{" "}
                              Single-family homes with suitable roof conditions
                              for solar panel installation. Townhomes and condos
                              typically have shared roofs or HOA restrictions
                              that prevent solar installation.
                            </p>
                          </div>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={closeIneligibleModal}
                        className="bg-white/10 text-white border border-white/20 text-white py-3 px-6 rounded-lg w-full"
                      >
                        Understood
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </body>
  );
}

export default Signup;
