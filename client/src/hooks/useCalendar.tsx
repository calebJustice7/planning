import { useMemo } from "react";
import { getBeginningOfMonth, getDaysInMonth, getNextMonth, getPreviousMonth } from "../utils/date";

export interface CalendarMonthItem {
  date: Date;
  isCurrentMonth: boolean;
}

export function useCalendar(date: Date) {
  const calendar = useMemo(() => {
    const calendar: CalendarMonthItem[][] = [];
    let rows = 5;

    const firstOfMon = getBeginningOfMonth(date);
    const daysInMon = getDaysInMonth(date);
    const leftoverDays = rows * 7 - daysInMon;
    const daysToPrepend = firstOfMon.getDay();

    if (daysToPrepend > leftoverDays) rows = 6;
    const prependDays: CalendarMonthItem[] = [];
    const prevFirstOfMon = getBeginningOfMonth(getPreviousMonth(date));

    let prependCount = daysToPrepend;
    while (prependCount > 0) {
      prependDays.push({
        date: new Date(
          prevFirstOfMon.getFullYear(),
          prevFirstOfMon.getMonth(),
          getDaysInMonth(prevFirstOfMon) - prependCount + 1,
        ),
        isCurrentMonth: false,
      });
      prependCount--;
    }

    let remainingDaysInFirstWeek = 7 - prependDays.length;
    let currentMonDayCounter = 1;

    while (remainingDaysInFirstWeek > 0) {
      prependDays.push({
        date: new Date(firstOfMon.getFullYear(), firstOfMon.getMonth(), currentMonDayCounter),
        isCurrentMonth: true,
      });
      currentMonDayCounter++;
      remainingDaysInFirstWeek--;
    }
    calendar.push(prependDays);

    let currentRow: CalendarMonthItem[] = [];
    while (currentMonDayCounter <= daysInMon) {
      currentRow.push({
        date: new Date(firstOfMon.getFullYear(), firstOfMon.getMonth(), currentMonDayCounter),
        isCurrentMonth: true,
      });
      currentMonDayCounter++;
      if (currentRow.length === 7) {
        calendar.push(currentRow);
        currentRow = [];
      }
    }
    if (currentRow.length) calendar.push(currentRow);

    const remainingDays = rows * 7 - calendar.flat().length;
    const nextfirstOfMon = getBeginningOfMonth(getNextMonth(date));
    let remainingDaysCounter = 1;

    while (remainingDaysCounter <= remainingDays) {
      currentRow.push({
        date: new Date(nextfirstOfMon.getFullYear(), nextfirstOfMon.getMonth(), remainingDaysCounter),
        isCurrentMonth: false,
      });
      remainingDaysCounter++;
    }

    return calendar;
  }, [date]);

  return {
    calendar,
  };
}
