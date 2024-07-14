import { useMemo } from "react";
import { useCalendarStore } from "../../state/useCalendarStore";
import { dateString, getBeginningOfDay, isCurrentDay, getEndOfDay, formatAMPM, addMinutes } from "../../utils/date";
import { useGetTasksForDate, useUpdateTaskStatus } from "../../queries/Task";
import { TaskFull } from "../../types/task";

interface TaskListProps extends React.HTMLAttributes<HTMLDivElement> {
    hideDate?: boolean;
}

function TaskList({ hideDate, ...rest }: TaskListProps) {
    const selectedDate = useCalendarStore((state) => state.selectedDate);
    const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
    const updateTaskStatus = useUpdateTaskStatus();

    const getTaskForDateQuery = useMemo(() => {
        return { dateStart: getBeginningOfDay(selectedDate), dateEnd: getEndOfDay(selectedDate) };
    }, [selectedDate]);
    const query = useGetTasksForDate(getTaskForDateQuery);

    const getTimeString = (date: string | Date, duration?: number) => {
        if (duration) {
            return formatAMPM(date) + " - " + formatAMPM(addMinutes(new Date(date), duration));
        }
        return formatAMPM(date);
    };

    const getTaskStatus = (task: TaskFull) => {
        if (task.completed) {
            return "Completed";
        }
        if (new Date(task.selected_date) < new Date()) {
            return "Overdue";
        }
        return "Upcoming";
    };

    const getTaskColor = (task: TaskFull) => {
        if (task.completed) {
            return "text-green-400";
        }
        if (new Date(task.selected_date) < new Date()) {
            return "text-rose-400";
        }
        return "text-indigo-400";
    };

    const toggleCompleted = async (id: string, completed: boolean) => {
        await updateTaskStatus.mutateAsync({ id, value: !completed });
    };

    return (
        <div {...rest}>
            {!hideDate && (
                <div className="flex items-end justify-center mt-4">
                    {isCurrentDay(selectedDate) && <div className="text-xl text-secondary">Today</div>}
                    <div
                        className={`  ${
                            !isCurrentDay(selectedDate)
                                ? "text-xl text-secondary mr-3"
                                : "font-light text-slate-400 text-md ml-3"
                        }`}
                    >
                        {dateString(selectedDate)}
                    </div>
                    {!isCurrentDay(selectedDate) && (
                        <div
                            onClick={() => setSelectedDate(new Date())}
                            className="btn btn-neutral text-xs py-1 shadow-md h-fit min-h-fit px-2.5 ml-1"
                        >
                            View Today
                        </div>
                    )}
                </div>
            )}
            <div className="mt-6">
                {(query.data || [])
                    .sort((a, b) => (!b.has_selected_time ? 1 : a.selected_date > b.selected_date ? 1 : -1))
                    .map((task) => (
                        <div key={task._id} className="mx-4 my-4">
                            <div className="flex items-end justify-between text-[12px] mb-[4px]">
                                <div className="text-slate-400">
                                    {task.has_selected_time
                                        ? getTimeString(task.selected_date, task.duration_in_minutes)
                                        : "No time set"}
                                </div>
                            </div>

                            <div key={task._id} className="rounded-[5px] p-2 px-3 bg-slate-800">
                                <div className="text-[13px] font-light leading-5 text-slate-300">{task.name}</div>
                                <div className="text-[11px] font-light leading-5 text-slate-400">{task.notes}</div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-normal leading-5 ${getTaskColor(task)}`}>
                                        {getTaskStatus(task)}
                                    </span>

                                    <div
                                        onClick={() => toggleCompleted(task._id, task.completed)}
                                        className="text-info text-[11px] cursor-pointer"
                                    >
                                        {!task.completed ? "Mark Complete" : "Mark Incomplete"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default TaskList;
