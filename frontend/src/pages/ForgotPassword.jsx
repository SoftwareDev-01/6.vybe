import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import promoImage from "../assets/s2.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  /* ================= HANDLERS ================= */

  const handleStep1 = async () => {
    setLoading(true);
    setErr("");
    try {
      await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true }
      );
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) return setErr("Enter full OTP");

    setLoading(true);
    setErr("");
    try {
      await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email, otp: otpValue },
        { withCredentials: true }
      );
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (newPassword !== confirmNewPassword) {
      return setErr("Passwords do not match");
    }

    setLoading(true);
    setErr("");
    try {
      await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT HANDLING ================= */

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full flex bg-[#0f0f0f] text-white overflow-hidden">

      {/* ================= LEFT HALF ================= */}
      <div className="hidden lg:flex w-1/2 h-full flex-col px-20 py-16">
        <div>
          <img src={logo} alt="Logo" className="w-14 mb-14" />
          <h1 className="text-[40px] font-normal leading-[48px] tracking-[-0.5px] max-w-[520px]">
            Secure your account and reconnect with your{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent font-medium">
              close friends.
            </span>
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden">
            <img
              src={promoImage}
              alt="Promo"
              className="w-full h-full max-h-[48vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* ================= RIGHT HALF (CENTERED FORM) ================= */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-8 sm:px-12 md:px-20">

        <div className="max-w-[420px] w-full animate-fadeSlide">

          <h2 className="text-[22px] font-medium mb-8 text-center">
            {step === 1 && "Forgot password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset password"}
          </h2>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <AuthInput
                placeholder="Email address"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <PrimaryButton loading={loading} text="Send OTP" onClick={handleStep1} />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="flex justify-between mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="
                      w-14 h-14
                      bg-[#0f1419]
                      border border-[#2f3336]
                      rounded-xl
                      text-center text-[18px]
                      outline-none
                      focus:border-[#1d9bf0]
                    "
                  />
                ))}
              </div>
              <PrimaryButton loading={loading} text="Verify OTP" onClick={handleStep2} />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <AuthInput
                placeholder="New password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />
              <AuthInput
                placeholder="Confirm password"
                type="password"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
              />
              <PrimaryButton loading={loading} text="Reset password" onClick={handleStep3} />
            </>
          )}

          {err && (
            <p className="text-red-500 text-[13px] text-center mt-4">
              {err}
            </p>
          )}

          {/* BACK TO LOGIN */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-[18px] text-[#1d9bf0] cursor-pointer"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>

      {/* ANIMATION STYLES */}
      <style>{`
        .animate-fadeSlide {
          animation: fadeSlide 0.35s ease-out;
        }
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function AuthInput({ placeholder, type, value, onChange }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full h-[56px] px-6 mb-5
        bg-[#0f1419]
        border border-[#2f3336]
        rounded-full
        text-[16px]
        placeholder-[#71767b]
        outline-none
        focus:border-[#1d9bf0]
      "
    />
  );
}

function PrimaryButton({ text, onClick, loading }) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className="
        w-full h-[56px]
        bg-[#1d9bf0]
        text-[17px] font-semibold
        rounded-full
        hover:bg-[#1a8cd8]
        transition
        disabled:opacity-60
        flex items-center justify-center
        cursor-pointer
      "
    >
      {loading ? <ClipLoader size={22} color="white" /> : text}
    </button>
  );
}

export default ForgotPassword;
