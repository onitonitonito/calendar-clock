"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FlipClock from "@/components/clock/FlipClock";
import WeatherWidget from "@/components/weather/WeatherWidget";
import AQIWidget from "@/components/weather/AQIWidget";
import CalendarWidget from "@/components/calendar/CalendarWidget";
import LanguageToggle from "@/components/common/LanguageToggle";
import TimeFormatToggle from "@/components/common/TimeFormatToggle";
import AlarmSetting from "@/components/clock/AlarmSetting";
import { useWeather } from "@/hooks/useWeather";

export default function Dashboard() {
  const { weather, aqi, aqiHistory, isLoading } = useWeather();
  const [mounted, setMounted] = useState(false);
  const language = useSelector((state) => state.ui.language);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const dateString = language === "ko"
    ? today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '. ').replace(/\.$/, '')
    : today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const dayOfWeek = today.toLocaleDateString(language === "ko" ? 'ko-KR' : 'en-US', { weekday: 'long' });

  if (!mounted) {
    return (
      <main className="w-full h-full bg-background text-foreground p-8 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-xs opacity-20 uppercase tracking-widest font-bold">Loading DeskClock...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full bg-background text-foreground p-8 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Top Header with Toggles */}
      <div className="absolute top-8 right-8 z-50 flex gap-2">
        <AlarmSetting />
        <TimeFormatToggle />
        <LanguageToggle />
      </div>

      <div className="w-full max-w-[1000px] grid grid-cols-12 gap-8">
        {/* Left Side: Clock & Weather (8 columns) */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Flip Clock Area */}
          <div className="flex items-center justify-center py-4">
            <FlipClock />
          </div>

          {/* Bottom Area: Weather & AQI */}
          <div className="grid grid-cols-2 gap-6 h-[200px]">
            <WeatherWidget data={weather} isLoading={isLoading} />
            <AQIWidget data={aqi} aqiHistory={aqiHistory} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Side: Calendar & D-Day (4 columns) */}
        <div className="col-span-4 flex flex-col gap-8">
          <CalendarWidget />

          <div className="h-[140px] card-base flex flex-col justify-center px-6">
            <div className="text-[11px] uppercase tracking-widest opacity-40 font-bold">
              {language === "ko" ? "오늘" : "TODAY"}
            </div>
            <div className="text-4xl font-black my-0.5 tracking-tighter">{dateString}</div>
            <div className="text-sm opacity-40 uppercase font-bold tracking-wider">{dayOfWeek}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
