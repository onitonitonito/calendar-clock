"use client";

import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { useSelector } from "react-redux";

export default function WeatherWidget({ data, isLoading }) {
    const language = useSelector((state) => state.ui.language);
    if (isLoading || !data) {
        return (
            <div className="card-base flex flex-col justify-center items-center animate-pulse">
                <div className="h-8 w-16 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
            </div>
        );
    }

    const { main, weather, name } = data;
    const temp = Math.round(main.temp);
    const condition = weather[0].main;

    const getIcon = () => {
        switch (condition) {
            case "Clear": return <Sun className="text-yellow-400" size={32} />;
            case "Clouds": return <Cloud className="text-gray-400" size={32} />;
            case "Rain": return <CloudRain className="text-blue-400" size={32} />;
            default: return <Wind size={32} />;
        }
    };

    return (
        <div className="card-base flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start">
                <div className="text-xs uppercase tracking-widest opacity-50 font-bold">
                    {language === "ko" ? "날씨" : "WEATHER"}
                </div>
                {getIcon()}
            </div>

            <div>
                <div className="text-5xl font-black mb-1">{temp}°C</div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{weather[0].description}</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter">{name}</span>
                </div>
            </div>

            <div className="flex gap-4 mt-2 text-[10px] opacity-60">
                <span>{language === "ko" ? "최고" : "H"}: {Math.round(main.temp_max)}°</span>
                <span>{language === "ko" ? "최저" : "L"}: {Math.round(main.temp_min)}°</span>
                <span>{language === "ko" ? "습도" : "HUMI"}: {main.humidity}%</span>
            </div>
        </div>
    );
}
