import { z } from "zod";

export const createTaskValidator = z.object({
    body: z.object({
        name: z.string().min(1).max(200),
        duration_in_minutes: z.number().optional(),
        has_selected_time: z.boolean().default(false),
        completed: z.boolean().default(false),
        selected_date: z.coerce.date(),
        selected_date_type: z.enum(["month", "week", "day"]),
        color: z.string().min(1),
        notes: z.string().max(5000),
        repeat: z
            .object({
                repeat_type: z.enum(["month", "day"]),
                value: z.number(),
                last: z.boolean().optional(),
            })
            .optional(),
    }),
});

export const findTasksValidator = z.object({
    query: z.object({
        previousMonth: z.string().pipe(z.coerce.date()),
        nextMonth: z.string().pipe(z.coerce.date()),
    }),
});

export const updateTaskStatusValidator = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        value: z.boolean(),
    }),
});

export const getTaskByDateValidator = z.object({
    query: z.object({
        dateStart: z.string(),
        dateEnd: z.string(),
    }),
});
