import { z } from "zod";
import { AsyncRequestHandler, asyncErrorWrapper } from "../../error/errorWrapper";
import {
    createTaskValidator,
    findTasksValidator,
    getTaskByDateValidator,
    updateTaskStatusValidator,
} from "./taskValidators";
import { createTask, findCalendarTasks, getTaskByDate, updateTask } from "./taskServices";
import { HttpStatusCode } from "../../consts/HttpStatusCodes";
import toObjectId from "../../helpers/toObjectId";

const createTaskController: AsyncRequestHandler = async (req, res) => {
    const { body } = req as unknown as z.infer<typeof createTaskValidator>;

    const task = await createTask({ ...body, user_id: toObjectId(res.locals.user._id) });

    res.status(HttpStatusCode.OK).json({ task });
};

const getTasksController: AsyncRequestHandler = async (req, res) => {
    const { query } = req as unknown as z.infer<typeof findTasksValidator>;

    const tasks = await findCalendarTasks(query.previousMonth, query.nextMonth, res.locals.user._id);

    res.status(HttpStatusCode.OK).json({ tasks: tasks });
};

const updateTaskStatusController: AsyncRequestHandler = async (req, res) => {
    const { params, body } = req as unknown as z.infer<typeof updateTaskStatusValidator>;

    const tasks = await updateTask(
        { _id: toObjectId(params.id), user_id: toObjectId(res.locals.user._id) },
        { completed: body.value, ...(body.value === true ? { completed_on: new Date() } : {}) },
    );

    res.status(HttpStatusCode.OK).json({ tasks: tasks });
};

const getTaskByDateController: AsyncRequestHandler = async (req, res) => {
    const { query } = req as unknown as z.infer<typeof getTaskByDateValidator>;

    const tasks = await getTaskByDate(new Date(query.dateStart), new Date(query.dateEnd), res.locals.user._id);

    res.status(HttpStatusCode.OK).json(tasks);
};

export default {
    createTaskController: asyncErrorWrapper(createTaskController),
    getTasksController: asyncErrorWrapper(getTasksController),
    updateTaskStatusController: asyncErrorWrapper(updateTaskStatusController),
    getTaskByDateController: asyncErrorWrapper(getTaskByDateController),
};
