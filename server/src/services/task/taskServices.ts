import { FilterQuery } from "mongoose";
import toObjectId from "../../helpers/toObjectId";
import { Task, TaskFull } from "../../types/task";
import taskDAL from "./taskDAL";

export const createTask = async (task: Task) => {
    return await taskDAL.createTask(task);
};

export const findCalendarTasks = async (previousMonth: Date, nextMonth: Date, user_id: string | ObjectId) => {
    return await taskDAL.findTasks({
        where: {
            user_id: toObjectId(user_id),
            $and: [{ selected_date: { $gte: previousMonth } }, { selected_date: { $lte: nextMonth } }],
            selected_date_type: "day",
        },
        page: 1,
        pageSize: 0,
    });
};

export const updateTask = async (query: FilterQuery<TaskFull>, update: Partial<Task>) => {
    return await taskDAL.updateTask(query, update);
};

export const getTaskByDate = async (dateStart: Date, dateEnd: Date, user_id: string | ObjectId) => {
    return taskDAL.findTasks({
        where: {
            $and: [
                { user_id: toObjectId(user_id) },
                { selected_date: { $gte: dateStart } },
                { selected_date: { $lte: dateEnd } },
            ],
        },
        page: 1,
        pageSize: 0,
    });
};
