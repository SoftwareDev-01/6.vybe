import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";

import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import logo from "../assets/logo.png";
import promoImage from "../assets/s1.png";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = async () => {
    if (!name || !userName || !email || !password) return;

    setLoading(true);
    setErr("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#0f0f0f] text-white overflow-hidden">

      {/* ================= LEFT HALF ================= */}
      <div className="hidden lg:flex w-1/2 h-full flex-col px-20 py-16">

        {/* Logo + Text */}
        <div>
          <img src={logo} alt="Logo" className="w-14 mb-14" />

          <h1 className="text-[40px] font-normal leading-[48px] tracking-[-0.5px] max-w-[520px]">
            Join today and share moments with your{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent font-medium">
              close friends.
            </span>
          </h1>
        </div>

        {/* Center Image (RESIZED — NO SCROLL) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden group">
            <img
              src={promoImage}
              alt="Promo"
              className="
                w-full h-full
                max-h-[48vh]
                object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-105
              "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* ================= RIGHT HALF ================= */}
      <div className="w-full lg:w-1/2 h-full flex flex-col px-8 sm:px-12 md:px-20 py-16">

        <div className="max-w-[520px]">

          <h2 className="text-[22px] font-medium mb-10">
            Create your account
          </h2>

          {err && (
            <p className="text-red-500 text-[13px] text-center mb-4">
              {err}
            </p>
          )}

          {/* INPUTS */}
          <div className="space-y-5">

            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full h-[56px] px-6
                bg-[#0f1419]
                border border-[#2f3336]
                rounded-full
                text-[16px]
                placeholder-[#71767b]
                outline-none
                focus:border-[#1d9bf0]
              "
            />

            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="
                w-full h-[56px] px-6
                bg-[#0f1419]
                border border-[#2f3336]
                rounded-full
                text-[16px]
                placeholder-[#71767b]
                outline-none
                focus:border-[#1d9bf0]
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full h-[56px] px-6
                bg-[#0f1419]
                border border-[#2f3336]
                rounded-full
                text-[16px]
                placeholder-[#71767b]
                outline-none
                focus:border-[#1d9bf0]
              "
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full h-[56px] px-6 pr-16
                  bg-[#0f1419]
                  border border-[#2f3336]
                  rounded-full
                  text-[16px]
                  placeholder-[#71767b]
                  outline-none
                  focus:border-[#1d9bf0]
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#71767b] cursor-pointer"
              >
                {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
            </div>
          </div>

          {/* SIGN UP BUTTON */}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="
              w-full h-[56px] mt-8
              bg-[#1d9bf0]
              text-[17px] font-semibold
              rounded-full
              hover:bg-[#1a8cd8]
              transition
              disabled:opacity-60
              cursor-pointer
            "
          >
            {loading ? <ClipLoader size={22} color="white" /> : "Sign up"}
          </button>

          {/* TERMS */}
          <p className="text-[14px] text-[#71767b] mt-6 leading-relaxed">
            By signing up, you agree to our{" "}
            <span className="text-[#1d9bf0]">Terms</span>,{" "}
            <span className="text-[#1d9bf0]">Privacy Policy</span> and{" "}
            <span className="text-[#1d9bf0]">Cookies Policy</span>.
          </p>

          {/* LOGIN LINK */}
          <div className="mt-10">
            <button
              onClick={() => navigate("/signin")}
              className="text-[16px] text-[#1d9bf0] cursor-pointer"
            >
              Already have an account ? Log in
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-14 flex justify-center text-[12px] text-[#71767b]">
            © 2026 Meta
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignUp;
