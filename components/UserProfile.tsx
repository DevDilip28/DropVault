"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Mail, User, Shield} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const [uploading, setUploading] = useState(false);

    if (!isLoaded) {
        return (
            <div className="flex flex-col justify-center items-center p-16">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-gray-500">Loading your profile...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <Card className="max-w-md mx-auto border bg-white rounded-2xl shadow-md">
                <CardHeader className="flex gap-3">
                    <User className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold">User Profile</h2>
                </CardHeader>

                <Divider />

                <CardBody className="text-center py-10">
                    <Avatar name="Guest" size="lg" className="mx-auto mb-4" />

                    <p className="text-lg font-medium text-gray-800">Not Signed In</p>
                    <p className="text-gray-500 mt-2">
                        Please sign in to view your profile.
                    </p>

                    <Button
                        color="primary"
                        className="mt-6 px-8"
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign In
                    </Button>
                </CardBody>
            </Card>
        );
    }

    const username = user.username || "User";
    const email = user.primaryEmailAddress?.emailAddress || "";
    const initials = username[0]?.toUpperCase() || "U";
    const emailVerified =
        user.emailAddresses?.[0]?.verification?.status === "verified";

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await user.setProfileImage({ file });
        } catch (error) {
            console.error(error);
        }
        setUploading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    };

    const handleRemoveImage = async () => {
        setUploading(true);
        try {
            await user.setProfileImage({ file: null });
        } catch (error) {
            console.error(error);
        }
        setUploading(false);
    };

    return (
        <Card className="max-w-lg mx-auto border bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <CardHeader className="flex gap-3">
                <User className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
            </CardHeader>

            <Divider />

            <CardBody className="py-8">
                <div className="flex flex-col items-center text-center mb-6">
                    {/* Avatar */}
                    <Avatar
                        src={user.imageUrl || undefined}
                        name={initials}
                        size="lg"
                        className="h-24 w-24 rounded-full shadow-md mb-4 text-xl"
                    />

                    <h3 className="text-2xl font-semibold text-gray-900">{username}</h3>

                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                        <span>{email}</span>
                    </div>

                    {/* Buttons side by side */}
                    <div className="flex gap-4 mt-5">
                        {/* Replace Image */}
                        <label className="cursor-pointer">
                            <div
                                className="
                                px-5 px-5 py-2 rounded-lg 
                                bg-slate-700 text-white font-medium 
                                hover:bg-slate-800 transition-colors shadow-sm

                                "
                            >
                                {uploading ? "Uploading..." : "Add Image"}
                            </div>
                            <input type="file" hidden onChange={handleImageUpload} />
                        </label>

                        {/* Remove Image */}
                        {user.imageUrl && (
                            <button
                                onClick={handleRemoveImage}
                                disabled={uploading}
                                className="
                                    px-5 py-2 rounded-lg 
                                    bg-red-500 text-white font-medium
                                    hover:bg-red-600 transition-colors shadow-sm
                                    disabled:opacity-50
                                "
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Shield className="h-5 w-5 text-indigo-600" />
                            <span className="font-medium">Account Status</span>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Active
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-5 w-5 text-indigo-600" />
                            <span className="font-medium">Email Verification</span>
                        </div>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${emailVerified
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {emailVerified ? "Verified" : "Pending"}
                        </span>
                    </div>
                </div>
            </CardBody>

            <Divider />

            <CardFooter>
                <Button
                    className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </CardFooter>
        </Card>
    );
}
