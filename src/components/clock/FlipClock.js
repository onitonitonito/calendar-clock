"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAlarmTriggered, clearAlarm } from "@/store/slices/uiSlice";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FlipCard from "./FlipCard";

export default function FlipClock() {
    const dispatch = useDispatch();
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const { timeFormat, alarmTime, isAlarmActive } = useSelector((state) => state.ui);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now);

            // Check Alarm
            if (alarmTime && !isAlarmActive && now.getTime() >= alarmTime) {
                dispatch(setAlarmTriggered(true));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [alarmTime, isAlarmActive, dispatch]);

    const shakeAnimation = {
        rotate: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop"
        }
    };

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
        <div
            className={`flex items-center justify-center relative transition-all duration-700 ease-in-out ${is12h ? "gap-6 scale-90" : "gap-1 scale-125"
                }`}
        >
            {/* Alarm Indicator Group (Left Sidebar) */}
            {is12h && (
                <div className="absolute left-[-10px] bottom-6 flex flex-col items-stretch z-10 translate-x-[-100%] min-w-[80px]">
                    {alarmTime && (
                        <div className={`flex flex-col gap-1 mb-2 ${isAlarmActive ? "animate-pulse" : ""}`}>
                            {/* Alarm Set Time */}
                            <div className="text-[12px] font-black text-amber-500 tracking-tighter bg-amber-500/10 px-1 py-0.5 rounded-md border border-amber-500/20 text-center">
                                SET: {new Date(alarmTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "").replace("PM", "").trim()}
                            </div>
                            {/* Current Time (Only during Alarm) */}
                            {isAlarmActive && (
                                <div className="text-[10px] font-black text-white tracking-tighter bg-white/10 px-1 py-0.5 rounded-md border border-white/20 text-center">
                                    NOW: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace("AM", "").replace("PM", "").trim()}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="text-3xl font-black tracking-widest bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md text-white text-center">
                        {amPm}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {isAlarmActive ? (
                    /* ALARM TRIGGERED VIEW (Giant Bell) */
                    <motion.div
                        key="alarm-active"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex flex-col items-center justify-center py-10"
                    >
                        <motion.button
                            onClick={() => dispatch(clearAlarm())}
                            animate={shakeAnimation}
                            className="relative p-12 rounded-full bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.5)] border-4 border-white/30"
                        >
                            <Bell size={120} fill="currentColor" />
                            <motion.div
                                className="absolute -inset-8 bg-red-500 rounded-full -z-10"
                                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -inset-16 bg-red-500 rounded-full -z-10"
                                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            />
                        </motion.button>

                        <button
                            onClick={() => dispatch(clearAlarm())}
                            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold tracking-widest transition-all"
                        >
                            STOP ALARM
                        </button>
                    </motion.div>
                ) : (
                    /* NORMAL CLOCK VIEW */
                    <motion.div
                        key="clock-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
                    >
                        {alarmTime && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute left-[-10px] top-6 z-20 translate-x-[-100%]"
                            >
                                <motion.div className="p-2 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/20">
                                    <Bell size={20} />
                                </motion.div>
                            </motion.div>
                        )}

                        <FlipCard number={displayHours} />
                        <span className="text-4xl font-bold opacity-30 mx-2">:</span>
                        <FlipCard number={minutes} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
