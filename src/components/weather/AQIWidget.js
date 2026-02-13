"use client";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AQIWidget({ data, isLoading }) {
    const language = useSelector((state) => state.ui.language);

    if (isLoading || !data) {
        return (
            <div className="card-base animate-pulse h-full">
                <div className="w-full h-full bg-white/5 rounded-2xl" />
            </div>
        );
    }

    const { components, main } = data;
    const pm25 = Math.round(components.pm2_5);
    const pm10 = Math.round(components.pm10);

    // PM 농도에 따른 전체 상태 (WHO/한국 근사 기준)
    const getPmAqi = (p25, p10) => {
        if (p25 <= 15 && p10 <= 30) return 1;
        if (p25 <= 35 && p10 <= 80) return 2;
        if (p25 <= 75 && p10 <= 150) return 3;
        if (p25 <= 100 && p10 <= 200) return 4;
        return 5;
    };
    const calculatedAqi = getPmAqi(pm25, pm10);

    // 시각적 정규화를 위한 공통 최대값
    const visualMax = 180;

    const factors = [
        /* 
           시각적 정규화 로직: 
           성분별 수치 범위가 다르므로, 개별 Scale Factor를 적용하여 
           모든 그래프가 50~95% 사이에서 역동적으로 움직이도록 정규화함. (기준: visualMax 180)
        */
        {
            id: 'pm2_5', label: "PM2.5", val: pm25,
            scale: 6.0, // 초미세먼지 확대: x16.0
            r: 42, w: 6, color: "#10b981", shadow: "rgba(16,185,129,0.3)"
        },
        {
            id: 'pm10', label: "PM10", val: pm10,
            scale: 8.0, // 미세먼지 확대: x18.0
            r: 34, w: 6, color: "#0ea5e9", shadow: "rgba(14,165,233,0.3)"
        },
        {
            id: 'o3', label: language === "ko" ? "오존" : "O3", val: Math.round(components.o3 || 0),
            scale: 1.5, // 오존 확대: x1.5
            r: 26, w: 6, color: "#8b5cf6", shadow: "rgba(139,92,246,0.3)"
        },
        {
            id: 'no2', label: language === "ko" ? "NO2" : "NO2", val: Math.round(components.no2 || 0),
            scale: 27.0, // 이산화질소 확대: x17.0
            r: 18, w: 6, color: "#ec4899", shadow: "rgba(236,72,153,0.3)"
        },
    ];

    const statusMap = {
        1: { label: language === "ko" ? "최상" : "Excellent", color: "#10b981", bg: "bg-emerald-500/5" },
        2: { label: language === "ko" ? "좋음" : "Good", color: "#84cc16", bg: "bg-lime-500/5" },
        3: { label: language === "ko" ? "보통" : "Moderate", color: "#f59e0b", bg: "bg-amber-500/5" },
        4: { label: language === "ko" ? "나쁨" : "Poor", color: "#f97316", bg: "bg-orange-500/5" },
        5: { label: language === "ko" ? "위험" : "Hazardous", color: "#ef4444", bg: "bg-rose-500/5" },
    };

    const currentStatus = statusMap[calculatedAqi] || statusMap[3];

    return (
        <div className={`card-base h-full flex flex-col justify-between overflow-hidden relative group transition-all duration-500 ${currentStatus.bg}`}>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 blur-[50px] rounded-full transition-colors duration-1000"
                style={{ backgroundColor: currentStatus.color, opacity: 0.1 }} />

            <div className="flex justify-between items-center mb-1">
                <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-black">
                    {language === "ko" ? "공기질 진단 (PM)" : "PM-BASED AQI"}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black" style={{ color: currentStatus.color }}>LEVEL {calculatedAqi}</span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-between gap-4 py-2">
                {/* 정규화된 스케일링이 적용된 4중 링 SVG */}
                <div className="relative w-[110px] h-[110px] flex-shrink-0">
                    <svg width="110" height="110" viewBox="0 0 100 100" className="transform -rotate-90">
                        {factors.map((f, i) => {
                            const circ = 2 * Math.PI * f.r;
                            const ratio = Math.min((f.val * f.scale) / visualMax, 1);
                            return (
                                <g key={f.id}>
                                    <circle cx="50" cy="50" r={f.r} stroke="rgba(255,255,255,0.03)" strokeWidth={f.w} fill="none" />
                                    <motion.circle
                                        cx="50" cy="50" r={f.r}
                                        stroke={f.color}
                                        strokeWidth={f.w}
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
                                        animate={{ strokeDashoffset: circ * (1 - ratio) }}
                                        transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                                        style={{ filter: `drop-shadow(0 0 2px ${f.shadow})` }}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                        <span className="text-base font-black leading-none tracking-tighter" style={{ color: currentStatus.color }}>{currentStatus.label}</span>
                    </div>
                </div>

                {/* 스케일링된 가로 바가 포함된 수치 리스트 */}
                <div className="flex-1 grid grid-cols-1 gap-1.5">
                    {factors.map((f, i) => (
                        <div key={f.id} className="flex flex-col">
                            <div className="flex justify-between items-end">
                                <span className="text-[8px] font-bold opacity-40 uppercase tracking-tighter">{f.label}</span>
                                <span className="text-[11px] font-black tabular-nums" style={{ color: f.color }}>{f.val}</span>
                            </div>
                            <div className="w-full h-[1.5px] bg-white/5 rounded-full mt-0.5 overflow-hidden">
                                <motion.div
                                    className="h-full"
                                    style={{ backgroundColor: f.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((f.val * f.scale) / visualMax * 100, 100)}%` }}
                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-end mt-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentStatus.color }} />
                    <span className="text-[8px] opacity-30 font-bold uppercase tracking-widest leading-none">
                        {language === "ko" ? "수원시 관측소 실시간 대기" : "LIVE STATION: SUWON"}
                    </span>
                </div>
            </div>
        </div>
    );
}

