"use client";

import { Cloud, Sun, CloudRain, Wind, Sunrise, Sunset, Eye, Droplets, Umbrella, Thermometer } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WeatherWidget({ data, isLoading }) {
    const language = useSelector((state) => state.ui.language);
    const timeFormat = useSelector((state) => state.ui.timeFormat);
    const [isHovered, setIsHovered] = useState(false);

    if (isLoading || !data || !data.main) {
        return (
            <div className="card-base flex flex-col justify-center items-center animate-pulse">
                <div className="h-8 w-16 bg-white/5 rounded mb-2" />
                <div className="h-4 w-24 bg-white/5 rounded" />
            </div>
        );
    }

    const { main, weather, name, sys, visibility, wind, pop } = data;
    const temp = Math.round(main.temp);
    const condition = weather[0].main;

    const getIcon = (size = 32) => {
        switch (condition) {
            case "Clear": return <Sun className="text-yellow-400" size={size} />;
            case "Clouds": return <Cloud className="text-gray-400" size={size} />;
            case "Rain": return <CloudRain className="text-blue-400" size={size} />;
            default: return <Wind size={size} />;
        }
    };

    const formatSunTime = (timestamp) => {
        if (!timestamp) return "--:--";
        const date = new Date(timestamp * 1000);
        const timeStr = date.toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return timeStr.replace(/\s?[AP]M/i, "").trim();
    };

    const visibilityKm = (visibility / 1000).toFixed(1);

    const stats = [
        { id: 'temp', icon: <Thermometer size={10} />, label: language === "ko" ? "최저/최고" : "MIN/MAX", value: `${Math.round(main.temp_min)}°/${Math.round(main.temp_max)}°`, color: "text-rose-400" },
        { id: 'humi', icon: <Droplets size={10} />, label: language === "ko" ? "습도" : "HUMI", value: `${main.humidity}%`, color: "text-blue-400" },
        { id: 'rain', icon: <Umbrella size={10} />, label: language === "ko" ? "강우확률" : "RAIN", value: `${pop}%`, color: "text-cyan-400" },
        { id: 'wind', icon: <Wind size={10} />, label: language === "ko" ? "풍속" : "WIND", value: `${wind.speed}m/s`, color: "text-emerald-400" },
        { id: 'vis', icon: <Eye size={10} />, label: language === "ko" ? "가시거리" : "VIS", value: `${visibilityKm}km`, color: "text-indigo-400" },
    ];

    return (
        <motion.div
            className="card-base h-full flex flex-col justify-between overflow-hidden relative group cursor-default p-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header: Label */}
            <div className="text-[9px] uppercase tracking-[0.2em] opacity-30 font-black mb-1">
                {language === "ko" ? "날씨 리포트" : "WEATHER REPORT"}
            </div>

            {/* Middle Section: Main Visuals (Left: Weather, Right: Sun) */}
            <div className="flex-1 flex items-center justify-between min-h-0 relative">
                {/* Left: Current Weather */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{
                            y: isHovered ? [0, -5, 0] : 0,
                            filter: isHovered ? "drop-shadow(0 0 8px rgba(255,255,255,0.2))" : "none"
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="relative"
                    >
                        {getIcon(48)}

                        {/* 5. Rain/Snow Alert Badge */}
                        {data.forecastList?.slice(0, 8).some(f => (f.pop || 0) > 0.6) && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-rose-500 border-2 border-background rounded-full p-1 shadow-lg"
                                title={language === "ko" ? "곧 비나 눈이 올 예정입니다" : "Rain/Snow expected soon"}
                            >
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <Umbrella size={10} className="text-white" />
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                    <div className="flex flex-col">
                        <div className="text-4xl font-black tracking-tighter leading-none">{temp}°C</div>
                        <span className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-wider truncate max-w-[120px]">{weather[0].description} • {name}</span>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="h-14 w-[1px] bg-white/5 mx-2" />

                {/* Right: Sunrise/Sunset (Vertical Stack & White Time) */}
                <div className="flex flex-col gap-3 pr-2 min-w-[80px]">
                    <motion.div
                        className="flex items-center justify-end gap-3"
                        animate={{
                            x: isHovered ? 0 : 5,
                            opacity: isHovered ? 1 : 0.6
                        }}
                    >
                        <span className="text-sm font-black tracking-tighter text-white tabular-nums">
                            {formatSunTime(sys.sunrise)}
                        </span>
                        <Sunrise className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]" size={24} />
                    </motion.div>

                    <motion.div
                        className="flex items-center justify-end gap-3"
                        animate={{
                            x: isHovered ? 0 : 5,
                            opacity: isHovered ? 1 : 0.6
                        }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-sm font-black tracking-tighter text-white tabular-nums">
                            {formatSunTime(sys.sunset)}
                        </span>
                        <Sunset className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]" size={24} />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Section: Stats Grid (Single Row Style) */}
            <div className="mt-3 pt-3 border-t border-white/5">
                <div className="grid grid-cols-5 gap-1">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col items-center">
                            <div className="flex items-center gap-1 opacity-30 mb-1">
                                {stat.icon}
                                <span className="text-[7px] font-black uppercase tracking-tighter leading-none whitespace-nowrap">{stat.label}</span>
                            </div>
                            <span className={`text-[10px] font-black tabular-nums ${stat.color} leading-none`}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
