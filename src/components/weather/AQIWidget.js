"use client";
import { createPortal } from "react-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/store/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X } from "lucide-react";

export default function AQIWidget({ data, aqiHistory, aqiForecast, isLoading }) {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.ui.language);
    const [showIconBoard, setShowIconBoard] = useState(false);
    const [hoveredLevel, setHoveredLevel] = useState(null);
    const [isRingHovered, setIsRingHovered] = useState(false);
    const [timeRange, setTimeRange] = useState(168);
    const [mounted, setMounted] = useState(false);
    const [highlightKey, setHighlightKey] = useState(null);

    const pollutantInfo = {
        pm2_5: {
            title: language === 'ko' ? '초미세먼지 (PM2.5)' : 'Ultra Fine Dust (PM2.5)',
            desc: language === 'ko'
                ? '초미세먼지 - 머리카락 굵기의 1/30 (2.5µm) 보다 작은 입자로, 폐포 깊숙이 침투해 혈관까지 도달할 수 있는 가장 치명적인 오염물질입니다. 호흡기 및 심혈관 질환의 직접적인 원인이 됩니다.'
                : 'Particles less than 2.5µm. Can penetrate deep into lungs and enter the bloodstream, posing severe risks to respiratory and cardiovascular health.',
            color: '#10b981'
        },
        pm10: {
            title: language === 'ko' ? '미세먼지 (PM10)' : 'Fine Dust (PM10)',
            desc: language === 'ko'
                ? '미세먼지 - 대기 중에 부유하는 미세 입자 (10µm) 이하로, 코나 상기도에서 걸러지지 않고 기관지까지 내려가 염증과 비염, 천식을 유발하거나 악화 시킬 수 있습니다.'
                : 'Inhalable particles 10µm and smaller. Can settle in the airway and lungs, triggering or worsening asthma and respiratory inflammation.',
            color: '#0ea5e9'
        },
        o3: {
            title: language === 'ko' ? '오존 (O3)' : 'Ozone (O3)',
            desc: language === 'ko'
                ? '오존 - 강력한 산화력을 가진 기체로, 눈과 목 점막을 자극하여 기침과 호흡 곤란을 일으킵니다. 주로 여름철 강한 햇빛 아래, 대기 중 화학 반응으로 생성됩니다. 오존경보가 발생되면 외출을 자제하시는 것이 좋습니다.'
                : 'A reactive gas that irritates eyes and throat. Primarily formed by chemical reactions between sunlight and air pollutants during hot weather.',
            color: '#8b5cf6'
        },
        no2: {
            title: language === 'ko' ? '이산화질소 (NO2)' : 'Nitrogen Dioxide (NO2)',
            desc: language === 'ko'
                ? '질소 산화물 - 주로 자동차 배기가스나 석탄연료 연소 시 발생하며, 호흡기 점막을 자극해 기관지 천식과 폐 기능 저하를 유발하는 독성 기체입니다.'
                : 'A toxic gas primarily from vehicle exhaust. Irritates respiratory membranes, leading to bronchitis, asthma, and reduced lung function.',
            color: '#ec4899'
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

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
        { id: 'pm2_5', label: language === "ko" ? "초미세먼지" : "PM2.5", val: pm25, scale: 1.2, r: 42, w: 6, color: "#10b981", shadow: "rgba(16,185,129,0.3)" },
        { id: 'pm10', label: language === "ko" ? "미세먼지" : "PM10", val: Math.round(components.pm10), scale: 1.4, r: 34, w: 6, color: "#0ea5e9", shadow: "rgba(14,165,233,0.3)" },
        { id: 'o3', label: language === "ko" ? "오존" : "O3", val: o3, scale: 1.0, r: 26, w: 6, color: "#8b5cf6", shadow: "rgba(139,92,246,0.3)" },
        { id: 'no2', label: language === "ko" ? "질산가스" : "NO2", val: Math.round(components.no2 || 0), scale: 40.0, r: 18, w: 6, color: "#ec4899", shadow: "rgba(236,72,153,0.3)" },
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

    // --- Shared Data Logic for Features ---
    const nowTs = Math.floor(Date.now() / 1000);
    const rangeStart = nowTs - (timeRange * 60 * 60);
    const historyDataFull = aqiHistory.filter(h => h.dt >= rangeStart && h.dt < nowTs);
    const forecastDataFull = aqiForecast.filter(h => h.dt >= nowTs && h.dt <= (nowTs + 6 * 3600)); // Future 6h (Short Term)
    const mergedData = [...historyDataFull, ...forecastDataFull];

    const maxPoints = 48;
    const step = Math.max(1, Math.floor(mergedData.length / maxPoints));
    const sampled = mergedData.filter((_, i) => i % step === 0);
    const nowIdx = sampled.findIndex(h => h.dt >= nowTs);

    const generateInsight = () => {
        if (sampled.length < 5) return null;
        const currentHourData = sampled[nowIdx] || sampled[sampled.length - 1];
        const historyData = sampled.slice(0, nowIdx > 0 ? nowIdx : sampled.length);
        const forecastData = sampled.slice(nowIdx > 0 ? nowIdx : sampled.length);

        // Ultra-short term analysis for the text (Next 6h)
        const shortTermForecast = aqiForecast.filter(h => h.dt >= nowTs && h.dt <= (nowTs + 6 * 3600));

        const recentHistory = historyData.slice(-6);
        const avgRecent = recentHistory.reduce((acc, h) => acc + (h.components?.pm2_5 || 0), 0) / (recentHistory.length || 1);
        const currentPm = currentHourData.components?.pm2_5 || 0;
        let trend = language === 'ko' ? '안정적' : 'Stable';
        if (currentPm > avgRecent * 1.15) trend = language === 'ko' ? '상승세' : 'Rising';
        if (currentPm < avgRecent * 0.85) trend = language === 'ko' ? '하강세' : 'Falling';

        let peakVal = 0;
        let peakTime = null;
        historyData.forEach(h => {
            const v = h.components?.pm2_5 || 0;
            if (v > peakVal) { peakVal = v; peakTime = h.dt; }
        });
        const peakDate = peakTime ? new Date(peakTime * 1000) : null;
        const peakStr = peakDate ? `${peakDate.getHours()}h` : '--';

        const avgForecast = shortTermForecast.reduce((acc, h) => acc + (h.components?.pm2_5 || 0), 0) / (shortTermForecast.length || 1);
        let outlook = language === 'ko' ? '유지될' : 'is expected to remain steady';
        if (avgForecast > currentPm * 1.1) outlook = language === 'ko' ? '악화될' : 'is likely to worsen';
        if (avgForecast < currentPm * 0.9) outlook = language === 'ko' ? '호전될' : 'is likely to improve';

        // Explicit logic for short-term 6h reliability
        const outlookTime = language === 'ko' ? '향후 6시간 동안은' : 'for the next 6 hours';

        const POLLUTANTS_KEYS = { pm2_5: 3.0, pm10: 1.0, o3: 0.8, no2: 1.5 };
        let maxImpact = 0;
        let driver = 'PM2.5';
        Object.keys(POLLUTANTS_KEYS).forEach(key => {
            const val = currentHourData.components?.[key] || 0;
            const impact = val * POLLUTANTS_KEYS[key];
            if (impact > maxImpact) {
                maxImpact = impact;
                driver = key.toUpperCase().replace('_', '.');
            }
        });

        if (language === 'ko') {
            return `과거 기록상 가장 오염이 심했던 시간은 **${peakStr}**였습니다. 현재 추세는 **${trend}**이며, 주 원인은 **${driver}**입니다. 예보에 따르면 ${outlookTime} 공기질이 **${outlook}** 것으로 분석됩니다.`;
        } else {
            return `Pollution peaked at **${peakStr}**. Current trend is **${trend}** (Driver: **${driver}**). Air quality ${outlook} ${outlookTime}.`;
        }
    };

    const insightText = generateInsight();

    return (
        <div
            className={`card-base h-full flex flex-col justify-between overflow-hidden relative group transition-all duration-300 p-4 ${currentStatus.bg} cursor-help hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl`}
            onClick={() => setShowIconBoard(true)}
        >
            <ParticleBackground pm25={pm25} aqiLevel={calculatedAqi} />
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
                    className="relative w-[100px] h-[100px] flex-shrink-0"
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
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

            {mounted && createPortal(
                <AnimatePresence>
                    {showIconBoard && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowIconBoard(false)}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1c1e] border border-white/10 rounded-3xl p-4 max-w-[950px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-4">
                                    {/* LEFT: Level Guide */}
                                    <div className="w-[300px] flex flex-col gap-3">
                                        <div className="text-[14px] font-black uppercase tracking-widest text-white mb-1">
                                            🏠 {language === "ko" ? "등급 가이드" : "Level Guide"}
                                        </div>
                                        <div className="grid grid-cols-3 gap-y-2 gap-x-3 mb-1">
                                            {Object.keys(statusMap).map((level) => {
                                                const isCurrent = Number(level) === calculatedAqi;
                                                return (
                                                    <div key={level} className="flex flex-col items-center gap-0 cursor-help" onMouseEnter={() => setHoveredLevel(Number(level))} onMouseLeave={() => setHoveredLevel(null)}>
                                                        <div className={`relative w-[80px] h-[80px] flex items-center justify-center bg-white/5 rounded-2xl border transition-all ${isCurrent ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-1 ring-amber-500/30' : 'border-white/5 opacity-60 hover:opacity-100'}`}>
                                                            <img src={`/images/AQI-index/icon_aqi_${level}.png`} alt={statusMap[level].label} className="w-14 h-14 object-contain" />
                                                            {isCurrent && (
                                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ef4444] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg z-10">NOW</div>
                                                            )}
                                                        </div>
                                                        <span className="text-[16px] font-black tracking-tighter leading-none -mt-1" style={{ color: statusMap[level].color }}>{statusMap[level].label}</span>
                                                        <span className="text-[14px] font-black text-white/90 tracking-tighter leading-none mt-1">LEVEL-{level}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 mt-auto">
                                            <h5 className="text-[11px] font-black uppercase mb-1.5 tracking-[0.2em]" style={{ color: statusMap[hoveredLevel || calculatedAqi].color }}>{statusMap[hoveredLevel || calculatedAqi].label} GUIDE</h5>
                                            <p className="text-[11px] font-medium leading-relaxed text-white/60 line-clamp-4">{statusMap[hoveredLevel || calculatedAqi].detail}</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px bg-white/10 self-stretch" />

                                    {/* RIGHT: 24H Forecast Chart */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                                        <div className="text-[14px] font-black uppercase tracking-widest text-white">
                                            📊 {language === "ko" ? "24시간 오염물질 추이" : "24H Pollutant Trend"}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-4">
                                            <AQIChart
                                                sampled={sampled}
                                                nowTs={nowTs}
                                                nowIdx={nowIdx}
                                                timeRange={timeRange}
                                                setTimeRange={setTimeRange}
                                                language={language}
                                                setShowIconBoard={setShowIconBoard}
                                                highlightKey={highlightKey}
                                                setHighlightKey={setHighlightKey}
                                            />

                                            {/* AI Insight / Pollutant Info Box */}
                                            <div className="mt-auto p-3 bg-white/5 rounded-[20px] border border-white/10 relative overflow-hidden min-h-[100px] flex flex-col justify-center">
                                                <AnimatePresence mode="wait">
                                                    {highlightKey ? (
                                                        <motion.div
                                                            key="pollutant-info"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="absolute top-3 left-0 w-1 h-4 rounded-r-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: pollutantInfo[highlightKey].color, color: pollutantInfo[highlightKey].color }} />
                                                            <div className="text-[10px] font-black uppercase mb-1 tracking-[0.2em]" style={{ color: pollutantInfo[highlightKey].color }}>
                                                                {pollutantInfo[highlightKey].title}
                                                            </div>
                                                            <p className="text-[12px] leading-relaxed text-white/90 font-medium italic">
                                                                "{pollutantInfo[highlightKey].desc}"
                                                            </p>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="ai-report"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="absolute top-3 left-0 w-1 h-4 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                            <div className="text-[10px] font-black text-amber-500 uppercase mb-1 tracking-[0.2em]">{language === 'ko' ? 'AI 분석 리포트' : 'AI ANALYSIS REPORT'}</div>
                                                            <p className="text-[12px] leading-relaxed text-white/80 font-medium line-clamp-3">
                                                                {insightText && insightText.split('**').map((part, i) =>
                                                                    i % 2 === 1 ? <strong key={i} className="text-white font-black">{part}</strong> : part
                                                                )}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

function AQIChart({ sampled, nowTs, nowIdx, timeRange, setTimeRange, language, setShowIconBoard, highlightKey, setHighlightKey }) {
    const dispatch = useDispatch();
    const [hoveredIdx, setHoveredIdx] = useState(null);
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

    if (!sampled || sampled.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-white/30 text-sm font-bold">
                {language === 'ko' ? '데이터가 없습니다' : 'No Trend Data'}
            </div>
        );
    }

    const W = 380, H = 185;
    const PAD = { top: 40, right: 15, bottom: 30, left: 35 };
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

    const buildPath = (key, type = 'all') => {
        const points = sampled.map((h, i) => {
            const v = h.components?.[key] || 0;
            const isForecast = h.dt >= nowTs;
            if (type === 'history' && isForecast) return null;
            if (type === 'forecast' && !isForecast && i < nowIdx - 1) return null;
            return { x: getX(i), y: getY(v) };
        }).filter(Boolean);

        if (points.length === 0) return "";
        let d = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) { d += ` L${points[i].x},${points[i].y}`; }
        return d;
    };

    const buildAreaPath = (key) => {
        const points = sampled.map((h, i) => ({ x: getX(i), y: getY(h.components?.[key] || 0) }));
        if (points.length === 0) return "";
        let d = `M${points[0].x},${PAD.top + chartH}`;
        points.forEach(p => { d += ` L${p.x},${p.y}`; });
        d += ` L${points[points.length - 1].x},${PAD.top + chartH} Z`;
        return d;
    };

    // Time labels
    const timeLabels = [];
    const labelCount = 6;
    const labelStep = Math.max(1, Math.floor(sampled.length / labelCount));
    for (let i = 0; i < sampled.length; i += labelStep) {
        const d = new Date(sampled[i].dt * 1000);
        let label = timeRange <= 24 ? `${d.getHours()}:00` : `${d.getMonth() + 1}/${d.getDate()}`;
        timeLabels.push({ i, label });
    }

    const yTicks = [0, maxVal / 2, maxVal];
    const hoveredData = hoveredIdx !== null ? sampled[hoveredIdx] : null;

    const handleRangeChange = (hours) => {
        setTimeRange(hours);
        setChartKey(prev => prev + 1);
        setHoveredIdx(null);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="relative bg-[#1a1c1e] p-4 rounded-[28px] border border-white/10 shadow-inner">
                {/* Time Range Buttons inside Graph Card - Top Left */}
                <div className="absolute top-3 left-4 flex gap-1 z-10">
                    {timeRanges.map(({ hours, labelKo, labelEn }) => (
                        <button
                            key={hours}
                            onClick={() => handleRangeChange(hours)}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all border ${timeRange === hours
                                ? 'bg-white/20 border-white/30 text-white shadow-lg'
                                : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                                }`}
                        >
                            {language === 'ko' ? labelKo : labelEn}
                        </button>
                    ))}
                </div>

                {/* Floating Action Buttons inside Graph Card - Top Right */}
                <div className="absolute top-3 right-4 flex items-center gap-2 z-10">
                    <button
                        onClick={() => dispatch(setLanguage(language === "ko" ? "en" : "ko"))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-[10px] font-bold uppercase tracking-wider text-white/70 hover:text-white backdrop-blur-sm"
                    >
                        <Languages size={12} />
                        <span>{language === "ko" ? "EN" : "한"}</span>
                    </button>
                    <button
                        onClick={() => setShowIconBoard(false)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-white/70 hover:text-white backdrop-blur-sm"
                    >
                        <X size={14} />
                    </button>
                </div>

                <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
                    <defs>
                        {pollutants.map(p => (
                            <linearGradient key={`grad-${p.key}`} id={`grad-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={p.color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={p.color} stopOpacity="0" />
                            </linearGradient>
                        ))}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {yTicks.map((tick) => (
                        <g key={tick}>
                            <line x1={PAD.left} y1={getY(tick)} x2={W - PAD.right} y2={getY(tick)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                            <text x={PAD.left - 8} y={getY(tick) + 3} fill="rgba(255,255,255,0.3)" fontSize="10" fontWeight="900" textAnchor="end">{Math.round(tick)}</text>
                        </g>
                    ))}
                    {timeLabels.map(({ i, label }) => (
                        <text key={i} x={getX(i)} y={H - 5} fill="rgba(255,255,255,0.3)" fontSize="10" fontWeight="900" textAnchor="middle">{label}</text>
                    ))}

                    {pollutants.map((p, idx) => {
                        const historyPath = buildPath(p.key, 'history');
                        const forecastPath = buildPath(p.key, 'forecast');
                        const areaPath = buildAreaPath(p.key);
                        const isHighlighted = highlightKey === null || highlightKey === p.key;

                        return (
                            <g key={`${p.key}-${chartKey}`}>
                                <AnimatePresence>
                                    {highlightKey === p.key && (
                                        <motion.path
                                            d={areaPath} fill={`url(#grad-${p.key})`}
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <motion.path
                                    d={historyPath} fill="none" stroke={p.color} strokeWidth={isHighlighted ? 2 : 1}
                                    strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: isHighlighted ? 0.9 : 0.15 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    style={{ filter: isHighlighted && highlightKey ? 'url(#glow)' : 'none' }}
                                />
                                {forecastPath && (
                                    <motion.path
                                        d={forecastPath} fill="none" stroke={p.color} strokeWidth={isHighlighted ? 1.8 : 1}
                                        strokeDasharray="4,4" strokeLinecap="round" strokeLinejoin="round"
                                        initial={{ opacity: 0 }} animate={{ opacity: isHighlighted ? 0.5 : 0.15 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {nowIdx !== -1 && (
                        <line x1={getX(nowIdx)} y1={PAD.top} x2={getX(nowIdx)} y2={H - PAD.bottom} stroke="white" strokeWidth="1.5" strokeDasharray="3,3" className="opacity-30" />
                    )}

                    {sampled.map((_, i) => (
                        <rect key={i} x={getX(i) - 5} y={PAD.top} width="10" height={chartH} fill="transparent" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
                    ))}

                    {hoveredIdx !== null && (
                        <g>
                            {/* Tracking Ruler */}
                            <line x1={getX(hoveredIdx)} y1={PAD.top} x2={getX(hoveredIdx)} y2={PAD.top + chartH} stroke="white" strokeWidth="1" className="opacity-20" />

                            {/* Floating Time Label */}
                            <g transform={`translate(${getX(hoveredIdx)}, ${PAD.top - 15})`}>
                                <rect x="-35" y="-12" width="70" height="18" rx="9" fill="white" />
                                <text textAnchor="middle" y="1" fontSize="9" fontWeight="900" fill="#1a1c1e">
                                    {new Date(hoveredData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </text>
                            </g>

                            {pollutants.map(p => {
                                const v = hoveredData?.components?.[p.key] || 0;
                                const isTarget = highlightKey === p.key;
                                if (highlightKey && !isTarget) return null;

                                return (
                                    <g key={p.key}>
                                        <circle cx={getX(hoveredIdx)} cy={getY(v)} r={isTarget ? 5 : 4} fill={p.color} stroke="#1a1c1e" strokeWidth="2" />
                                        {(isTarget || !highlightKey) && (
                                            <g transform={`translate(${getX(hoveredIdx) + 8}, ${getY(v)})`}>
                                                <rect x="-2" y="-7" width="20" height="12" rx="4" fill="rgba(0,0,0,0.6)" className="backdrop-blur-[2px]" />
                                                <text y="2.5" x="8" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" className="drop-shadow-sm">
                                                    {Math.round(v)}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    )}
                </svg>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {pollutants.map(p => {
                    const val = hoveredData ? (hoveredData.components?.[p.key] || 0) : (sampled[sampled.length - 1]?.components?.[p.key] || 0);
                    return (
                        <div key={p.key} className="p-2 rounded-[18px] bg-white/5 border border-white/10 flex flex-col items-center gap-1 transition-all hover:bg-white/10" onMouseEnter={() => setHighlightKey(p.key)} onMouseLeave={() => setHighlightKey(null)}>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.label}</span>
                            </div>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-[20px] font-black tabular-nums leading-none" style={{ color: p.color }}>{Math.round(val)}</span>
                                <span className="text-[8px] font-black text-white/30">{language === 'ko' ? 'μg/m³' : p.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ParticleBackground({ pm25, aqiLevel }) {
    // Density increases with PM2.5 (cap at 200 particles)
    const particleCount = Math.min(Math.floor(pm25 * 1.5) + 20, 200);
    const particles = Array.from({ length: particleCount });

    // Murkiness/Turbidity effect based on AQI
    // Low AQI: clear, fast movement
    // High AQI: foggy, slow/heavy movement, more yellow/gray tint
    const isMurky = aqiLevel >= 4;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Fog Layer for high pollution */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{ opacity: isMurky ? (aqiLevel - 3) * 0.15 : 0 }}
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(150,150,150,0.2))' }}
            />

            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: Math.random() * 0.3 + 0.1,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: ["-10%", "110%"],
                        x: [
                            (Math.random() * 100) + "%",
                            (Math.random() * 100 + (Math.random() > 0.5 ? 10 : -10)) + "%"
                        ]
                    }}
                    transition={{
                        // Heavier air moves slower? Or chaotic? 
                        // Let's make it more chaotic but "heavy" (slower vertical, more horizontal jitter) if polluted
                        duration: Math.random() * 20 + (isMurky ? 20 : 10),
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * -30
                    }}
                    style={{
                        width: Math.random() * 3 + 1 + "px",
                        height: Math.random() * 3 + 1 + "px",
                        backgroundColor: isMurky ? '#a8a29e' : '#ffffff', // Grayish if murky, white if clear
                        filter: isMurky ? "blur(1.5px)" : "blur(0.5px)"
                    }}
                />
            ))}
        </div>
    );
}

