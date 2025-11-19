import * as z from "zod";

export const signUpSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name must be at least 3 characters long" }),

    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),

    passwordConfirmation: z
        .string()
        .min(1, { message: "Please confirm your password" }),
})
    .refine(
        (data) => data.password === data.passwordConfirmation,
        {
            message: "Passwords do not match",
            path: ["passwordConfirmation"],
        }
    );
