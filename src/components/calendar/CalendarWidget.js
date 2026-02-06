"use client";

import { ChevronLeft, ChevronRight, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSession, signIn } from "next-auth/react";

export default function CalendarWidget() {
    const { data: session } = useSession();
    const language = useSelector((state) => state.ui.language);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    if (!mounted) {
        return (
            <div className="card-base h-full flex flex-col overflow-hidden animate-pulse">
                <div className="h-8 w-1/2 bg-gray-700 rounded mb-4"></div>
                <div className="flex-1 bg-gray-700/50 rounded"></div>
            </div>
        );
    }

    const monthName = new Intl.DateTimeFormat(language === "ko" ? "ko-KR" : "en-US", { month: "long" }).format(currentDate);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-6"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        days.push(
            <div
                key={d}
                className={`h-6 flex items-center justify-center rounded-md text-xs font-medium transition-colors
          ${isToday ? 'bg-accent text-white font-black' : 'hover:bg-white/5 opacity-80'}`}
            >
                {d}
            </div>
        );
    }

    const weekDays = language === "ko"
        ? ['일', '월', '화', '수', '목', '금', '토']
        : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="card-base h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-tighter opacity-40 font-bold">{year}</span>
                    <span className="text-sm font-black">{monthName}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map((day, i) => (
                    <div key={day + i} className="text-[10px] font-black opacity-30">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 content-start">
                {days}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">
                    {language === "ko" ? "일정" : "UPCOMING"}
                </div>

                {!session ? (
                    <button
                        onClick={() => signIn("google")}
                        className="w-full py-2 px-3 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-medium"
                    >
                        <LogIn size={14} />
                        {language === "ko" ? "구글 캘린더 연동" : "Connect Google Calendar"}
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-3 bg-accent rounded-full"></div>
                            <span className="text-[11px] font-medium truncate">
                                {language === "ko" ? "캘린더 연결됨" : "Calendar connected"}
                            </span>
                        </div>
                        <span className="text-[9px] opacity-40">
                            {language === "ko" ? "곧 시작할 일정이 여기에 표시됩니다" : "Events will appear here"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
