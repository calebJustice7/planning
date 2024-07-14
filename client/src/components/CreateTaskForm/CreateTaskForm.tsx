import { Button } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../TextInput";
import FullDateField from "./FullDateField";
import ColorField from "./ColorField";
import TextArea from "../TextArea";
import { useEffect } from "react";
import { useCreateTask } from "../../queries/Task";
import { TaskFull } from "../../types/task";

const FormInputsSchema = z.object({
    name: z.string().min(1, "Required").max(200, "Max length of 200 characters"),
    selected_date_type: z.union([z.literal("month"), z.literal("week"), z.literal("day")]),
    selected_date: z.date(),
    has_selected_time: z.boolean(),
    duration_in_minutes: z.number().optional(),
    color: z.string().min(1),
    notes: z.string().max(5000, "Max length of 5000 characters"),
});

type FormInputs = z.infer<typeof FormInputsSchema>;

interface CreateTaskFormProps {
    closeForm: () => void;
    task?: Partial<TaskFull>;
}

function CreateTaskForm({ closeForm, task }: CreateTaskFormProps) {
    const createTask = useCreateTask();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FormInputs>({
        resolver: zodResolver(FormInputsSchema),
        defaultValues: {
            selected_date_type: "day",
            selected_date: new Date(),
            has_selected_time: true,
            notes: "",
            ...task,
        },
    });

    const selected_date_type = watch("selected_date_type");
    const selected_date = watch("selected_date");
    const duration_in_minutes = watch("duration_in_minutes");
    const color = watch("color");
    const has_selected_time = watch("has_selected_time");

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        await createTask.mutateAsync(data);
        closeForm();
    };

    useEffect(() => {
        if (selected_date_type !== "day") {
            setValue("duration_in_minutes", undefined);
            setValue("has_selected_time", false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_date_type, selected_date]);

    useEffect(() => {
        if (!has_selected_time) {
            setValue("duration_in_minutes", undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [has_selected_time]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <TextInput<FormInputs> name="name" register={register} error={errors.name} label="Name" showErrorMessage />
            <FullDateField
                value={selected_date_type}
                setValue={setValue}
                dateValue={selected_date}
                durationInMinutes={duration_in_minutes}
                hasSelectedTimeValue={has_selected_time}
            />
            <ColorField setValue={setValue} value={color} />
            <TextArea<FormInputs>
                name="notes"
                register={register}
                label="Notes"
                error={errors.notes}
                showErrorMessage
            />

            <div className="mt-4 flex justify-end">
                <Button
                    type="button"
                    className="inline-flex transition-all items-center gap-2 rounded-md bg-red-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-700 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white"
                    onClick={closeForm}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="ml-3 inline-flex transition-all items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                    Save
                </Button>
            </div>
        </form>
    );
}

export default CreateTaskForm;
