import * as z from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
