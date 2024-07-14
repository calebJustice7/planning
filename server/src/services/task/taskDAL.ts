import { FilterQuery } from "mongoose";
import { FindQuery } from "../../types/findQuery";
import { Task, TaskFull } from "../../types/task";
import Tasks from "./task";

const createTask = async (task: Task) => {
    const newTask = new Tasks(task);

    return await newTask.save();
};

const findTasks = async (query: FindQuery) => {
    const usersFn = Tasks.find(query.where)
        .skip(query.page * query.pageSize)
        .sort(query.sort);

    return await usersFn;
};

const updateTask = async (query: FilterQuery<TaskFull>, task: Partial<TaskFull>) => {
    return await Tasks.updateOne(query, task);
};

export default {
    createTask,
    findTasks,
    updateTask,
};
