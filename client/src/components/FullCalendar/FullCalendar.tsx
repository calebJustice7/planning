import { useMemo } from "react";
import { CalendarMonthItem } from "../../hooks/useCalendar";
import { useGetCalendarTasks, useUpdateTaskStatus } from "../../queries/Task";
import { isCurrentDay, getPreviousMonth, getNextMonth, isSameDay } from "../../utils/date";
import { days, months } from "../../constants/calendar";
import { useApplicationStore } from "../../state/useApplicationStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useCalendarStore } from "../../state/useCalendarStore";
import CalendarDay from "../CalendarDay";
import { TaskFull } from "../../types/task";

interface FullCalendarProps {
    calendar: CalendarMonthItem[][];
    rowHeight: number;
    toggleTaskForm: (val: boolean, task?: TaskFull) => void;
}

function FullCalendar({ calendar, rowHeight, toggleTaskForm }: FullCalendarProps) {
    const sidebarExpanded = useApplicationStore((state) => state.sidebarExpanded);
    const calendarQuery = useCalendarStore((state) => state.calendarQuery);
    const selectedDate = useCalendarStore((state) => state.selectedDate);
    const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
    const updateTaskStatus = useUpdateTaskStatus();

    const query = useGetCalendarTasks(calendarQuery);

    const calendarItems = useMemo(() => {
        return calendar.map((week) => {
            return week.map((day) => {
                const tasks = (query.data?.tasks || []).filter((task) => {
                    const taskDate = new Date(task.selected_date);
                    if (isSameDay(taskDate, day.date)) {
                        return true;
                    } else return false;
                });

                return {
                    ...day,
                    tasks: tasks.sort((a, b) =>
                        !b.has_selected_time ? 1 : a.selected_date > b.selected_date ? 1 : -1,
                    ),
                };
            });
        });
    }, [calendar, query.data]);

    const getBorderClass = (weekIdx: number, dayIdx: number) => {
        if (weekIdx + 1 === calendar.length) {
            return dayIdx === 6 ? "border-slate-500" : "border-r border-slate-500";
        } else if (weekIdx === 0) {
            return dayIdx === 6
                ? "border-b border-slate-500 border-t border-t border-t-slate-400"
                : "border-b border-r border-t border-t-slate-400 border-slate-500";
        } else {
            return dayIdx === 6 ? "border-b border-slate-500" : "border-b border-r border-slate-500";
        }
    };

    const getTextClass = (day: CalendarMonthItem) => {
        if (isCurrentDay(day.date)) {
            return "text-black bg-accent rounded-full text-center w-5 h-5";
        }
        if (selectedDate.getDate() === day.date.getDate() && day.isCurrentMonth) {
            return "text-black bg-white rounded-full text-center w-5 h-5";
        }
        if (day.isCurrentMonth) return "text-slate-100 text-center w-5 h-5";
        return "text-slate-500 text-center w-5 h-5";
    };

    const toggleCompleted = async (id: string, completed: boolean) => {
        await updateTaskStatus.mutateAsync({ id, value: !completed });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between border-t border-slate-400 h-7">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={
                            "w-full select-none flex items-center justify-center relative " +
                            (idx !== 6 ? "border-r" : "")
                        }
                    >
                        {idx === 0 && !sidebarExpanded && (
                            <ChevronLeftIcon
                                className="text-white w-5 absolute left-1 cursor-pointer"
                                onClick={() => setSelectedDate(getPreviousMonth(selectedDate))}
                            />
                        )}
                        <span>{day.substring(0, 3)}</span>
                        {idx === 6 && !sidebarExpanded && (
                            <ChevronRightIcon
                                className="text-white w-5 absolute right-1 cursor-pointer"
                                onClick={() => setSelectedDate(getNextMonth(selectedDate))}
                            />
                        )}
                    </div>
                ))}
            </div>

            {calendarItems.map((week, wI) => (
                <div className="flex justify-between transition-all" style={{ height: `${rowHeight}px` }} key={wI}>
                    {week.map((day, dI) => (
                        <div
                            onClick={(e) => {
                                setSelectedDate(day.date);
                                e.currentTarget.scrollTop = 0;
                            }}
                            className={
                                "w-full pl-1.5 pt-1.5 pr-1.5 overflow-scroll scrollbar-hide group " +
                                getBorderClass(wI, dI)
                            }
                            key={day.date.toString()}
                            style={{ flex: "1 1 0%" }}
                        >
                            <div className="flex items-center justify-between mb-1.5 relative">
                                <div className="flex items-center">
                                    {((!sidebarExpanded && wI === 0 && dI === 0) ||
                                        (!sidebarExpanded && day.date.getDate() === 1)) && (
                                        <span className="ml-1 mr-1.5 text-md text-primary select-none">
                                            {months[day.date.getMonth()].substring(0, 3)}
                                        </span>
                                    )}
                                    <div
                                        className={
                                            "relative text-2xs flex items-center justify-center transition-all " +
                                            getTextClass(day)
                                        }
                                    >
                                        <span className="align-middle">{day.date.getDate()} </span>
                                    </div>
                                </div>

                                <div
                                    className="btn btn-neutral text-xs py-1 shadow-md h-fit min-h-fit px-2.5 mr-1 opacity-0 group-hover:opacity-100 transition-all"
                                    onClick={() => toggleTaskForm(true)}
                                >
                                    Add
                                </div>
                            </div>
                            <div className="h-fit pb-1">
                                {day.tasks.map((task, idx) => (
                                    <CalendarDay
                                        handleClick={(task) => toggleTaskForm(true, task)}
                                        task={task}
                                        key={idx}
                                        handleDblClick={toggleCompleted}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default FullCalendar;
