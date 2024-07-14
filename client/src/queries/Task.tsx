import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

import { toast } from "react-toastify";
import { TaskFull } from "../types/task";

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    const createTask = async (task: Partial<TaskFull>): Promise<void> => {
        return await api.post("/tasks", { ...task });
    };

    return useMutation({
        mutationFn: createTask,
        onSuccess() {
            toast.success("Task Created");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task-for-date"] });
        },
        onError() {
            toast.error("Error creating task");
        },
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    const updateStatus = async ({ id, value }: { id: string; value: boolean }): Promise<void> => {
        return await api.patch("/tasks/status/" + id, { value });
    };

    return useMutation({
        mutationFn: updateStatus,
        onSuccess() {
            toast.success("Task status updated");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task-for-date"] });
        },
        onError() {
            toast.error("Error updating task status");
        },
    });
};

export const useGetCalendarTasks = ({ previousMonth, nextMonth }: { previousMonth?: string; nextMonth?: string }) => {
    const getTasks = async () => {
        return await api
            .get<{ tasks: TaskFull[] }>("/tasks/calendar", { params: { previousMonth, nextMonth } })
            .then((res) => res.data);
    };

    return useQuery({
        queryFn: getTasks,
        queryKey: ["tasks", previousMonth, nextMonth],
        staleTime: 8000,
        enabled: !!previousMonth && !!nextMonth,
    });
};

export const useGetTasksForDate = ({ dateStart, dateEnd }: { dateStart: Date; dateEnd: Date }) => {
    const getTasks = async () => {
        return await api
            .get<TaskFull[]>(`/tasks/date?dateStart=${dateStart}&dateEnd=${dateEnd}`)
            .then((res) => res.data);
    };

    return useQuery({
        queryFn: getTasks,
        queryKey: ["task-for-date", dateStart],
        staleTime: 10000,
    });
};
