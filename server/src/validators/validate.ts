import { RequestHandler } from "express";
import { z } from "zod";
import { HttpStatusCode } from "../consts/HttpStatusCodes";

export const validate =
    (schema: z.AnyZodObject): RequestHandler =>
    (req, res, next) => {
        try {
            const validated = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (validated.body) {
                req.body = validated.body;
            }
            if (validated.query) {
                req.query = validated.query;
            }
            if (validated.params) {
                req.params = validated.params;
            }

            next();
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(HttpStatusCode.BAD_REQUEST).send(err.errors);
            } else {
                return res.status(HttpStatusCode.BAD_REQUEST).send("Validation Error");
            }
        }
    };
