"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErr("");

    try {
      // Step 1: Create sign-in attempt
      const result = await signIn.create({
        identifier: formData.identifier,
      });

      // Step 2: Submit password
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
      setErr(e.errors?.[0]?.message || "Failed to sign in.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>

      <form onSubmit={handleSignIn}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email or Username"
          value={formData.identifier}
          onChange={(e) =>
            setFormData({ ...formData, identifier: e.target.value })
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

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {err && <p className="text-red-500 mt-2">{err}</p>}
      </form>
    </div>
  );
}
