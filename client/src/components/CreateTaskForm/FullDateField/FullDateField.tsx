import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { Task } from "../../../types/task";
import { months } from "../../../constants/calendar";
import { dateString, getFullWeek, nthNumber } from "../../../utils/date";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css";
import { Switch } from "@headlessui/react";

interface FullDateFieldProps<T extends FieldValues> {
    setValue: UseFormSetValue<T>;
    value: Task["selected_date_type"];
    dateValue: Date | string;
    durationInMinutes?: number;
    hasSelectedTimeValue: boolean;
}

function FullDateField<T extends FieldValues>({
    setValue,
    value,
    dateValue,
    durationInMinutes,
    hasSelectedTimeValue,
}: FullDateFieldProps<T>) {
    const [inputState, setInputState] = useState<Task["selected_date_type"] | null>();
    const [showCollapse, setShowCollapse] = useState<boolean>(false);
    const dateVal = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    const getDateString = () => {
        if (value === "day") {
            return dateString(dateVal);
        } else if (value === "week") {
            const fullWeek = getFullWeek(dateVal);
            const firstMonth = months[fullWeek[0].date.getMonth()];
            const secondMonth = months[fullWeek[6].date.getMonth()];

            return `${firstMonth} ${nthNumber(fullWeek[0].date)} - ${
                firstMonth !== secondMonth ? secondMonth : ""
            } ${nthNumber(fullWeek[6].date)},  ${fullWeek[0].date.getFullYear()}`;
        } else {
            return `${months[dateVal.getMonth()]} ${dateVal.getFullYear()}`;
        }
    };

    const handleChange = (field: Task["selected_date_type"]) => {
        setInputState(field);
        setShowCollapse(true);
        setValueTyped("selected_date", dateVal);
        setValueTyped("selected_date_type", field);
    };

    const handleInputClick = () => {
        if (inputState) return;
        setInputState(value);
        setShowCollapse(true);
    };

    const closeCollapse = () => {
        if (!inputState) return;

        setShowCollapse(false);
        setTimeout(() => {
            setInputState(null);
        }, 300);
    };

    const setDate = (d: Date | null) => {
        if (!d) return;
        setValueTyped("selected_date", d);
        closeCollapse();
    };

    const durationOptions = useMemo(() => {
        const mins = [1, 5, 10, 15, 20, 25, 30, 45];
        const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return [
            ...mins.map((min) => {
                return {
                    value: min,
                    label: min === 1 ? `${min} minute` : `${min} minutes`,
                };
            }),
            ...hours.map((hour) => {
                return {
                    value: hour * 60,
                    label: hour === 1 ? `${hour} hour` : `${hour} hours`,
                };
            }),
        ];
    }, []);

    const onDurationChange = (val: string | undefined) => {
        const value = Number(val) === 0 ? undefined : Number(val);
        setValueTyped("duration_in_minutes", value);
    };

    const setValueTyped = (field: string, val: string | boolean | Date | number | undefined) => {
        setValue(field as Path<T>, val as PathValue<T, Path<T>>);
    };

    return (
        <>
            <span className="label text-slate-300 text-sm pb-0 pl-0 mt-6">Date</span>
            <div className="flex justify-start mt-1">
                <label className="cursor-pointer flex items-center w-1/3">
                    <span className="label-text mr-3 font-extralight">Day</span>
                    <input
                        type="radio"
                        className="radio"
                        checked={value === "day"}
                        onChange={() => handleChange("day")}
                        onClick={value === "day" ? closeCollapse : () => null}
                    />
                </label>

                <label className="cursor-pointer flex items-center w-1/3">
                    <span className="label-text mr-3 font-extralight">Week</span>
                    <input
                        type="radio"
                        className="radio"
                        checked={value === "week"}
                        onChange={() => handleChange("week")}
                        onClick={value === "week" ? closeCollapse : () => null}
                    />
                </label>

                <label className="cursor-pointer flex items-center">
                    <span className="label-text mr-3 font-extralight">Month</span>
                    <input
                        type="radio"
                        className="radio"
                        checked={value === "month"}
                        onChange={() => handleChange("month")}
                        onClick={value === "month" ? closeCollapse : () => null}
                    />
                </label>
            </div>

            <div
                className={`w-full text-center mt-4 py-3 border border-slate-500 cursor-pointer rounded-md text-sm font-light collapse ${
                    showCollapse ? "collapse-open" : "collapse-close"
                }`}
                onClick={handleInputClick}
            >
                <div
                    onClick={closeCollapse}
                    className={`collapse-title p-0 m-0 min-h-0 ${inputState ? "cursor-pointer" : ""}`}
                >
                    {showCollapse ? "Hide" : getDateString()}
                </div>
                <div className="collapse-content w-full">
                    {inputState === "day" && (
                        <div className="mt-3">
                            <DatePicker selected={dateVal} onChange={setDate} inline />
                        </div>
                    )}
                    {inputState === "week" && (
                        <div className="mt-3">
                            <DatePicker dateFormat="I/R" showWeekPicker selected={dateVal} onChange={setDate} inline />
                        </div>
                    )}
                    {inputState === "month" && (
                        <div className="mt-3">
                            <DatePicker
                                selected={dateVal}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                onChange={setDate}
                                inline
                            />
                        </div>
                    )}
                </div>
            </div>

            {value === "day" && (
                <>
                    <div className="flex items-center mt-6">
                        <span className="label text-slate-300 text-sm pb-0 pl-0 pt-0 mr-2">Time</span>
                        <Switch
                            checked={hasSelectedTimeValue}
                            onChange={(val) => setValueTyped("has_selected_time", val)}
                            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                            />
                        </Switch>
                    </div>
                    {hasSelectedTimeValue && (
                        <div
                            className={`w-full text-center mt-3 py-3 border border-slate-500 rounded-md text-sm font-light flex items-center justify-center`}
                        >
                            <span className="mr-2">From</span>
                            <DatePicker
                                selected={dateVal}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                onChange={setDate}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                            <span className="mx-2">Duration</span>
                            <select
                                value={durationInMinutes}
                                onChange={(e) => onDurationChange(e.target.value)}
                                className="cursor-text appearance-none py-1 px-2 text-primary min-h-0 h-auto rounded-md focus:border-transparent focus:ring-0 focus:outline-none bg-color-[#171c20]"
                            >
                                <option value={0}></option>
                                {durationOptions.map((duration, idx) => (
                                    <option key={idx} value={duration.value}>
                                        {duration.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default FullDateField;
