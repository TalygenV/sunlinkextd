import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  CheckCircle,
  X,
  Home,
  Zap,
  FileText,
  ArrowRight,
  AlertCircle,
  Image,
} from "lucide-react";

interface PhotoUploadPageProps {
  onComplete: () => void;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  category: string;
}

const PhotoUploadPage: React.FC<PhotoUploadPageProps> = ({
  onComplete,
  customerInfo,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [roofType, setRoofType] = useState("");
  const [roofAge, setRoofAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const fileInputRefs = {
    frontHome: useRef<HTMLInputElement>(null),
    electricalPanel: useRef<HTMLInputElement>(null),
    meterClose: useRef<HTMLInputElement>(null),
    meterFar: useRef<HTMLInputElement>(null),
    utilityBill: useRef<HTMLInputElement>(null),
  };

  const roofTypes = [
    "Asphalt Shingles",
    "Metal",
    "Tile (Clay/Concrete)",
    "Slate",
    "Wood Shingles",
    "Flat/Membrane",
    "Other",
  ];

  const roofAges = [
    "0-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "21-25 years",
    "25+ years",
    "Unknown",
  ];

  const uploadCategories = [
    {
      id: "frontHome",
      title: "Front of Home",
      description: "Clear photo showing the front of your house and roof",
      icon: Home,
      required: true,
    },
    {
      id: "electricalPanel",
      title: "Electrical Panel",
      description: "Photo of your main electrical panel (breaker box)",
      icon: Zap,
      required: true,
    },
    {
      id: "meterClose",
      title: "Meter Close-up",
      description: "Close-up photo of your electric meter showing details",
      icon: Zap,
      required: true,
    },
    {
      id: "meterFar",
      title: "Meter Far Away",
      description:
        "Photo of your electric meter from a distance showing location",
      icon: Zap,
      required: true,
    },
    {
      id: "utilityBill",
      title: "Recent Utility Bill",
      description:
        "Photo of your most recent utility bill showing account holder name and account number",
      icon: FileText,
      required: true,
    },
  ];

  const handleFileSelect = (category: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: UploadedFile = {
        id: `${category}-${Date.now()}`,
        file,
        preview: e.target?.result as string,
        category,
      };

      setUploadedFiles((prev) => {
        // Remove any existing file for this category
        const filtered = prev.filter((f) => f.category !== category);
        return [...filtered, newFile];
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDragOver(null);
    handleFileSelect(category, e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDragOver(category);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileForCategory = (category: string) => {
    return uploadedFiles.find((f) => f.category === category);
  };

  const isFormComplete = () => {
    const requiredCategories = uploadCategories
      .filter((cat) => cat.required)
      .map((cat) => cat.id);
    const uploadedCategories = uploadedFiles.map((f) => f.category);
    const hasAllRequired = requiredCategories.every((cat) =>
      uploadedCategories.includes(cat)
    );
    return hasAllRequired && roofType && roofAge;
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert(
        "Please complete all required fields and upload all required photos"
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsSubmitting(false);
    onComplete();
  };

  const UploadArea: React.FC<{ category: any }> = ({ category }) => {
    const Icon = category.icon;
    const existingFile = getFileForCategory(category.id);
    const isDraggedOver = dragOver === category.id;

    return (
      <div className="bg-[#111] rounded-xl border border-gray-800 p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#1c1c1c] rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-1">
            <h3 className="font-medium text-white">{category.title}</h3>
            {category.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4">{category.description}</p>

        {/* Uploaded File Preview */}
        {existingFile ? (
          <div className="relative">
            <img
              src={existingFile.preview}
              alt={category.title}
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
            />
            <button
              onClick={() => removeFile(existingFile.id)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {existingFile.file.name}
            </div>
          </div>
        ) : (
          // Upload Area
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDraggedOver
                ? "border-blue-500 bg-[#1a1a1a]"
                : "border-gray-700 hover:border-gray-500 hover:bg-[#1a1a1a]"
            }`}
            onDrop={(e) => handleDrop(e, category.id)}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDragLeave={handleDragLeave}
            onClick={() =>
              fileInputRefs[
                category.id as keyof typeof fileInputRefs
              ]?.current?.click()
            }
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={fileInputRefs[category.id as keyof typeof fileInputRefs]}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(category.id, e.target.files)}
        />
      </div>
    );
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="bg-[#111] rounded-2xl w-full max-w-2xl p-8 text-center animate-fade-in border border-gray-800">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-light text-white mb-4">
            Uploading Your Photos
          </h2>
          <p className="text-gray-400 mb-6">
            Processing your home photos and information...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white mb-2">
            Upload Home Photos
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Help us prepare your solar installation by sharing photos of your
            home and electrical setup. These photos will be used by your
            installer to prepare necessary permits and plan your installation.
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-[#111] rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-white mb-4">
            Installation Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Customer:</span>
              <div className="font-medium text-white">{customerInfo.name}</div>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <div className="font-medium text-white">{customerInfo.email}</div>
            </div>
            <div>
              <span className="text-gray-500">Address:</span>
              <div className="font-medium text-white">
                {customerInfo.address}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {uploadCategories.map((category) => (
            <UploadArea key={category.id} category={category} />
          ))}
        </div>

        {/* Roof Info */}
        <div className="bg-[#111] rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-medium text-white mb-6">
            Roof Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="roofType"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                What type of roof do you have? *
              </label>
              <select
                id="roofType"
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-[#111] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select roof type</option>
                {roofTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="roofAge"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                How old is your roof? *
              </label>
              <select
                id="roofAge"
                value={roofAge}
                onChange={(e) => setRoofAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-[#111] text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select roof age</option>
                {roofAges.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-[#0d1b2a] border border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-200 mb-2">
                Photo Guidelines
              </h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Take photos during daylight hours for best visibility</li>
                <li>• Ensure photos are clear and not blurry</li>
                <li>
                  • For utility bill, make sure account holder name and account
                  number are visible
                </li>
                <li>
                  • Photos should be recent (taken within the last 30 days)
                </li>
                <li>
                  • All personal information on utility bills will be kept
                  confidential
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#111] rounded-xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Upload Progress</h3>
            <span className="text-sm text-gray-400">
              {uploadedFiles.length} of{" "}
              {uploadCategories.filter((cat) => cat.required).length} required
              photos uploaded
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (uploadedFiles.length /
                    uploadCategories.filter((cat) => cat.required).length) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {uploadCategories
              .filter((cat) => cat.required)
              .map((category) => {
                const hasFile = getFileForCategory(category.id);
                return (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {hasFile ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                    )}
                    <span
                      className={hasFile ? "text-green-300" : "text-gray-500"}
                    >
                      {category.title}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete()}
            className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-200 ${
              isFormComplete()
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-[1.02] hover:shadow-xl"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Upload className="w-6 h-6" />
            <span>Submit Photos & Information</span>
          </button>

          <button
            onClick={onComplete}
            className="bg-white/10 text-white hover:bg-white/20 py-4 px-8 rounded-xl font-medium"
          >
            Skip for Now
          </button>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-[#111] rounded-xl border border-gray-800 p-6">
          <h3 className="font-medium text-white mb-4">After You Submit</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <div className="font-medium text-white">Review & Analysis</div>
                <div className="text-gray-400">
                  Our team reviews your photos within 24 hours
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <div className="font-medium text-white">Permit Preparation</div>
                <div className="text-gray-400">
                  We prepare and submit all necessary permits
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <div className="font-medium text-white">
                  Installer Assignment
                </div>
                <div className="text-gray-400">
                  You'll be matched with a certified installer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadPage;
