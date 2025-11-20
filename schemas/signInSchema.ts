import * as z from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .max(40, { message: "Email must not exceed 40 characters" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(15, { message: "Password must not exceed 15 characters" }),
});
