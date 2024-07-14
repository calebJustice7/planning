import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
    selectedDate: Date;
    calendarQuery: {
        previousMonth?: string;
        nextMonth?: string;
    };
};

type Actions = {
    setCalendarQuery: (query: { previousMonth: string; nextMonth: string }) => void;
    setSelectedDate: (date: Date) => void;
};

export const useCalendarStore = create<State & Actions>()(
    immer((set) => ({
        selectedDate: new Date(),
        calendarQuery: {},
        setSelectedDate: (date: Date) =>
            set((state) => {
                state.selectedDate = date;
            }),
        setCalendarQuery: (val: { previousMonth: string; nextMonth: string }) =>
            set((state) => {
                state.calendarQuery = val;
            }),
    })),
);
