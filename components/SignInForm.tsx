"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mail, Lock, AlertCircle, Eye, EyeOff, LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
    const router = useRouter();
    const { signIn, isLoaded, setActive } = useSignIn();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const identifier = watch("identifier");
    const password = watch("password");

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        if (!isLoaded) return;

        setIsSubmitting(true);
        setAuthError(null);
        setSuccessMessage(null);

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password,
            });

            if (result.status === "complete") {
                setSuccessMessage("Welcome back! Redirecting...");
                await setActive({ session: result.createdSessionId });
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);
            } else {
                console.error("Sign-in incomplete:", result);
                setAuthError("Sign-in could not be completed. Please try again.");
            }
        } catch (error: any) {
            console.error("Sign-in error:", error);
            setAuthError(
                error.errors?.[0]?.message ||
                "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="w-full border-0 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-2xl shadow-primary-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/15">
                <CardHeader className="flex flex-col gap-1 items-center pb-2 pt-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <LogIn className="h-8 w-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-default-500 text-center px-4">
                        Sign in to access your secure cloud storage
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
                            <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="identifier"
                                className="text-sm font-semibold text-default-700"
                            >
                                Email Address
                            </label>
                            <Input
                                id="identifier"
                                type="email"
                                placeholder="you@example.com"
                                startContent={<Mail className="h-4 w-4 text-default-500" />}
                                isInvalid={!!errors.identifier}
                                errorMessage={errors.identifier?.message}
                                {...register("identifier")}
                                className="w-full"
                                size="lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-default-700"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-primary border-default-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="remember" className="text-sm text-default-600">
                                Remember me
                            </label>
                        </div>

                        <Button
                            type="submit"
                            color="primary"
                            className="w-full py-6 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            isLoading={isSubmitting}
                            endContent={<ArrowRight className="h-5 w-5" />}
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </CardBody>

                <Divider className="opacity-30" />

                <CardFooter className="flex flex-col gap-4 py-6">
                    <p className="text-sm text-default-600 text-center">
                        Don't have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="text-primary hover:underline font-semibold transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-default-400">
                        <span>•</span>
                        <span>Secure login</span>
                        <span>•</span>
                        <span>2FA supported</span>
                        <span>•</span>
                        <span>Encrypted</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}