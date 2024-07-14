import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import {
    CalendarDaysIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClipboardIcon,
    RocketLaunchIcon,
} from "@heroicons/react/20/solid";
import Avatar from "../../images/avatar-placeholder.jpeg";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useApplicationStore } from "../../state/useApplicationStore";
import { useGetCalendarTasks } from "../../queries/Task";
import TaskList from "../TaskList";
import { useCalendarStore } from "../../state/useCalendarStore";

function Sidebar() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isAboveSm } = useBreakpoint("sm");
    const sidebarExpanded = useApplicationStore((state) => state.sidebarExpanded);
    const sidebarExpanding = useApplicationStore((state) => state.sidebarExpanding);
    const setSidebarExpanded = useApplicationStore((state) => state.setSidebarExpanded);
    const setSidebarExpanding = useApplicationStore((state) => state.setSidebarExpanding);
    const calendarQuery = useCalendarStore((state) => state.calendarQuery);
    const query = useGetCalendarTasks(calendarQuery);

    const logoutUser = async () => {
        await logout();
        navigate({ to: "/login" });
    };

    const toggleSidebar = () => {
        if (!sidebarExpanded) setSidebarExpanding(true);
        setTimeout(() => {
            setSidebarExpanding(false);
        }, 200);
        localStorage.setItem("sidebar_state", String(!sidebarExpanded));
        setSidebarExpanded(!sidebarExpanded);
    };

    const getWidthClass = () => {
        if (sidebarExpanded) return "w-64 md:w-64 xl:w-72";
        return "w-16";
    };

    useEffect(() => {
        if (!isAboveSm) setSidebarExpanded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAboveSm]);

    useEffect(() => {
        const sidebarState = localStorage.getItem("sidebar_state");
        if (sidebarState === "false" && isAboveSm) setSidebarExpanded(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={
                "bg-base-300 box h-screen overflow-y-scroll scrollbar-hide relative border-r border-slate-500 transition-all " +
                getWidthClass()
            }
        >
            <div
                className={`flex justify-center items-center px-5 md:px-0 py-7 overflow-hidden transition-all ${
                    sidebarExpanded ? "w-30" : "w-0"
                }`}
            >
                <div className="avatar">
                    <div className={`rounded-full ${sidebarExpanded ? "w-16 md:w-20" : "w-0"}`}>
                        <img alt="avatar" src={user?.picture || Avatar} />
                    </div>
                </div>

                <div className="ml-5 overflow-hidden">
                    <p className={`text-lg font-medium w-fit basis-0 ${sidebarExpanding ? "text-nowrap" : ""}`}>
                        {user?.name}
                    </p>
                    <Link to="/login">
                        <button className="btn btn-neutral rounded-md btn-sm mt-2 text-sm/6 font-semibold">
                            Profile
                        </button>
                    </Link>
                </div>
            </div>
            <div className="absolute top-4">
                {(query.isLoading || query.isFetching) && !sidebarExpanded && (
                    <span className="loading loading-spinner loading-md ml-4"></span>
                )}
            </div>
            <div className="divider m-0 h-px"></div>
            <div className="p-3 pr-5 cursor-pointer bg-base-300 w-full flex justify-between" onClick={toggleSidebar}>
                <button
                    onClick={logoutUser}
                    className={`btn btn-neutral rounded-md btn-sm overflow-hidden transition-all ${
                        sidebarExpanded ? "w-20" : "w-0 p-0 border-none"
                    }`}
                >
                    Logout
                </button>
                {sidebarExpanded ? <ChevronLeftIcon className="w-6" /> : <ChevronRightIcon className="w-6" />}
            </div>
            <div className="divider m-0 h-px"></div>
            <div className="menu p-0">
                <Link to="/login">
                    <li>
                        <div
                            className={`rounded-none flex justify-between ${
                                sidebarExpanded ? "py-4 px-6" : "py-3 pl-0 pr-5"
                            }`}
                        >
                            <div className={`overflow-hidden transition-all ${!sidebarExpanded ? "w-0" : "w-30"}`}>
                                Calendar
                            </div>
                            <CalendarDaysIcon className="w-6" />
                        </div>
                    </li>
                </Link>
                <div className="divider m-0 h-px"></div>
                <Link to="/" style={{ background: "none" }}>
                    <li>
                        <div
                            className={`rounded-none flex justify-between ${
                                sidebarExpanded ? "py-4 px-6" : "py-3 pl-0 pr-5"
                            }`}
                        >
                            <div className={`overflow-hidden transition-all ${!sidebarExpanded ? "w-0" : "w-30"}`}>
                                Summary
                            </div>
                            <ClipboardIcon className="w-6" />
                        </div>
                    </li>
                </Link>
                <div className="divider m-0 h-px"></div>
                <Link to="/" style={{ background: "none" }}>
                    <li>
                        <div
                            className={`rounded-none flex justify-between ${
                                sidebarExpanded ? "py-4 px-6" : "py-3 pl-0 pr-5"
                            }`}
                        >
                            <div
                                className={`overflow-hidden transition-all text-nowrap ${
                                    !sidebarExpanded ? "w-0" : "w-30"
                                }`}
                            >
                                My Items
                            </div>
                            <CheckIcon className="w-6" />
                        </div>
                    </li>
                </Link>
                <div className="divider m-0 h-px"></div>
                <Link to="/" style={{ background: "none" }}>
                    <li>
                        <div
                            className={`rounded-none flex justify-between ${
                                sidebarExpanded ? "py-4 px-6" : "py-3 pl-0 pr-5"
                            }`}
                        >
                            <div
                                className={`overflow-hidden transition-all text-nowrap ${
                                    !sidebarExpanded ? "w-0" : "w-30"
                                }`}
                            >
                                Goals / Metrics
                            </div>
                            <RocketLaunchIcon className="w-6" />
                        </div>
                    </li>
                </Link>
                <div className="divider m-0 h-px"></div>
            </div>

            {isAboveSm && <TaskList className={`overflow-hidden ${sidebarExpanded ? "w-full" : "w-0"}`}></TaskList>}

            {/* {isAboveSm && (
                <div
                    className="p-3 pr-5 cursor-pointer sticky bottom-0 bg-base-300 border-t-2 border-slate-700 right-2 w-full flex justify-between"
                    onClick={toggleSidebar}
                >
                    <button
                        onClick={logoutUser}
                        className={`btn btn-neutral rounded-md btn-sm overflow-hidden transition-all ${
                            sidebarExpanded ? "w-20" : "w-0 p-0 border-none"
                        }`}
                    >
                        Logout
                    </button>
                    {sidebarExpanded ? <ChevronLeftIcon className="w-6" /> : <ChevronRightIcon className="w-6" />}
                </div>
            )} */}
        </div>
    );
}
export default Sidebar;
