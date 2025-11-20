import * as z from "zod";

export const signUpSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, { message: "Name must be at least 2 characters long" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),

        email: z
            .string()
            .trim()
            .email({ message: "Please enter a valid email address" })
            .max(40, { message: "Email must not exceed 40 characters" }),

        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(15, { message: "Password must not exceed 15 characters" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            }),

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

