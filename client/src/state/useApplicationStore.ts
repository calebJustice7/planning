import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
    sidebarExpanded: boolean;
    sidebarExpanding: boolean;
};

type Actions = {
    setSidebarExpanded: (val: boolean) => void;
    setSidebarExpanding: (val: boolean) => void;
};

export const useApplicationStore = create<State & Actions>()(
    immer((set) => ({
        sidebarExpanded: true,
        sidebarExpanding: false,
        setSidebarExpanding: (val: boolean) =>
            set((state) => {
                state.sidebarExpanding = val;
            }),
        setSidebarExpanded: (val: boolean) =>
            set((state) => {
                state.sidebarExpanded = val;
            }),
    })),
);
