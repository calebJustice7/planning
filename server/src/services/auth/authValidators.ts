import { z } from "zod";

export const googleCallbackValidator = z.object({
    query: z.object({
        code: z.string().min(1),
        scope: z.string().min(1),
        authuser: z.string().min(1),
        prompt: z.string().min(1),
        state: z.string().optional(),
    }),
});

export const generateGoogleUrlValidator = z.object({
    query: z.object({
        redirect: z.string().optional(),
    }),
});
