"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (formData.password !== formData.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      await signUp.create({
        username: formData.username,
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("verify");
    } catch (e: any) {
      setErr(e?.errors?.[0]?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const handleVerify = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErr("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setErr("Invalid or expired code.");
      }
    } catch (e: any) {
      setErr(e?.errors?.[0]?.message || "Invalid code.");
    }

    setLoading(false);
  };

  if (step === "verify") {
    return (
      <div
        className="
          w-full max-w-md bg-white border border-gray-200 
          rounded-2xl p-8 shadow-[0_12px_35px_rgba(15,23,42,0.10)]
        "
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verify your email
        </h2>
        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Enter the verification code we sent to your email.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            className="
              w-full p-3 rounded-lg bg-gray-50 border border-gray-300 
              text-gray-900 text-sm focus:outline-none 
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400
            "
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            className="
              bg-indigo-600 text-white w-full py-3 
              rounded-lg font-semibold text-sm 
              hover:bg-indigo-700 shadow-md hover:shadow-lg transition
            "
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {err && (
            <p className="text-red-500 text-sm text-center">{err}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      className="
        w-full max-w-md bg-white border border-gray-200 
        rounded-2xl p-8 shadow-[0_12px_35px_rgba(15,23,42,0.10)]
      "
    >
      <div className="flex justify-center mb-4">
        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <User className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-gray-900">
        Create your account
      </h1>
      <p className="text-gray-500 text-sm text-center mt-2 mb-8">
        Start your secure journey with DropVault.
      </p>

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              className="
                w-full pl-10 pr-3 py-2.5 rounded-lg 
                bg-gray-50 border border-gray-300 
                text-gray-900 text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 transition
              "
              placeholder="yourname"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="email"
              className="
                w-full pl-10 pr-3 py-2.5 rounded-lg 
                bg-gray-50 border border-gray-300 
                text-gray-900 text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 transition
              "
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="
                w-full pl-10 pr-9 py-2.5 rounded-lg 
                bg-gray-50 border border-gray-300 
                text-gray-900 text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 transition
              "
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 p-1 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              className="
                w-full pl-10 pr-9 py-2.5 rounded-lg 
                bg-gray-50 border border-gray-300 
                text-gray-900 text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 transition
              "
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2.5 top-2.5 p-1 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="
            bg-indigo-600 text-white w-full py-3 rounded-lg 
            font-semibold hover:bg-indigo-700 
            shadow-md hover:shadow-lg transition
          "
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {err && (
          <p className="text-red-500 text-sm text-center">{err}</p>
        )}
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-indigo-600 font-medium hover:underline"
        >
          Sign In
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-3">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Encrypted. Private. Secure by design.</span>
      </div>
    </div>
  );
}
