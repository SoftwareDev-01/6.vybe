import React, { memo, useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";

import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import logo from "../assets/logo.png";
import promoImage from "../assets/s.png";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  /**
   * 🔹 Submit handler
   */
  const handleSignIn = useCallback(async () => {
    if (!userName || !password || loading) return;

    setLoading(true);
    setErr("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [userName, password, loading, dispatch]);

  /**
   * 🔹 Enter key support
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSignIn();
    },
    [handleSignIn]
  );

  return (
    <div className="min-h-screen w-full flex bg-[#0f0f0f] text-white overflow-hidden">

      {/* ================= LEFT HALF ================= */}
      <div className="hidden lg:flex w-1/2 min-h-screen flex-col px-20 py-16">
        <div>
          <img src={logo} alt="Logo" className="w-14 mb-14" />

          <h1 className="text-[40px] font-normal leading-[48px] tracking-[-0.5px] max-w-[520px]">
            See everyday moments from your{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent font-medium">
              close friends.
            </span>
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden group">
            <img
              src={promoImage}
              alt="Promo"
              loading="lazy"
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
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col px-20 py-16">
        <div className="max-w-[520px]">

          <h2 className="text-[22px] font-medium mb-10">
            Log into Vybe
          </h2>

          {err && (
            <p className="text-red-500 text-[13px] text-center mb-4">
              {err}
            </p>
          )}

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Mobile number, username or email"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
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
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#71767b]"
              >
                {showPassword ? (
                  <IoIosEyeOff size={22} />
                ) : (
                  <IoIosEye size={22} />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="
              w-full h-[56px] mt-8
              bg-[#1d9bf0]
              text-[17px] font-semibold
              rounded-full
              hover:bg-[#1a8cd8]
              transition
              disabled:opacity-60
            "
          >
            {loading ? (
              <ClipLoader size={22} color="white" />
            ) : (
              "Log in"
            )}
          </button>

          <div className="mt-7">
            <button
              onClick={() => navigate("/forgot-password")}
              className="
                text-[16px]
                text-[#1d9bf0]
                hover:text-[#1a8cd8]
                transition
              "
            >
              Forgot password?
            </button>
          </div>

          <div className="flex items-center my-12">
            <div className="flex-grow h-px bg-[#2f3336]" />
            <span className="px-5 text-[13px] text-[#71767b]">OR</span>
            <div className="flex-grow h-px bg-[#2f3336]" />
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="
              w-full h-[56px]
              border border-[#2f3336]
              rounded-full
              text-[16px]
              font-medium
              hover:bg-[#1a1a1a]
              transition
            "
          >
            Create new account
          </button>

          <div className="mt-14 flex justify-center text-[12px] text-[#71767b]">
            © 2026 Meta
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SignIn);
