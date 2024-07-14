import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { getNextMonth, getPreviousMonth } from "../../utils/date";
import { months } from "../../constants/calendar";
import { useApplicationStore } from "../../state/useApplicationStore";
import { useGetCalendarTasks } from "../../queries/Task";
import { useCalendarStore } from "../../state/useCalendarStore";

interface FullCalendarHeaderProps {
    toggleTaskForm: (show: boolean) => void;
}

function FullCalendarHeader({ toggleTaskForm }: FullCalendarHeaderProps) {
    const selectedDate = useCalendarStore((state) => state.selectedDate);
    const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
    const calendarQuery = useCalendarStore((state) => state.calendarQuery);
    const sidebarExpanded = useApplicationStore((state) => state.sidebarExpanded);
    const query = useGetCalendarTasks(calendarQuery);

    return (
        <div className={`collapse collapse-${sidebarExpanded ? "open" : "close"}`}>
            <div className="collapse-content p-0 flex justify-between items-center w-full px-7">
                <div className="h-16 flex items-center">
                    <div className="flex items-end">
                        <div className="flex items-center">
                            <div
                                className="p-1 cursor-pointer ml-6 sm:ml-0"
                                onClick={() => setSelectedDate(getPreviousMonth(selectedDate))}
                            >
                                <ChevronLeftIcon className="text-white w-6 cursor-pointer" />
                            </div>
                            <div
                                className="p-1 cursor-pointer mr-5"
                                onClick={() => setSelectedDate(getNextMonth(selectedDate))}
                            >
                                <ChevronRightIcon className="text-white w-6 cursor-pointer" />
                            </div>
                            <div className="text-4xl text-primary select-none">{months[selectedDate.getMonth()]}</div>
                        </div>
                        <div className="text-2xl ml-3 font-light text-slate-400 select-none flex items-center">
                            <span>{selectedDate.getFullYear()}</span>
                            {(query.isLoading || query.isFetching) && (
                                <span className="loading loading-spinner loading-md ml-4"></span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-secondary rounded-md min-h-fit h-fit py-1.5 px-3 text-sm/6 font-semibold"
                    onClick={() => toggleTaskForm(true)}
                >
                    Create Item
                </button>
            </div>
        </div>
    );
}

export default FullCalendarHeader;
