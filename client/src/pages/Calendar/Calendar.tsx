import { useEffect, useRef, useState } from "react";
import { useCalendar } from "../../hooks/useCalendar";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import FullCalendar from "../../components/FullCalendar";
import SmallCalendar from "../../components/SmallCalendar";
import FullCalendarHeader from "../../components/FullCalendarHeader";
import Modal from "../../components/Modal";
import CreateTaskForm from "../../components/CreateTaskForm";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useApplicationStore } from "../../state/useApplicationStore";
import { getBeginningOfMonth, getNextMonth, getPreviousMonth, getEndOfMonth } from "../../utils/date";
import { useCalendarStore } from "../../state/useCalendarStore";
import { TaskFull } from "../../types/task";

function Calendar() {
    const selectedDate = useCalendarStore((state) => state.selectedDate);
    const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<TaskFull | null>(null);
    const { calendar } = useCalendar(selectedDate);
    const [rowHeight, setRowHeight] = useState<number>(0);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { isBelowSm } = useBreakpoint("sm");
    const sidebarExpanded = useApplicationStore((state) => state.sidebarExpanded);
    const setCalendarQuery = useCalendarStore((state) => state.setCalendarQuery);

    const handleResize = () => {
        const headerHeight = sidebarExpanded ? 64 + 28 : 28;
        const resizeHeight = (window.innerHeight - headerHeight) / calendar.length;
        setRowHeight(resizeHeight);
    };

    useEffect(() => {
        setCalendarQuery({
            previousMonth: getBeginningOfMonth(getPreviousMonth(selectedDate)).toISOString(),
            nextMonth: getEndOfMonth(getNextMonth(selectedDate)).toISOString(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sidebarExpanded]);

    useEffect(() => {
        setTimeout(() => {
            handleResize();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendar, sidebarExpanded]);

    return (
        <div>
            {!isBelowSm && (
                <div ref={headerRef}>
                    <FullCalendarHeader toggleTaskForm={setShowTaskForm} />
                </div>
            )}

            {isBelowSm && (
                <>
                    <SmallCalendar />
                    <div className="fixed bottom-4 right-0 flex justify-end pr-4">
                        <div
                            onClick={() => setShowTaskForm(true)}
                            className="btn btn-primary rounded-full p-0 size-12 align-middle"
                        >
                            <PlusIcon className="w-6" />
                        </div>
                    </div>
                </>
            )}
            {!isBelowSm && (
                <FullCalendar
                    rowHeight={rowHeight}
                    calendar={calendar}
                    toggleTaskForm={(value, task) => {
                        setShowTaskForm(value);
                        if (task) setEditingTask(task);
                    }}
                />
            )}

            <Modal open={showTaskForm} onClose={() => setShowTaskForm(false)} title="Create Item">
                <div>
                    <CreateTaskForm
                        closeForm={() => {
                            setShowTaskForm(false);
                            setEditingTask(null);
                        }}
                        task={editingTask ? editingTask : { selected_date: selectedDate }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Calendar;
