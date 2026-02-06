"use client";

import { useState, useEffect } from "react";
import FlipCard from "./FlipCard";

export default function FlipClock() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

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

    const hours = time.getHours();
    const minutes = time.getMinutes();

    return (
        <div className="flex gap-6 items-center justify-center">
            <FlipCard number={hours} />
            <span className="text-4xl font-bold opacity-30">:</span>
            <FlipCard number={minutes} />
        </div>
    );
}
