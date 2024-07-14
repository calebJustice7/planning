import mongoose, { Schema } from "mongoose";
import { TaskFull } from "../../types/task";

const repeatSchema = new Schema<TaskFull["repeat"]>({
    repeat_type: {
        type: String,
        enum: ["month", "day"],
        required: true,
    },
    value: { type: Number, required: true },
    last: { type: Boolean, required: false },
});

const TasksSchema = new Schema<TaskFull>({
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    has_selected_time: { type: Boolean, default: false },
    duration_in_minutes: { type: Number, required: false },
    completed: { type: Boolean, default: () => false },
    completed_on: { type: Date, required: false },
    selected_date: { type: Date, required: true },
    selected_date_type: { type: String, enum: ["month", "week", "day"], required: true },
    color: { type: String, required: true },
    notes: { type: String, default: () => "" },
    repeat: {
        _id: false,
        type: repeatSchema,
        required: false,
    },
});

const Tasks = mongoose.model<TaskFull>("Tasks", TasksSchema);

export default Tasks;
