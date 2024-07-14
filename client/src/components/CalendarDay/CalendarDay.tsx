import { TaskFull } from "../../types/task";
import { formatAMPM } from "../../utils/date";
import { Tooltip } from "react-tooltip";

interface CalendarDayProps {
    task: TaskFull;
    handleDblClick: (id: string, completed: boolean) => void;
    handleClick: (task: TaskFull) => void;
}

function CalendarDay({ task, handleDblClick, handleClick }: CalendarDayProps) {
    return (
        <div
            style={task.completed ? { backgroundColor: task.color } : { border: `1px solid ${task.color}` }}
            onClick={(e) => {
                e.stopPropagation();
                handleClick(task);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                handleDblClick(task._id, task.completed);
            }}
            className="rounded-md px-1.5 py-[3px] mt-1"
            data-tooltip-id={task._id + "-tooltip"}
            data-tooltip-content={task.name}
        >
            {task.has_selected_time && (
                <div
                    className={`text-xs text-nowrap mr-1 font-extralight float-left ${
                        task.completed ? "text-black" : "text-white"
                    }`}
                >
                    {formatAMPM(task.selected_date)} -
                </div>
            )}
            <div className={`text-xs text-black line-clamp-1 ${task.completed ? "text-black" : "text-white"}`}>
                {task.name}
            </div>
            <Tooltip id={task._id + "-tooltip"} opacity={1} style={{ zIndex: 20, fontSize: "12px" }} />
        </div>
    );
}

export default CalendarDay;
