"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, User, ShieldCheck, ArrowRight } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpForm() {
    const router = useRouter();
    const { signUp, isLoaded, setActive } = useSignUp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid },
        watch,
        trigger,
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) return;

        setIsSubmitting(true);
        setAuthError(null);
        setSuccessMessage(null);

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setSuccessMessage("Verification code sent to your email!");
            setVerifying(true);
        } catch (error: any) {
            console.error("Sign-up error:", error);
            setAuthError(
                error.errors?.[0]?.message ||
                "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded || !signUp) return;

        setIsSubmitting(true);
        setVerificationError(null);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                console.error("Verification incomplete:", result);
                setVerificationError(
                    "Verification could not be completed. Please try again."
                );
            }
        } catch (error: any) {
            console.error("Verification error:", error);
            setVerificationError(
                error.errors?.[0]?.message ||
                "An unexpected error occurred during verification. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (signUp) {
            try {
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
                setSuccessMessage("New verification code sent to your email!");
                setVerificationError(null);
            } catch (error: any) {
                console.error("Resend error:", error);
                setVerificationError(
                    error.errors?.[0]?.message ||
                    "Failed to resend verification code. Please try again."
                );
            }
        }
    };

    if (verifying) {
        return (
            <div className="w-full max-w-md mx-auto">
                <Card className="w-full border-0 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-2xl shadow-primary-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/15">
                    <CardHeader className="flex flex-col gap-1 items-center pb-2 pt-8">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-primary-600" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Verify Your Email
                        </h1>
                        <p className="text-default-500 text-center px-4">
                            We've sent a verification code to your email address
                        </p>
                    </CardHeader>

                    <Divider className="opacity-30" />

                    <CardBody className="py-6 px-6">
                        {verificationError && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 p-4 rounded-xl mb-6 flex items-start gap-3 animate-pulse">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{verificationError}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-success-50 border border-success-200 text-success-700 p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in">
                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{successMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleVerificationSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="verificationCode"
                                    className="text-sm font-semibold text-default-700"
                                >
                                    Verification Code
                                </label>
                                <Input
                                    id="verificationCode"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full text-lg tracking-widest text-center py-6"
                                    autoFocus
                                    isInvalid={!!verificationError}
                                    size="lg"
                                />
                            </div>

                            <Button
                                type="submit"
                                color="primary"
                                className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                isLoading={isSubmitting}
                                endContent={<ArrowRight className="h-5 w-5" />}
                            >
                                {isSubmitting ? "Verifying..." : "Verify & Continue"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-default-500">
                                Didn't receive a code?{" "}
                                <button
                                    onClick={handleResendCode}
                                    disabled={isSubmitting}
                                    className="text-primary hover:underline font-semibold transition-colors"
                                >
                                    Resend code
                                </button>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="w-full border-0 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-2xl shadow-primary-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/15">
                <CardHeader className="flex flex-col gap-1 items-center pb-2 pt-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Create Your Account
                    </h1>
                    <p className="text-default-500 text-center px-4">
                        Join our community and start managing your images securely
                    </p>
                </CardHeader>

                <Divider className="opacity-30" />

                <CardBody className="py-6 px-6">
                    {authError && (
                        <div className="bg-danger-50 border border-danger-200 text-danger-700 p-4 rounded-xl mb-6 flex items-start gap-3 animate-pulse">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{authError}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-success-50 border border-success-200 text-success-700 p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in">
                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold text-default-700"
                            >
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                startContent={<Mail className="h-4 w-4 text-default-500" />}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                                {...register("email")}
                                className="w-full"
                                size="lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-default-700"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                startContent={<Lock className="h-4 w-4 text-default-500" />}
                                endContent={
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        type="button"
                                        className="data-[hover=true]:bg-transparent"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-default-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-default-500" />
                                        )}
                                    </Button>
                                }
                                isInvalid={!!errors.password}
                                errorMessage={errors.password?.message}
                                {...register("password")}
                                className="w-full"
                                size="lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="passwordConfirmation"
                                className="text-sm font-semibold text-default-700"
                            >
                                Confirm Password
                            </label>
                            <Input
                                id="passwordConfirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                startContent={<Lock className="h-4 w-4 text-default-500" />}
                                endContent={
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        type="button"
                                        className="data-[hover=true]:bg-transparent"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-default-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-default-500" />
                                        )}
                                    </Button>
                                }
                                isInvalid={!!errors.passwordConfirmation}
                                errorMessage={errors.passwordConfirmation?.message}
                                {...register("passwordConfirmation")}
                                className="w-full"
                                size="lg"
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <ShieldCheck className="h-4 w-4 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-default-700">
                                        Secure Account
                                    </p>
                                    <p className="text-xs text-default-500">
                                        Your password must be at least 8 characters with numbers & symbols
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            color="primary"
                            className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            isLoading={isSubmitting}
                            endContent={<ArrowRight className="h-5 w-5" />}
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardBody>

                <Divider className="opacity-30" />

                <CardFooter className="flex flex-col gap-4 py-6">
                    <p className="text-sm text-default-600 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="text-primary hover:underline font-semibold transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                    <p className="text-xs text-default-400 text-center">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
