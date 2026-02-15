"use client";

import { useState, useEffect } from "react";
import { useGetWeatherQuery, useGetAirQualityQuery, useGetAirQualityHistoryQuery, useGetAirQualityForecastQuery, useGetForecastQuery } from "@/store/services/weatherApi";

export function useWeather() {
    const [coords, setCoords] = useState({ lat: 37.2636, lon: 127.0286 }); // Default: Suwon

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            });
        }
    }, []);

    const now = Math.floor(Date.now() / 1000);
    const last7d = now - (7 * 24 * 60 * 60);

    const { data: weather, isLoading: weatherLoading } = useGetWeatherQuery(coords);
    const { data: aqi, isLoading: aqiLoading } = useGetAirQualityQuery(coords);
    const { data: aqiHistory, isLoading: historyLoading } = useGetAirQualityHistoryQuery({ ...coords, start: last7d, end: now });
    const { data: aqiForecast, isLoading: aqiForecastLoading } = useGetAirQualityForecastQuery(coords);
    const { data: forecast, isLoading: forecastLoading } = useGetForecastQuery(coords);

    return {
        weather: {
            ...weather,
            pop: forecast?.list?.[0]?.pop ? Math.round(forecast.list[0].pop * 100) : 0,
            forecastList: forecast?.list || []
        },
        aqi: aqi?.list?.[0],
        aqiHistory: aqiHistory?.list || [],
        aqiForecast: aqiForecast?.list || [],
        isLoading: weatherLoading || aqiLoading || historyLoading || aqiForecastLoading || forecastLoading,
    };
}
