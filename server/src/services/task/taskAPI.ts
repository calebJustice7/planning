import express from "express";
import taskC from "./taskControllers";
import { validate } from "../../validators/validate";
import authMiddleware from "../../auth/authMiddleware";
import {
    createTaskValidator,
    findTasksValidator,
    getTaskByDateValidator,
    updateTaskStatusValidator,
} from "./taskValidators";

const router = express.Router();

router.post("/", authMiddleware("create", "task"), validate(createTaskValidator), taskC.createTaskController);

router.patch(
    "/status/:id",
    authMiddleware("update", "task"),
    validate(updateTaskStatusValidator),
    taskC.updateTaskStatusController,
);

router.get("/calendar", authMiddleware("read", "task"), validate(findTasksValidator), taskC.getTasksController);

router.get("/date", authMiddleware("read", "task"), validate(getTaskByDateValidator), taskC.getTaskByDateController);

export default router;
