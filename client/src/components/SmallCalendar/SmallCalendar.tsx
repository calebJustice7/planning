import { Bars3Icon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import {
    getFullWeek,
    getNextMonthSameDay,
    getNextWeek,
    getPreviousMonthSameDay,
    getPreviousWeek,
    getShorthandDayOfWeek,
    isCurrentDay,
} from "../../utils/date";
import { months } from "../../constants/calendar";
import { CalendarMonthItem } from "../../hooks/useCalendar";
import { useCalendarStore } from "../../state/useCalendarStore";
import TaskList from "../TaskList";
import debounce from "lodash.debounce";

function SmallCalendar() {
    const selectedDate = useCalendarStore((state) => state.selectedDate);
    const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
    const [previousWeek, setPreviousWeek] = useState<CalendarMonthItem[]>([]);
    const [currentWeek, setCurrentWeek] = useState<CalendarMonthItem[]>([]);
    const [nextWeek, setNextWeek] = useState<CalendarMonthItem[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null!);

    const handleScroll = () => {
        const carousel = carouselRef.current;

        const scrollLeft = carousel.scrollLeft;
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;
        const scrollRight = scrollWidth - scrollLeft - clientWidth;

        const newDate = new Date(selectedDate);
        if (scrollLeft === 0) {
            handleLeftScroll(new Date(newDate.setDate(newDate.getDate() - 7)));
        } else if (scrollRight === 0) {
            handleRightScroll(new Date(newDate.setDate(newDate.getDate() + 7)));
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 10);

    const handleLeftScroll = (newDate: Date) => {
        setPreviousWeek(getPreviousWeek(newDate));
        setCurrentWeek(getFullWeek(newDate));
        setNextWeek(getNextWeek(newDate));
        setSelectedDate(newDate);
    };

    const handleRightScroll = (newDate: Date) => {
        setCurrentWeek(getFullWeek(newDate));
        setPreviousWeek(getPreviousWeek(newDate));
        setNextWeek(getNextWeek(newDate));
        setSelectedDate(newDate);
    };

    const getTextClass = (day: CalendarMonthItem) => {
        if (isCurrentDay(day.date)) {
            return "text-black bg-accent rounded-full text-center w-7 h-7 transition-colors";
        }
        if (selectedDate.getDay() === day.date.getDay()) {
            return "text-black bg-white rounded-full text-center w-7 h-7 transition-colors";
        }
        return "text-slate-100 text-center w-7 h-7";
    };

    const setPreviousMonth = () => {
        const newDate = getPreviousMonthSameDay(selectedDate);
        setPreviousWeek(getPreviousWeek(newDate));
        setCurrentWeek(getFullWeek(newDate));
        setNextWeek(getNextWeek(newDate));
        setSelectedDate(newDate);
    };

    const setNextMonth = () => {
        const newDate = getNextMonthSameDay(selectedDate);
        setPreviousWeek(getPreviousWeek(newDate));
        setCurrentWeek(getFullWeek(newDate));
        setNextWeek(getNextWeek(newDate));
        setSelectedDate(newDate);
    };

    useEffect(() => {
        setPreviousWeek(getPreviousWeek(selectedDate));
        setCurrentWeek(getFullWeek(selectedDate));
        setNextWeek(getNextWeek(selectedDate));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;
        carousel.scrollLeft = carousel.scrollWidth / 3;
        carousel.addEventListener("scroll", debouncedHandleScroll);
        return () => carousel.removeEventListener("scroll", debouncedHandleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    return (
        <div>
            <div className="p-2 flex items-center justify-between">
                <label htmlFor="main-drawer">
                    <div className="cursor-pointer">
                        <Bars3Icon className="w-6" />
                    </div>
                </label>
                <div className="flex items-center">
                    <ChevronLeftIcon className="text-white w-6 cursor-pointer mr-5" onClick={setPreviousMonth} />

                    <div className="flex items-end">
                        <div className="text-4xl text-primary select-none">{months[selectedDate.getMonth()]}</div>
                        <div className="text-2xl ml-3 font-light text-slate-400 select-none">
                            {selectedDate.getFullYear()}
                        </div>
                    </div>

                    <ChevronRightIcon className="text-white w-6 cursor-pointer ml-5" onClick={setNextMonth} />
                </div>
                <div></div>
            </div>

            <div className="w-full overflow-scroll flex snap-x snap-mandatory scrollbar-hide" ref={carouselRef}>
                <div className="carousel-item w-full flex justify-between p-4 box-border">
                    {previousWeek.map((date, idx) => (
                        <div key={idx} className="flex flex-col justify-center items-center">
                            <div>{getShorthandDayOfWeek(date.date)}</div>
                            <div className={getTextClass(date)}>
                                <span className="align-middle">{date.date.getDate()}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="carousel-item w-full flex justify-between p-4 box-border">
                    {currentWeek.map((date, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-center items-center"
                            onClick={() => setSelectedDate(date.date)}
                        >
                            <div>{getShorthandDayOfWeek(date.date)}</div>
                            <div className={getTextClass(date)}>
                                <span className="align-middle">{date.date.getDate()}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="carousel-item w-full flex justify-between p-4 box-border">
                    {nextWeek.map((date, idx) => (
                        <div key={idx} className="flex flex-col justify-center items-center">
                            <div>{getShorthandDayOfWeek(date.date)}</div>
                            <div className={getTextClass(date)}>
                                <span className="align-middle">{date.date.getDate()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <TaskList hideDate={true} className="pb-4" />
        </div>
    );
}

export default SmallCalendar;
