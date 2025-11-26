"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErr("");

    try {
      await signIn.create({
        identifier: formData.identifier,
      });

      const finalResult = await signIn.attemptFirstFactor({
        strategy: "password",
        password: formData.password,
      });

      if (finalResult.status === "complete") {
        await setActive({ session: finalResult.createdSessionId });
        router.push("/dashboard");
      } else {
        setErr("Invalid credentials.");
      }
    } catch (e: any) {
      setErr(e?.errors?.[0]?.message || "Failed to sign in.");
    }

    setLoading(false);
  };

  return (
    <div
      className="
        w-full max-w-md 
        bg-white 
        border border-gray-200 
        rounded-2xl 
        p-8 
        shadow-[0_12px_35px_rgba(15,23,42,0.10)]
      "
    >
      <div className="flex justify-center mb-4">
        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Lock className="h-5 w-5 text-indigo-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 text-center">
        Sign in to DropVault
      </h1>
      <p className="text-gray-500 text-sm text-center mt-2 mb-8">
        Access your private, organized cloud vault in seconds.
      </p>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email or Username
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              className="
                w-full pl-10 pr-3 py-2.5 
                rounded-lg 
                border border-gray-300 
                bg-gray-50
                text-gray-900 text-sm
                focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500
                transition
              "
              placeholder="you@example.com"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
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
                w-full pl-10 pr-9 py-2.5 
                rounded-lg 
                border border-gray-300 
                bg-gray-50
                text-gray-900 text-sm
                focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500
                transition
              "
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute right-2.5 top-2.5 
                p-1 rounded-md 
                text-gray-400 hover:text-gray-600 
                transition
              "
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="
            w-full 
            bg-indigo-600 text-white 
            py-3 rounded-lg 
            font-semibold text-sm
            hover:bg-indigo-700 
            shadow-md hover:shadow-lg 
            transition-all
          "
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {err && (
          <p className="text-red-500 text-sm text-center mt-2">{err}</p>
        )}
      </form>

      <div className="mt-6 space-y-3">
        <p className="text-center text-xs text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>End-to-end encrypted • Your files stay yours</span>
        </div>
      </div>
    </div>
  );
}
