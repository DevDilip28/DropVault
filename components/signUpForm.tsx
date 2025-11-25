"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState<"form" | "verify">("form");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // CREATE ACCOUNT
  // ----------------------------
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
      const result = await signUp.create({
        username: formData.username,
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep("verify");
    } catch (e: any) {
      setErr(e.errors?.[0]?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  // ----------------------------
  // VERIFY EMAIL CODE
  // ----------------------------
  const handleVerify = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErr("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setErr("Invalid or expired code.");
      }
    } catch (e: any) {
      setErr(e.errors?.[0]?.message || "Invalid code.");
    }

    setLoading(false);
  };

  // ----------------------------
  // VERIFY PAGE
  // ----------------------------
  if (step === "verify") {
    return (
      <div className="max-w-md mx-auto p-6 border rounded bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Verify your email</h2>

        <form onSubmit={handleVerify}>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white w-full py-2 rounded"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {err && <p className="text-red-500 mt-2">{err}</p>}
        </form>
      </div>
    );
  }

  // ----------------------------
  // SIGNUP PAGE
  // ----------------------------
  return (
    <div className="max-w-md mx-auto p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {err && <p className="text-red-500 mt-2">{err}</p>}
      </form>
    </div>
  );
}
