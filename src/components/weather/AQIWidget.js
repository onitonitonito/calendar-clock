"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/store/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Languages } from "lucide-react";

export default function AQIWidget({ data, aqiHistory, isLoading }) {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.ui.language);
    const [showIconBoard, setShowIconBoard] = useState(false);
    const [hoveredLevel, setHoveredLevel] = useState(null);
    const [isRingHovered, setIsRingHovered] = useState(false);

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
        1: {
            label: language === "ko" ? "천상" : "Celestial",
            color: "#d7a5fdff",
            bg: "bg-emerald-500/5",
            detail: language === "ko"
                ? "대기 오염이 거의 없는 완벽한 상태입니다. 실외 운동, 등산, 나들이 등 모든 야외 활동을 적극적으로 즐기기에 가장 좋습니다. 실내 환기도 오늘만큼은 하루 종일 실시하여 맑은 공기를 충분히 유입시키세요. 침구류 건조나 대청소를 하기에도 최적의 날입니다. 자연의 공기를 마음껏 마셔보세요."
                : "Pristine air quality with virtually no pollutants. Ideal for all outdoor pursuits, including hiking and intense sports. Keep windows open all day to refresh indoor air completely. A perfect day for household cleaning or drying laundry outside. Enjoy the crystal-clear atmosphere to the fullest and breathe in the natural freshness."
        },
        2: {
            label: language === "ko" ? "최고" : "Top",
            color: "#34d399",
            bg: "bg-emerald-500/5",
            detail: language === "ko"
                ? "매우 청정한 대기 상태로 건강에 매우 유익합니다. 장시간의 고강도 야외 운동이나 아이들의 실외 놀이 활동에 전혀 지장이 없습니다. 오전에 대대적인 환기를 통해 실내 공기를 신선하게 교체하는 것을 추천합니다. 가벼운 산책이나 자전거 타기와 같은 야외 취미 활동을 즐기기에 매우 쾌적한 날씨입니다. 맑은 공기를 마음껏 활용하세요."
                : "Very clean air that is highly beneficial for health. No restrictions on long-duration high-intensity outdoor exercise or children's playground activities. We recommend thorough morning ventilation to keep indoor areas fresh. Highly pleasant for walks or cycling. Make the most of this excellent air quality for your well-being."
        },
        3: {
            label: language === "ko" ? "좋음" : "Good",
            color: "#84cc16",
            bg: "bg-lime-500/5",
            detail: language === "ko"
                ? "일상적인 생활과 야외 활동을 하기에 아주 좋은 수준입니다. 대다수의 사람들에게 건강상 위험이 없으므로 안심하고 실외 활동을 수행하셔도 좋습니다. 다만, 매우 민감한 체질이라면 가벼운 증상이 있을 수 있으나 일반적인 환기와 외출에는 문제가 없습니다. 맑은 하늘을 보며 야외에서 가족이나 친구들과 시간을 보내기에 부족함이 없는 날입니다."
                : "Great level for regular daily life and outdoor activities. No health risks for the vast majority of people; proceed with outdoor plans confidently. Very sensitive individuals might feel slight symptoms, but general outings and ventilation are perfectly fine. A wonderful day to spend time outdoors with family or friends under clear skies."
        },
        4: {
            label: language === "ko" ? "양호" : "Moderate",
            color: "#facc15",
            bg: "bg-yellow-500/5",
            detail: language === "ko"
                ? "대체로 깨끗하지만 아주 예민한 분들은 주의가 필요한 단계입니다. 일반인들은 야외 활동에 제약이 없으며 평소처럼 환기를 실시해도 무방합니다. 다만, 심한 천식이나 호흡기 질환이 있는 민감군이라면 장시간 실외 활동 시 몸 상태를 수시로 살피시기 바랍니다. 아직까지는 마스크 없이도 쾌적한 활동이 가능하지만 개인별 위생 관리에 신경 써주세요."
                : "Generally clean, but very sensitive groups should exercise caution. No restrictions for the general public, and regular ventilation is fine. However, those with severe asthma or respiratory conditions should monitor their health during extended outdoor stays. Activity without masks is still pleasant, but stay mindful of your personal condition."
        },
        5: {
            label: language === "ko" ? "보통" : "Normally",
            color: "#f59e0b",
            bg: "bg-amber-500/5",
            detail: language === "ko"
                ? "가장 일반적인 수준이나 장시간 노출 시 컨디션에 영향을 줄 수 있습니다. 건강한 성인은 야외 활동에 큰 문제가 없으나, 영유아나 노약자는 무리한 장시간 실외 활동을 평소보다 조금 줄이는 것이 좋습니다. 환기는 30분 내외로 짧게 여러 번 실시하고 실내 공기청정기를 효율적으로 가동하세요. 외출 후에는 손발을 깨끗이 씻고 수분을 충분히 섭취하시기 바랍니다."
                : "Common air level, but long-term exposure may affect condition. Healthy adults face few issues, but infants and elderly should slightly reduce prolonged outdoor activities. Aim for short ventilation sessions (30 mins) several times a day and use air purifiers. Maintain a habit of washing hands and staying hydrated after returning from outside."
        },
        6: {
            label: language === "ko" ? "나쁨" : "Unhealthy",
            color: "#f97316",
            bg: "bg-orange-500/5",
            detail: language === "ko"
                ? "모든 사람에게 건강상 해로울 수 있는 경계 단계입니다. 무리한 야외 활동을 피하고, 실외에서는 반드시 KF80 이상의 보건용 마스크를 착용하시기 바랍니다. 특히 심장이나 폐 질환이 있는 분들은 실외 활동을 최소화해야 합니다. 환기는 가급적 자제하고 실내 습도를 적절히 유지하며 물을 자주 마셔 호흡기를 보호하세요. 실내 공기질 정화에 각별히 신경 써야 하는 시기입니다."
                : "Caution level that can be harmful to everyone. Avoid strenuous outdoor activities and always wear a KF80+ mask when outside. Vulnerable groups with heart or lung issues must minimize outdoor exposure. Limit ventilation, keep indoor humidity balanced, and drink plenty of water to protect respiratory systems. Focus on purifying air quality indoors."
        },
        7: {
            label: language === "ko" ? "매우나쁨" : "V.Unhealthy",
            color: "#ef4444",
            bg: "bg-rose-500/5",
            detail: language === "ko"
                ? "실외 활동을 가급적 중단해야 하는 위험한 수준입니다. 노약자와 환자뿐만 아니라 일반인들도 실외에서의 고강도 운동을 반드시 삼가시기 바랍니다. 불가피하게 외출해야 한다면 KF94 마스크를 안면에 밀착하여 착용하고 외부 노출 시간을 최대한 단축하세요. 실내 창문은 모두 닫고 공기청정기를 최대 강도로 가동하며, 외부 오염 물질이 실내로 유입되지 않도록 주의하십시오."
                : "Dangerous level where outdoor activity should be stopped if possible. Both vulnerable groups and healthy adults should avoid high-intensity outdoor exercise. If going out is unavoidable, wear a tight-fitting KF94 mask and keep exposure as short as possible. Keep all windows closed, run purifiers at max, and prevent outdoor pollution from entering."
        },
        8: {
            label: language === "ko" ? "잔혹" : "Hazardous",
            color: "#dc2626",
            bg: "bg-red-600/10",
            detail: language === "ko"
                ? "심각한 대기 오염으로 인해 건강에 치명적인 영향을 줄 수 있습니다. 야외 활동을 전면 중단하고 가능한 모든 시간을 실내에서 머무르십시오. 실외 미세먼지가 실내로 유입되지 않도록 모든 퇴로와 문틈을 점검하고, 환기는 절대로 하지 마세요. 실내에서 조리 시에도 미세먼지 발생에 주의하며 공기 정화에 온 힘을 쏟으십시오. 가슴 답답함 등 신체 이상 증상 발생 시 즉시 도움을 받으세요."
                : "Severe air pollution with potentially fatal health impacts. Cease all outdoor activities and stay indoors at all times. Check all door gaps to prevent dust entry and do not ventilate. Be cautious with cooking smoke indoors and focus entirely on air purification. Seek medical attention immediately if you experience chest tightness or respiratory distress."
        },
        9: {
            label: language === "ko" ? "지옥" : "Hell",
            color: "#7f1d1d",
            bg: "bg-red-900/20",
            detail: language === "ko"
                ? "생명에 위협을 줄 수 있는 극도로 위험한 대기 상태입니다. 모든 외부 활동을 완벽히 차단하고 밀폐된 공간에서 안전한 환경을 유지하며 대기하십시오. 외부 공기의 실내 유입을 막기 위해 모든 환기 입구를 봉쇄하고 공기청정기를 상시 가동하며 비상 상황에 대비하십시오. 대기 오염 수치가 안전 수준으로 낮아질 때까지 외부 접촉을 피하고, 정부의 안내 및 대응 지침을 엄격히 준수하십시오."
                : "Extremely hazardous state that can be life-threatening. Completely block all external contact and stay in a sealed, safe indoor environment. Seal all ventilation points to prevent any outdoor air flow and keep purifiers running continuously. Stay indoors until pollution levels drop to safe ranges and strictly follow emergency government guidelines."
        },
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
                <motion.div
                    className="relative w-[100px] h-[100px] flex-shrink-0 cursor-pointer"
                    onMouseEnter={() => setIsRingHovered(true)}
                    onMouseLeave={() => setIsRingHovered(false)}
                    animate={{ scale: isRingHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                >
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
                                        animate={{ strokeDashoffset: isRingHovered ? [circ, circ * (1 - ratio)] : circ * (1 - ratio) }}
                                        transition={{ duration: 1.2, delay: i * 0.1 }}
                                        style={{ filter: isRingHovered ? `drop-shadow(0 0 4px ${f.shadow})` : 'none' }}
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
                </motion.div>

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
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1c1e] border border-white/10 rounded-3xl p-6 max-w-[900px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header with Language Toggle */}
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => dispatch(setLanguage(language === "ko" ? "en" : "ko"))}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <Languages size={12} className="opacity-60" />
                                    <span>{language === "ko" ? "EN" : "한"}</span>
                                </button>
                            </div>
                            <div className="flex gap-6">
                                {/* LEFT: Level Guide */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-[16px] font-black uppercase tracking-widest text-white mb-4">
                                        {language === "ko" ? "🏠 등급 가이드" : "🏠 Level Guide"}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {Object.keys(statusMap).map((level) => {
                                            const isCurrent = Number(level) === calculatedAqi;
                                            return (
                                                <div key={level} className="flex flex-col items-center gap-1 cursor-help" onMouseEnter={() => setHoveredLevel(Number(level))} onMouseLeave={() => setHoveredLevel(null)}>
                                                    <div className={`relative w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border transition-all ${isCurrent ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/20' : 'border-white/5'}`}>
                                                        <img src={`/images/AQI-index/icon_aqi_${level}.png`} alt={statusMap[level].label} className="w-9 h-9 object-contain" />
                                                        {isCurrent && (
                                                            <motion.div
                                                                className="absolute top-0.5 right-0.5 font-black leading-none text-white text-[10px]"
                                                                animate={{
                                                                    scale: [1.3, 1.6, 1.3],
                                                                    filter: [
                                                                        "drop-shadow(0 0 2px rgba(255,255,255,0.4))",
                                                                        "drop-shadow(0 0 12px rgba(255,255,255,0.9))",
                                                                        "drop-shadow(0 0 2px rgba(255,255,255,0.4))"
                                                                    ]
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut"
                                                                }}
                                                            >
                                                                NOW
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <span className="text-[14px] font-black tracking-tighter" style={{ color: statusMap[level].color }}>{statusMap[level].label}</span>
                                                    <span className="text-[11px] font-black text-white/60 -mt-1">LEVEL.{level}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <h5 className="text-[14px] font-black uppercase mb-1" style={{ color: statusMap[hoveredLevel || calculatedAqi].color }}>{statusMap[hoveredLevel || calculatedAqi].label} GUIDE</h5>
                                        <p className="text-[10px] font-medium leading-relaxed text-white/70">{statusMap[hoveredLevel || calculatedAqi].detail}</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-px bg-white/10 self-stretch" />

                                {/* RIGHT: 24H Chart */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-[16px] font-black uppercase tracking-widest text-white mb-4">
                                        {language === "ko" ? "📊 24시간 오염물질 추이" : "📊 24H Pollutant Trend"}
                                    </div>
                                    <AQIChart aqiHistory={aqiHistory} language={language} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AQIChart({ aqiHistory, language }) {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [highlightKey, setHighlightKey] = useState(null);
    const [timeRange, setTimeRange] = useState(24);
    const [chartKey, setChartKey] = useState(0);

    const timeRanges = [
        { hours: 24, labelKo: '하루', labelEn: '24H' },
        { hours: 48, labelKo: '이틀', labelEn: '48H' },
        { hours: 72, labelKo: '사흘', labelEn: '72H' },
        { hours: 168, labelKo: '일주일', labelEn: '1W' },
    ];

    const pollutants = [
        { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', color: '#10b981', shadow: 'rgba(16,185,129,0.4)' },
        { key: 'pm10', label: 'PM10', unit: 'μg/m³', color: '#0ea5e9', shadow: 'rgba(14,165,233,0.4)' },
        { key: 'o3', label: 'O₃', unit: 'μg/m³', color: '#8b5cf6', shadow: 'rgba(139,92,246,0.4)' },
        { key: 'no2', label: 'NO₂', unit: 'μg/m³', color: '#ec4899', shadow: 'rgba(236,72,153,0.4)' },
    ];

    if (!aqiHistory || aqiHistory.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-white/30 text-sm font-bold">
                {language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...'}
            </div>
        );
    }

    // Filter data by time range
    const now = Math.floor(Date.now() / 1000);
    const rangeStart = now - (timeRange * 60 * 60);
    const filtered = aqiHistory.filter(h => h.dt >= rangeStart);

    // Sample to max ~36 points for chart clarity
    const maxPoints = 36;
    const step = Math.max(1, Math.floor(filtered.length / maxPoints));
    const sampled = filtered.filter((_, i) => i % step === 0);

    const W = 380, H = 200;
    const PAD = { top: 20, right: 15, bottom: 30, left: 35 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    // Calculate max value across all pollutants
    let maxVal = 0;
    sampled.forEach(h => {
        pollutants.forEach(p => {
            const v = h.components?.[p.key] || 0;
            if (v > maxVal) maxVal = v;
        });
    });
    maxVal = Math.ceil(maxVal / 10) * 10 || 50;

    const getX = (i) => PAD.left + (i / Math.max(sampled.length - 1, 1)) * chartW;
    const getY = (v) => PAD.top + chartH - (v / maxVal) * chartH;

    const buildPath = (key) => {
        return sampled.map((h, i) => {
            const v = h.components?.[key] || 0;
            return `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(v)}`;
        }).join(' ');
    };

    // Time labels - adapt format based on range
    const timeLabels = [];
    const labelCount = timeRange <= 24 ? 6 : timeRange <= 72 ? 6 : 7;
    const labelStep = Math.max(1, Math.floor(sampled.length / labelCount));
    for (let i = 0; i < sampled.length; i += labelStep) {
        const d = new Date(sampled[i].dt * 1000);
        let label;
        if (timeRange <= 24) {
            label = `${d.getHours().toString().padStart(2, '0')}:00`;
        } else if (timeRange <= 72) {
            label = `${(d.getMonth() + 1)}/${d.getDate()} ${d.getHours()}h`;
        } else {
            label = `${(d.getMonth() + 1)}/${d.getDate()}`;
        }
        timeLabels.push({ i, label });
    }

    // Y-axis ticks
    const yTicks = [];
    const tickCount = 4;
    for (let t = 0; t <= tickCount; t++) {
        yTicks.push(Math.round((maxVal / tickCount) * t));
    }

    const hoveredData = hoveredIdx !== null ? sampled[hoveredIdx] : null;

    // Approx total path length for stroke animation
    const approxPathLen = chartW + chartH;

    const handleRangeChange = (hours) => {
        setTimeRange(hours);
        setChartKey(prev => prev + 1);
        setHoveredIdx(null);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Time Range Buttons + Hovered Time */}
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                    {timeRanges.map(({ hours, labelKo, labelEn }) => (
                        <motion.button
                            key={hours}
                            onClick={() => handleRangeChange(hours)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${timeRange === hours
                                    ? 'bg-white/15 border-white/25 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                    : 'bg-transparent border-white/5 text-white/25 hover:text-white/50 hover:border-white/15'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {language === 'ko' ? labelKo : labelEn}
                        </motion.button>
                    ))}
                </div>
                <AnimatePresence>
                    {hoveredData && (
                        <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-[10px] font-bold text-white/60"
                        >
                            {new Date(hoveredData.dt * 1000).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* SVG Chart */}
            <motion.div
                key={chartKey}
                className="bg-white/[0.03] rounded-2xl border border-white/5 p-3 overflow-hidden"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
                    {/* Grid lines */}
                    {yTicks.map((tick) => (
                        <g key={tick}>
                            <line x1={PAD.left} y1={getY(tick)} x2={W - PAD.right} y2={getY(tick)}
                                stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                            <text x={PAD.left - 5} y={getY(tick) + 3}
                                fill="rgba(255,255,255,0.25)" fontSize="8" fontWeight="700" textAnchor="end">
                                {tick}
                            </text>
                        </g>
                    ))}

                    {/* Time labels */}
                    {timeLabels.map(({ i, label }) => (
                        <text key={i} x={getX(i)} y={H - 5}
                            fill="rgba(255,255,255,0.25)" fontSize="7" fontWeight="700" textAnchor="middle">
                            {label}
                        </text>
                    ))}

                    {/* Animated Lines with highlight support */}
                    {pollutants.map((p, idx) => {
                        const isHighlighted = highlightKey === null || highlightKey === p.key;
                        return (
                            <motion.path
                                key={`${p.key}-${chartKey}`}
                                d={buildPath(p.key)}
                                fill="none"
                                stroke={p.color}
                                strokeWidth={highlightKey === p.key ? 3 : 2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ strokeDasharray: approxPathLen, strokeDashoffset: approxPathLen }}
                                animate={{
                                    strokeDashoffset: 0,
                                    opacity: isHighlighted ? 0.9 : 0.15,
                                }}
                                transition={{
                                    strokeDashoffset: { duration: 1.2, delay: idx * 0.15, ease: "easeInOut" },
                                    opacity: { duration: 0.3 },
                                }}
                                style={{ filter: isHighlighted ? `drop-shadow(0 0 ${highlightKey === p.key ? '8px' : '4px'} ${p.shadow})` : 'none' }}
                            />
                        );
                    })}

                    {/* Hover overlay areas */}
                    {sampled.map((_, i) => (
                        <rect key={i} x={getX(i) - chartW / sampled.length / 2} y={PAD.top}
                            width={chartW / sampled.length} height={chartH}
                            fill="transparent" className="cursor-crosshair"
                            onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
                    ))}

                    {/* Hover indicator with pulsing dots */}
                    {hoveredIdx !== null && (
                        <g>
                            <line x1={getX(hoveredIdx)} y1={PAD.top} x2={getX(hoveredIdx)} y2={PAD.top + chartH}
                                stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" />
                            {pollutants.map((p) => {
                                const v = sampled[hoveredIdx]?.components?.[p.key] || 0;
                                const isHighlighted = highlightKey === null || highlightKey === p.key;
                                if (!isHighlighted) return null;
                                return (
                                    <g key={p.key}>
                                        {/* Outer pulse ring */}
                                        <motion.circle
                                            cx={getX(hoveredIdx)} cy={getY(v)} r="4"
                                            fill="none" stroke={p.color} strokeWidth="1"
                                            initial={{ r: 4, opacity: 0.6 }}
                                            animate={{ r: 10, opacity: 0 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                                        />
                                        {/* Inner dot */}
                                        <circle cx={getX(hoveredIdx)} cy={getY(v)} r="4"
                                            fill={p.color} stroke="#1a1c1e" strokeWidth="2"
                                            style={{ filter: `drop-shadow(0 0 8px ${p.shadow})` }} />
                                        {/* Value tooltip */}
                                        <text x={getX(hoveredIdx)} y={getY(v) - 8}
                                            fill={p.color} fontSize="7" fontWeight="800" textAnchor="middle"
                                            style={{ filter: `drop-shadow(0 0 3px ${p.shadow})` }}>
                                            {Math.round(v)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    )}
                </svg>
            </motion.div>

            {/* Legend + Current Values - with hover highlight */}
            <div className="flex gap-1.5">
                {pollutants.map((p) => {
                    const currentVal = hoveredData
                        ? Math.round(hoveredData.components?.[p.key] || 0)
                        : Math.round(sampled[sampled.length - 1]?.components?.[p.key] || 0);
                    const isActive = highlightKey === null || highlightKey === p.key;
                    return (
                        <motion.div
                            key={p.key}
                            className="flex-1 rounded-xl border p-2 flex flex-col items-center gap-0.5 cursor-pointer select-none"
                            style={{
                                backgroundColor: highlightKey === p.key ? `${p.color}10` : 'rgba(255,255,255,0.02)',
                                borderColor: highlightKey === p.key ? `${p.color}40` : 'rgba(255,255,255,0.05)',
                            }}
                            onMouseEnter={() => setHighlightKey(p.key)}
                            onMouseLeave={() => setHighlightKey(null)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            animate={{ opacity: isActive ? 1 : 0.3 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center gap-1">
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: p.color }}
                                    animate={highlightKey === p.key ? {
                                        boxShadow: [`0 0 4px ${p.shadow}`, `0 0 12px ${p.shadow}`, `0 0 4px ${p.shadow}`]
                                    } : { boxShadow: `0 0 4px ${p.shadow}` }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="text-[8px] font-black uppercase tracking-wider text-white/50">{p.label}</span>
                            </div>
                            <motion.span
                                className="text-[16px] font-black tabular-nums"
                                style={{ color: p.color }}
                                key={currentVal}
                                initial={{ scale: 1.2, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentVal}
                            </motion.span>
                            <span className="text-[6px] font-bold text-white/25">{p.unit}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

