"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FlipCard from "./FlipCard";

export default function FlipClock() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const timeFormat = useSelector((state) => state.ui.timeFormat);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return (
            <div className="flex gap-6 items-center justify-center">
                <div className="w-[180px] h-[240px] bg-card rounded-2xl animate-pulse" />
                <span className="text-4xl font-bold opacity-30">:</span>
                <div className="w-[180px] h-[240px] bg-card rounded-2xl animate-pulse" />
            </div>
        );
    }

    const rawHours = time.getHours();
    const minutes = time.getMinutes();

    // Time Format Logic
    const is12h = timeFormat === "12h";
    let displayHours = rawHours;
    let amPm = "";

    if (is12h) {
        amPm = rawHours >= 12 ? "PM" : "AM";
        displayHours = rawHours % 12 || 12; // Convert 0 to 12
    }

    return (
        <div className="flex gap-6 items-center justify-center relative">
            {/* AM/PM Indicator for 12H mode */}
            {is12h && (
                <div className="absolute -left-2 bottom-4 flex flex-col items-center z-10 translate-x-[-100%]">
                    <div className="text-2xl font-black tracking-widest bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                        {amPm}
                    </div>
                </div>
            )}

            <FlipCard number={displayHours} />
            <span className="text-4xl font-bold opacity-30">:</span>
            <FlipCard number={minutes} />
        </div>
    );
}
