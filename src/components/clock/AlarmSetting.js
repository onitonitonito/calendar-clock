"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlarmByMinutes, setAlarmManual, clearAlarm } from "@/store/slices/uiSlice";
import { Bell, BellOff, Clock, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlarmSetting() {
    const dispatch = useDispatch();
    const { alarmTime, language } = useSelector((state) => state.ui);
    const [isOpen, setIsOpen] = useState(false);
    const [manualHour, setManualHour] = useState("");
    const [manualMin, setManualMin] = useState("");
    const [manualAmPm, setManualAmPm] = useState("AM");
    const [nowState, setNowState] = useState(new Date().getTime());

    const quickSettings = [5, 10, 20, 30, 45, 60];

    // Refresh current time every second when menu is open or alarm is set
    useEffect(() => {
        let interval;
        if (isOpen || alarmTime) {
            // Initial sync
            setNowState(new Date().getTime());

            interval = setInterval(() => {
                setNowState(new Date().getTime());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, alarmTime]);

    const handleManualSet = () => {
        if (manualHour === "" || manualMin === "") return;

        let h = parseInt(manualHour);
        let m = parseInt(manualMin);

        if (isNaN(h) || isNaN(m)) return;
        if (h < 1 || h > 12 || m < 0 || m > 59) return;

        // Convert 12H to 24H
        let finalHour = h % 12;
        if (manualAmPm === "PM") finalHour += 12;

        const now = new Date();
        const alarmDate = new Date();
        alarmDate.setHours(finalHour, m, 0, 0);

        // If the time is already passed today, set it for tomorrow
        if (alarmDate.getTime() <= now.getTime()) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }

        dispatch(setAlarmManual(alarmDate.getTime()));
        setIsOpen(false);
        setManualHour("");
        setManualMin("");
    };

    const remainingTime = alarmTime ? Math.max(0, Math.floor((alarmTime - nowState) / 60000)) : null;
    const remainingSec = alarmTime ? Math.max(0, Math.floor((alarmTime - nowState) / 1000) % 60) : null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${alarmTime
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                    }`}
            >
                {alarmTime ? <Bell size={14} className="animate-bounce" /> : <BellOff size={14} className="opacity-60" />}
                <span>
                    {alarmTime
                        ? (language === "ko"
                            ? `${remainingTime}분 ${remainingSec}초 남음`
                            : `${remainingTime}m ${remainingSec}s left`)
                        : (language === "ko" ? "알람" : "ALARM")}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-[#1a1c1e]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[100] p-4 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black tracking-widest opacity-40 uppercase">
                                {language === "ko" ? "알람 설정" : "ALARM SETTING"}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="opacity-30 hover:opacity-100 transition-opacity">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Quick Settings */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {quickSettings.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        dispatch(setAlarmByMinutes(m));
                                        setIsOpen(false);
                                    }}
                                    className="py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-[10px] font-black"
                                >
                                    +{m}m
                                </button>
                            ))}
                        </div>

                        {/* Manual Settings */}
                        <div className="space-y-3">
                            <div className="text-[10px] font-black opacity-30 uppercase tracking-tighter mb-1">
                                {language === "ko" ? "수동 시간 설정 (12H)" : "MANUAL TIME SET (12H)"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setManualAmPm(manualAmPm === "AM" ? "PM" : "AM")}
                                    className="px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black w-12 hover:bg-white/10 transition-colors"
                                >
                                    {manualAmPm}
                                </button>
                                <input
                                    type="number"
                                    placeholder="HH"
                                    value={manualHour}
                                    onChange={(e) => setManualHour(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center text-sm font-bold focus:outline-none focus:border-amber-500/50 transition-colors"
                                    min="1" max="12"
                                />
                                <span className="opacity-30 font-bold">:</span>
                                <input
                                    type="number"
                                    placeholder="MM"
                                    value={manualMin}
                                    onChange={(e) => setManualMin(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center text-sm font-bold focus:outline-none focus:border-amber-500/50 transition-colors"
                                    min="0" max="59"
                                />
                                <button
                                    onClick={handleManualSet}
                                    className="bg-amber-500 text-black p-2 rounded-lg hover:bg-amber-400 transition-colors flex-shrink-0"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {alarmTime && (
                            <button
                                onClick={() => {
                                    dispatch(clearAlarm());
                                    setIsOpen(false);
                                }}
                                className="w-full mt-6 py-2.5 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl text-[10px] font-black tracking-widest hover:bg-red-500/30 transition-all uppercase"
                            >
                                {language === "ko" ? "알람 해제" : "CLEAR ALARM"}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
