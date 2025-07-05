import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  X,
  Check,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { auth } from "../../../services/firebase";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
  email: string;
  phone: string;
  firstName: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
  email,
  phone,
  firstName,
}) => {
  const [verificationMethod, setVerificationMethod] = useState<
    "email" | "text"
  >("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any | null>(null);

  const [confirmationResult, setConfirmationResult] = useState<any | null>(
    null
  );

  // 5-minute countdown timer for resend (300 seconds)
  const RESEND_COUNTDOWN = 300;

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal closes
      setVerificationCode("");
      setIsCodeSent(false);
      setIsVerifying(false);
      setCountdown(0);
      setIsVerified(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  const sendVerificationCode = async () => {
    if (verificationMethod === "text" && phone) {
      if (!auth) {
        console.error("Firebase auth is undefined");
        return;
      }

      setIsCodeSent(true);
      setCountdown(RESEND_COUNTDOWN);

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phone,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        console.log("OTP sent to:", phone);
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    } else if (verificationMethod === "email" && email) {
      console.warn("Email verification via OTP not implemented yet.");
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);

    if (verificationCode.length === 6 && confirmationResult) {
      try {
        await confirmationResult?.confirm(verificationCode);
        // await confirmationResult.confirm(verificationCode);
        setIsVerified(true);
        setTimeout(() => {
          onVerificationComplete();
        }, 1500);
      } catch (error) {
        console.error("Invalid code", error);
        alert("Invalid verification code. Please try again.");
      }
    }

    setIsVerifying(false);
  };

  const resendCode = () => {
    setVerificationCode("");
    sendVerificationCode();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="tesla-card tesla-glass max-w-md w-full shadow-2xl">
        <div className="p-8">
          {!isVerified ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-teal rounded-lg flex items-center justify-center">
                    {verificationMethod === "email" ? (
                      <Mail className="w-6 h-6 text-white" />
                    ) : (
                      <MessageSquare className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h3 className="tesla-heading text-2xl text-white">
                    Verify Your Account
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <p className="tesla-body text-gray-600 text-center mb-6">
                Hi {firstName}! To secure your account and ensure we can reach
                you with important updates, please verify your contact
                information.
              </p>

              {!isCodeSent ? (
                <>
                  {/* Verification Method Selection */}
                  <div className="space-y-4 mb-6">
                    <p className="tesla-caption text-sm text-gray-700 mb-3">
                      Choose your preferred verification method:
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => setVerificationMethod("email")}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          verificationMethod === "email"
                            ? "border-brand-teal bg-brand-teal/10"
                            : "border-white/10 hover:border-brand-teal/50 bg-black/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              verificationMethod === "email"
                                ? "bg-brand-teal"
                                : "bg-white/10"
                            }`}
                          >
                            <Mail
                              className={`w-5 h-5 ${
                                verificationMethod === "email"
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="tesla-subheading text-white">
                              Email Verification
                            </p>
                            <p className="tesla-body text-sm text-gray-400">
                              {email}
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setVerificationMethod("text")}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          verificationMethod === "text"
                            ? "border-brand-teal bg-brand-teal/10"
                            : "border-white/10 hover:border-brand-teal/50 bg-black/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              verificationMethod === "text"
                                ? "bg-brand-teal"
                                : "bg-white/10"
                            }`}
                          >
                            <MessageSquare
                              className={`w-5 h-5 ${
                                verificationMethod === "text"
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="tesla-subheading text-white">
                              Text Message
                            </p>
                            <p className="tesla-body text-sm text-gray-400">
                              {phone}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={sendVerificationCode}
                    className="bg-white/10 text-white border border-white/20 text-whiterounded-lg w-full py-3 px-6 flex items-center justify-center gap-2 rounded-lg"
                  >
                    Send Verification Code
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Code Input */}
                  <div className="text-center mb-6">
                    <p className="tesla-body text-gray-600 mb-4">
                      We've sent a 6-digit verification code to:
                    </p>
                    <p className="tesla-subheading text-brand-teal text-lg">
                      {verificationMethod === "email" ? email : phone}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block tesla-caption text-sm text-gray-700 mb-2">
                        Enter Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        className="tesla-input w-full px-4 py-3 text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>

                    {/* Resend Code - 5 minute timer */}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <div className="tesla-gradient-bg rounded-lg p-3 border border-brand-orange/10">
                          <p className="tesla-body text-gray-600 text-sm">
                            Resend code in{" "}
                            <span className="tesla-subheading text-brand-teal">
                              {formatTime(countdown)}
                            </span>
                          </p>
                          <p className="tesla-body text-gray-500 text-xs mt-1">
                            Didn't receive it? Check your spam folder or try the
                            other verification method.
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={resendCode}
                          className="tesla-button text-brand-teal hover:text-brand-teal-dark text-sm flex items-center justify-center gap-1 mx-auto"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={verifyCode}
                      disabled={verificationCode.length !== 6 || isVerifying}
                      className="bg-white/10 text-white border border-white/20 text-white py-3 px-6 rounded-lg w-full text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Account
                          <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsCodeSent(false), setVerificationCode("");
                      }}
                      className="tesla-button w-full bg-brand-gray hover:bg-brand-gray/80 text-gray-700 py-3 px-6"
                    >
                      Change Verification Method
                    </button>
                  </div>
                </>
              )}

              {/* Security Note */}
              <div className="tesla-gradient-bg rounded-lg p-4 border border-brand-orange/10 mt-6">
                <p className="tesla-body text-gray-700 text-sm text-center">
                  <strong>Security:</strong> We'll never share your contact
                  information. This verification helps protect your account and
                  ensures you receive important solar installation updates.
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="tesla-heading text-2xl text-white mb-4">
                Account Verified!
              </h3>

              <p className="tesla-body text-gray-600 text-lg mb-6">
                Your account has been successfully verified. You can now access
                your personalized solar design.
              </p>

              <div className="tesla-gradient-bg rounded-lg p-4 border border-green-200">
                <p className="tesla-body text-green-700 text-sm">
                  ✓ Account secured and verified
                  <br />
                  ✓ Ready to receive installation updates
                  <br />✓ Access to your personalized solar dashboard
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container" />
    </div>
  );
};

export default VerificationModal;
