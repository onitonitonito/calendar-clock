"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export default function AQIWidget({ data, isLoading }) {
    const language = useSelector((state) => state.ui.language);
    const [showIconBoard, setShowIconBoard] = useState(false);
    const [hoveredLevel, setHoveredLevel] = useState(null);

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

    // PM2.5와 O3 농도 조합에 따른 9단계 상태 구분
    const getAqi9Level = (p25, o3Val) => {
        const getPmLevel = (v) => {
            if (v <= 5) return 1;    // 천상
            if (v <= 10) return 2;   // 최고
            if (v <= 15) return 3;   // 좋음
            if (v <= 25) return 4;   // 양호
            if (v <= 35) return 5;   // 보통
            if (v <= 55) return 6;   // 나쁨
            if (v <= 75) return 7;   // 매우나쁨
            if (v <= 150) return 8;  // 잔혹
            return 9;                // 지옥
        };
        const getO3Level = (v) => {
            if (v <= 30) return 1;
            if (v <= 60) return 2;
            if (v <= 100) return 3;
            if (v <= 130) return 4;
            if (v <= 160) return 5;
            if (v <= 190) return 6;
            if (v <= 220) return 7;
            if (v <= 250) return 8;
            return 9;
        };
        return Math.max(getPmLevel(p25), getO3Level(o3Val));
    };

    const o3 = Math.round(components.o3 || 0);
    const calculatedAqi = getAqi9Level(pm25, o3);

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
            scale: 1.2, // 초미세먼지 확대: x16.0
            r: 42, w: 6, color: "#10b981", shadow: "rgba(16,185,129,0.3)"
        },
        {
            id: 'pm10', label: "PM10", val: pm10,
            scale: 1.4, // 미세먼지 확대: x18.0
            r: 34, w: 6, color: "#0ea5e9", shadow: "rgba(14,165,233,0.3)"
        },
        {
            id: 'o3', label: language === "ko" ? "오존" : "O3", val: Math.round(components.o3 || 0),
            scale: 1.0, // 오존 확대: x1.5
            r: 26, w: 6, color: "#8b5cf6", shadow: "rgba(139,92,246,0.3)"
        },
        {
            id: 'no2', label: language === "ko" ? "NO2" : "NO2", val: Math.round(components.no2 || 0),
            scale: 40.0, // 이산화질소 확대: x17.0
            r: 18, w: 6, color: "#ec4899", shadow: "rgba(236,72,153,0.3)"
        },
    ];

    const statusMap = {
        1: {
            label: language === "ko" ? "천상" : "Celestial", color: "#d7a5fdff", bg: "bg-emerald-500/5",
            action: language === "ko" ? "공기가 정화되었습니다. ✨" : "Air is purified. ✨",
            detail: language === "ko" ? "대기질이 눈부시게 깨끗합니다. 실외 활동과 적극적인 환기를 적극 추천하며 모처럼의 맑은 공기를 만끽하세요." : "Pristine air quality. Highly recommended for outdoor activities and active ventilation."
        },
        2: {
            label: language === "ko" ? "최고" : "Top", color: "#34d399", bg: "bg-emerald-500/5",
            action: language === "ko" ? "최상의 공기질입니다." : "Excellent air quality.",
            detail: language === "ko" ? "매우 쾌적하고 건강한 대기 상태입니다. 실외 활동을 즐기기에 완벽한 시간입니다." : "Very pleasant and healthy air. Perfect time to enjoy outdoor activities."
        },
        3: {
            label: language === "ko" ? "좋음" : "Good", color: "#84cc16", bg: "bg-lime-500/5",
            action: language === "ko" ? "쾌적한 날씨입니다." : "Pleasant weather.",
            detail: language === "ko" ? "공기질이 양호하며 대다수의 사람들에게 건강상 위험이 없는 상태입니다." : "Air quality is good and poses no health risks for the vast majority of people."
        },
        4: {
            label: language === "ko" ? "양호" : "Moderate", color: "#facc15", bg: "bg-yellow-500/5",
            action: language === "ko" ? "무난한 공기질입니다." : "Fair air quality.",
            detail: language === "ko" ? "일상적인 활동에 적합합니다. 다만 민감군은 장시간 실외 활동 시 호흡기 증상을 체크하세요." : "Suitable for daily activities. However, sensitive groups should monitor respiratory symptoms."
        },
        5: {
            label: language === "ko" ? "보통" : "Normally", color: "#f59e0b", bg: "bg-amber-500/5",
            action: language === "ko" ? "보통 수준입니다." : "Normal level.",
            detail: language === "ko" ? "건강한 성인은 문제없으나 호흡기 질환자나 노약자는 장시간 무리한 실외 활동을 자제하는 것이 좋습니다." : "Generally okay, but those with respiratory issues should avoid strenuous outdoor stays."
        },
        6: {
            label: language === "ko" ? "나쁨" : "Unhealthy", color: "#f97316", bg: "bg-orange-500/5",
            action: language === "ko" ? "마스크를 착용하세요. 😷" : "Please wear a mask. 😷",
            detail: language === "ko" ? "누구에게나 건강에 좋지 않을 수 있습니다. 실외 활동 시 KF80 이상의 마스크를 착용하고 환기는 자제하세요." : "May be unhealthy for everyone. Wear a KF80+ mask outdoors and limit ventilation."
        },
        7: {
            label: language === "ko" ? "매우나쁨" : "V.Unhealthy", color: "#ef4444", bg: "bg-rose-500/5",
            action: language === "ko" ? "외출을 자제하세요. ⚠️" : "Avoid going outside. ⚠️",
            detail: language === "ko" ? "건강에 심각한 영향을 미칠 수 있습니다. 가급적 실내에 머무르고 창문을 닫아 외부 공기 유입을 차단하세요." : "Can have serious health impacts. Stay indoors as much as possible and close windows tight."
        },
        8: {
            label: language === "ko" ? "잔혹" : "Hazardous", color: "#dc2626", bg: "bg-red-600/10",
            action: language === "ko" ? "🚨 실외 활동 즉시 중단." : "🚨 STOP outdoor activity.",
            detail: language === "ko" ? "🚨 매우 위험한 재난 수준입니다. 야외 활동을 즉시 멈추고 실내 공기청정기를 최대 강도로 가동하며 외출하지 마세요." : "🚨 Dangerous disaster level. Stop all outdoor activity immediately, run purifiers at max, and strictly stay inside."
        },
        9: {
            label: language === "ko" ? "지옥" : "Hell", color: "#7f1d1d", bg: "bg-red-900/20",
            action: language === "ko" ? "💀 절대 외출 금지." : "💀 Absolute stay indoors.",
            detail: language === "ko" ? "💀 치명적인 대기 상태입니다. 외부 공기와의 접촉을 완벽히 차단하고, 실내에서도 마스크를 착용하거나 공기질 정화에 집중하세요." : "💀 Fatal air condition. Completely block outside air. Focus on purification and possibly wear a mask even indoors."
        },
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
                        <motion.span
                            className="text-base font-black leading-none tracking-tighter cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                            style={{ color: currentStatus.color }}
                            onClick={() => setShowIconBoard(true)}
                            animate={calculatedAqi >= 8 ? {
                                x: [0, -2, 2, -1, 1, 0],
                                opacity: [1, 0.8, 1, 0.9, 1],
                                filter: [
                                    "none",
                                    "drop-shadow(2px 0 red) drop-shadow(-2px 0 blue)",
                                    "none",
                                    "drop-shadow(-1px 0 red) drop-shadow(1px 0 cyan)",
                                    "none"
                                ]
                            } : {}}
                            transition={{
                                repeat: Infinity,
                                duration: calculatedAqi === 9 ? 0.2 : 0.4,
                                repeatType: "mirror"
                            }}
                        >
                            {currentStatus.label}
                        </motion.span>
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

            <div className="flex justify-between items-end mt-1.5 px-0.5">
                <div className="flex items-center gap-1.5 text-[8px] opacity-30 font-bold uppercase tracking-widest leading-none">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentStatus.color }} />
                    {language === "ko" ? "실시간 지표" : "LIVE METRICS"}
                </div>
                <div className="text-[8px] opacity-20 font-bold uppercase">SUWON STATION</div>
            </div>

            {/* Ticker를 최하단으로 이동 및 가독성 개선 */}
            <div className="mt-2 h-7 bg-black/40 rounded-lg flex items-center overflow-hidden border border-white/10 relative mx-[-4px]">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/40 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/40 to-transparent z-10" />

                <motion.div
                    className="whitespace-nowrap flex gap-12 items-center h-full"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                        duration: calculatedAqi >= 8 ? 7 : 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <span className="text-[11px] font-black uppercase tracking-tight" style={{ color: currentStatus.color }}>
                        {currentStatus.action}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-tight" style={{ color: currentStatus.color }}>
                        {currentStatus.action}
                    </span>
                </motion.div>
            </div>

            {/* AQI 아이콘 전체 보기 모달 */}
            <AnimatePresence>
                {showIconBoard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowIconBoard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1a1c1e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xs font-black tracking-widest opacity-40 uppercase">
                                    {language === "ko" ? "공기질 단계별 가이드" : "AQI LEVELS GUIDE"}
                                </h4>
                                <button
                                    onClick={() => setShowIconBoard(false)}
                                    className="p-1 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {Object.keys(statusMap).map((level) => {
                                    const isCurrent = Number(level) === calculatedAqi;
                                    return (
                                        <div
                                            key={level}
                                            className="flex flex-col items-center gap-1 group cursor-help"
                                            onMouseEnter={() => setHoveredLevel(Number(level))}
                                            onMouseLeave={() => setHoveredLevel(null)}
                                        >
                                            <div className={`relative w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl border transition-all p-2 ${isCurrent ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/20' : 'border-white/5 hover:border-white/20'}`}>
                                                <img
                                                    src={`/images/AQI-index/icon_aqi_${level}.png`}
                                                    alt={statusMap[level].label}
                                                    className="w-full h-full object-contain"
                                                />
                                                <div className={`absolute top-1 right-2 text-[8px] font-black ${isCurrent ? 'text-amber-500 opacity-100' : 'opacity-30'}`}>
                                                    {isCurrent ? 'NOW' : `LV.${level}`}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black tracking-tighter" style={{ color: statusMap[level].color }}>
                                                {statusMap[level].label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 상세 행동 지침 안내판 */}
                            <motion.div
                                className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5"
                                initial={false}
                                animate={{ backgroundColor: hoveredLevel ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusMap[hoveredLevel || calculatedAqi].color }} />
                                    <h5 className="text-[11px] font-black uppercase tracking-wider" style={{ color: statusMap[hoveredLevel || calculatedAqi].color }}>
                                        {statusMap[hoveredLevel || calculatedAqi].label} {language === "ko" ? "행동 가이드" : "Action Guide"}
                                    </h5>
                                </div>
                                <p className="text-[11px] font-medium leading-relaxed text-white/70">
                                    {statusMap[hoveredLevel || calculatedAqi].detail}
                                </p>
                            </motion.div>

                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-[9px] text-center opacity-30 leading-relaxed uppercase tracking-widest font-bold">
                                    {language === "ko"
                                        ? "아이콘에 마우스를 올리면 상세 지침을 볼 수 있습니다."
                                        : "Hover icons for detailed instructions."}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
