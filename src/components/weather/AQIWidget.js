"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export default function AQIWidget({ data, aqiHistory, isLoading }) {
    const language = useSelector((state) => state.ui.language);
    const [showIconBoard, setShowIconBoard] = useState(false);
    const [hoveredLevel, setHoveredLevel] = useState(null);

    if (isLoading || !data) {
        return (
            <div className="card-base animate-pulse h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full" />
            </div>
        );
    }

    const { components } = data;
    const pm25 = Math.round(components.pm2_5);
    const o3 = Math.round(components.o3 || 0);

    const getAqi9Level = (p25, o3Val) => {
        const getPmLevel = (v) => {
            if (v <= 5) return 1; if (v <= 10) return 2; if (v <= 15) return 3;
            if (v <= 25) return 4; if (v <= 35) return 5; if (v <= 55) return 6;
            if (v <= 75) return 7; if (v <= 150) return 8; return 9;
        };
        const getO3Level = (v) => {
            if (v <= 30) return 1; if (v <= 60) return 2; if (v <= 100) return 3;
            if (v <= 130) return 4; if (v <= 160) return 5; if (v <= 190) return 6;
            if (v <= 220) return 7; if (v <= 250) return 8; return 9;
        };
        return Math.max(getPmLevel(p25), getO3Level(o3Val));
    };

    const calculatedAqi = getAqi9Level(pm25, o3);
    const visualMax = 180;
    const factors = [
        { id: 'pm2_5', label: "PM2.5", val: pm25, scale: 1.2, r: 42, w: 6, color: "#10b981", shadow: "rgba(16,185,129,0.3)" },
        { id: 'pm10', label: "PM10", val: Math.round(components.pm10), scale: 1.4, r: 34, w: 6, color: "#0ea5e9", shadow: "rgba(14,165,233,0.3)" },
        { id: 'o3', label: language === "ko" ? "오존" : "O3", val: o3, scale: 1.0, r: 26, w: 6, color: "#8b5cf6", shadow: "rgba(139,92,246,0.3)" },
        { id: 'no2', label: "NO2", val: Math.round(components.no2 || 0), scale: 40.0, r: 18, w: 6, color: "#ec4899", shadow: "rgba(236,72,153,0.3)" },
    ];

    const statusMap = {
        1: { label: language === "ko" ? "천상" : "Celestial", color: "#d7a5fdff", bg: "bg-emerald-500/5", detail: language === "ko" ? "대기질이 눈부시게 깨끗합니다. 실외 활동과 적극적인 환기를 추천합니다." : "Pristine air quality. Highly recommended for outdoor activities." },
        2: { label: language === "ko" ? "최고" : "Top", color: "#34d399", bg: "bg-emerald-500/5", detail: language === "ko" ? "매우 쾌적하고 건강한 대기 상태입니다." : "Very pleasant and healthy air." },
        3: { label: language === "ko" ? "좋음" : "Good", color: "#84cc16", bg: "bg-lime-500/5", detail: language === "ko" ? "공기질이 양호하며 건강상 위험이 없는 상태입니다." : "Air quality is good and poses no health risks." },
        4: { label: language === "ko" ? "양호" : "Moderate", color: "#facc15", bg: "bg-yellow-500/5", detail: language === "ko" ? "일상적인 활동에 적합합니다." : "Suitable for daily activities." },
        5: { label: language === "ko" ? "보통" : "Normally", color: "#f59e0b", bg: "bg-amber-500/5", detail: language === "ko" ? "건강한 성인은 문제없으나 민감군은 실외 활동을 주의하세요." : "Generally okay, but sensitive groups should be careful." },
        6: { label: language === "ko" ? "나쁨" : "Unhealthy", color: "#f97316", bg: "bg-orange-500/5", detail: language === "ko" ? "누구에게나 건강에 좋지 않을 수 있습니다. 마스크를 착용하세요." : "May be unhealthy for everyone. Wear a mask." },
        7: { label: language === "ko" ? "매우나쁨" : "V.Unhealthy", color: "#ef4444", bg: "bg-rose-500/5", detail: language === "ko" ? "건강에 심각한 영향을 미칠 수 있습니다. 외출을 자제하세요." : "Can have serious health impacts. Avoid going outside." },
        8: { label: language === "ko" ? "잔혹" : "Hazardous", color: "#dc2626", bg: "bg-red-600/10", detail: language === "ko" ? "매우 위험한 재난 수준입니다. 야외 활동을 즉시 멈추세요." : "Dangerous disaster level. Stop all outdoor activity." },
        9: { label: language === "ko" ? "지옥" : "Hell", color: "#7f1d1d", bg: "bg-red-900/20", detail: language === "ko" ? "치명적인 대기 상태입니다. 외부 공기 접촉을 완벽히 차단하세요." : "Fatal air condition. Completely block outside air." },
    };

    const currentStatus = statusMap[calculatedAqi] || statusMap[3];

    // 1. AQI Trend Data (last 24h)
    const trendData = aqiHistory.map(h => h.main.aqi).slice(-12);

    return (
        <div className={`card-base h-full flex flex-col justify-between overflow-hidden relative group transition-all duration-500 p-4 ${currentStatus.bg}`}>
            <div className="flex justify-between items-start mb-1">
                <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-black">
                    {language === "ko" ? "공기질 진단" : "AQI ANALYSIS"}
                </div>
                <div
                    className="font-black transition-all duration-300 px-2 py-0.5 rounded-full"
                    style={{
                        color: calculatedAqi === 6 ? "#ffffff" : currentStatus.color,
                        fontSize: calculatedAqi === 6 ? "15px" : "10px",
                        backgroundColor: calculatedAqi === 6 ? "#f97316" : "transparent"
                    }}
                >
                    LEVEL {calculatedAqi}
                </div>
            </div>

            <div className="flex-1 flex items-center gap-4 min-h-0">
                <div className="relative w-[100px] h-[100px] flex-shrink-0">
                    <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                        {factors.map((f, i) => {
                            const circ = 2 * Math.PI * f.r;
                            const ratio = Math.min((f.val * f.scale) / visualMax, 1);
                            return (
                                <g key={f.id}>
                                    <circle cx="50" cy="50" r={f.r} stroke="rgba(255,255,255,0.03)" strokeWidth={f.w} fill="none" />
                                    <motion.circle
                                        cx="50" cy="50" r={f.r} stroke={f.color} strokeWidth={f.w} fill="none" strokeLinecap="round"
                                        initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
                                        animate={{ strokeDashoffset: circ * (1 - ratio) }}
                                        transition={{ duration: 1.5, delay: i * 0.1 }}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 cursor-pointer" onClick={() => setShowIconBoard(true)}>
                        <motion.span className="text-sm font-black tracking-tighter" style={{ color: currentStatus.color }}>
                            {currentStatus.label}
                        </motion.span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-2 overflow-hidden">
                    {/* Compact Trend Sparkline */}
                    <div className="flex items-center gap-2 opacity-30">
                        <div className="h-4 flex-1 flex items-end gap-[1px]">
                            {trendData.map((v, i) => (
                                <motion.div
                                    key={i} className="flex-1 bg-white/40 rounded-t-[0.5px]"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(v / 5) * 100}%` }}
                                />
                            ))}
                        </div>
                        <span className="text-[6px] font-black uppercase tracking-widest whitespace-nowrap">24H TREND</span>
                    </div>

                    {/* Horizontal Factor Bars */}
                    <div className="flex flex-col gap-1.5">
                        {factors.map((f, i) => (
                            <div key={f.id} className="flex flex-col">
                                <div className="flex justify-between items-end leading-none mb-0.5">
                                    <span className="text-[7px] font-black opacity-30 uppercase tracking-tighter">{f.label}</span>
                                    <span className="text-[9px] font-black tabular-nums" style={{ color: f.color }}>{f.val}</span>
                                </div>
                                <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: f.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((f.val * f.scale) / visualMax * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mt-2">
                <div className="flex items-center gap-1.5 text-[8px] opacity-30 font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentStatus.color }} />
                    {language === "ko" ? "실시간 지표" : "LIVE"}
                </div>
            </div>

            <AnimatePresence>
                {showIconBoard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowIconBoard(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1c1e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {Object.keys(statusMap).map((level) => {
                                    const isCurrent = Number(level) === calculatedAqi;
                                    return (
                                        <div key={level} className="flex flex-col items-center gap-1 cursor-help" onMouseEnter={() => setHoveredLevel(Number(level))} onMouseLeave={() => setHoveredLevel(null)}>
                                            <div className={`relative w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl border transition-all ${isCurrent ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/20' : 'border-white/5'}`}>
                                                <img src={`/images/AQI-index/icon_aqi_${level}.png`} alt={statusMap[level].label} className="w-10 h-10 object-contain" />
                                                <div
                                                    className={`absolute top-1 right-1 font-black leading-none text-white ${isCurrent ? 'text-[12px] opacity-100' : 'text-[8px] opacity-40'}`}
                                                    style={{ transform: isCurrent ? 'scale(1.5)' : 'none' }}
                                                >
                                                    {isCurrent ? 'NOW' : `LV.${level}`}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black tracking-tighter" style={{ color: statusMap[level].color }}>{statusMap[level].label}</span>
                                            <span className="text-[7px] font-black opacity-30">LV.{level}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <h5 className="text-[11px] font-black uppercase mb-1" style={{ color: statusMap[hoveredLevel || calculatedAqi].color }}>{statusMap[hoveredLevel || calculatedAqi].label} GUIDE</h5>
                                <p className="text-[11px] font-medium leading-relaxed text-white/70">{statusMap[hoveredLevel || calculatedAqi].detail}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
