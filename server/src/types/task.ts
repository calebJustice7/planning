export interface Task {
    name: string;
    user_id: ObjectId | string;
    selected_date: Date;
    selected_date_type: "month" | "week" | "day";
    duration_in_minutes?: number;
    has_selected_time: boolean;
    color: string;
    notes: string;
    completed: boolean;
    completed_on?: Date;
    repeat?: {
        repeat_type: "month" | "day";
        value: number;
        last?: boolean;
    };
}

export interface TaskFull extends Task, Doc {}
