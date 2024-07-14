import { days, months } from "../constants/calendar";
import { CalendarMonthItem } from "../hooks/useCalendar";

export const getPreviousMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getPreviousMonthSameDay = (date: Date) => {
    const previousMonth = getPreviousMonth(date);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);

    if (daysInPreviousMonth < date.getDate()) {
        previousMonth.setDate(daysInPreviousMonth);
    } else {
        previousMonth.setDate(date.getDate());
    }

    return previousMonth;
};

export const getNextMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const getNextMonthSameDay = (date: Date) => {
    const nextMonth = getNextMonth(date);
    const daysInNextMonth = getDaysInMonth(nextMonth);

    if (daysInNextMonth < date.getDate()) {
        nextMonth.setDate(daysInNextMonth);
    } else {
        nextMonth.setDate(date.getDate());
    }

    return nextMonth;
};

export const isCurrentDay = (date: Date) => {
    const today = new Date();
    if (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
    ) {
        return true;
    } else return false;
};

export const getShorthandDayOfWeek = (date: Date) => {
    return days[date.getDay()].substring(0, 3);
};

export const getFullWeek = (date: Date) => {
    const week: CalendarMonthItem[] = [];
    const dayIndex = date.getDay();
    const sundayDate = new Date(date);
    sundayDate.setDate(date.getDate() - dayIndex);

    for (let i = 0; i < 7; i++) {
        const weekDate = new Date(sundayDate);
        weekDate.setDate(sundayDate.getDate() + i);
        week.push({
            date: weekDate,
            isCurrentMonth: weekDate.getMonth() === date.getMonth(),
        });
    }

    return week;
};

export const getPreviousWeek = (date: Date) => {
    const newD = new Date(date);
    return getFullWeek(new Date(newD.setDate(date.getDate() - 7)));
};

export const getNextWeek = (date: Date) => {
    const newD = new Date(date);
    return getFullWeek(new Date(newD.setDate(newD.getDate() + 7)));
};

export const nthNumber = (date: Date) => {
    const number = date.getDate();
    if (number > 3 && number < 21) return number + "th";
    switch (number % 10) {
        case 1:
            return number + "st";
        case 2:
            return number + "nd";
        case 3:
            return number + "rd";
        default:
            return number + "th";
    }
};

export const getEndOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};

export const getBeginningOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

export const getEndOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), getDaysInMonth(date), 23, 59, 59, 999);
};

export const getBeginningOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

export const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const isSameDay = (date1: Date, date2: Date) => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

export const formatAMPM = (date: string | Date) => {
    if (typeof date === "string") date = new Date(date);
    let hours = date.getHours();
    let minutes = String(date.getMinutes());
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < "10" ? "0" + minutes : minutes;
    const strTime = hours + (minutes === "00" ? "" : ":" + minutes) + "" + ampm;
    return strTime;
};

export const dateString = (date: Date) => {
    return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
};

export const addMinutes = (date: Date, minutes: number) => {
    return new Date(new Date(date).setMinutes(new Date(date).getMinutes() + minutes));
};
