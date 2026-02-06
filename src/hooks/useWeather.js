"use client";

import { useState, useEffect } from "react";
import { useGetWeatherQuery, useGetAirQualityQuery } from "@/store/services/weatherApi";

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

    const { data: weather, isLoading: weatherLoading } = useGetWeatherQuery(coords);
    const { data: aqi, isLoading: aqiLoading } = useGetAirQualityQuery(coords);

    return {
        weather,
        aqi: aqi?.list?.[0],
        isLoading: weatherLoading || aqiLoading,
    };
}
