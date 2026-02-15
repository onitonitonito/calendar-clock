import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export const weatherApi = createApi({
    reducerPath: "weatherApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.openweathermap.org/data/2.5/" }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: ({ lat, lon }) => `weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`,
        }),
        getAirQuality: builder.query({
            query: ({ lat, lon }) => `air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`,
        }),
        getAirQualityHistory: builder.query({
            query: ({ lat, lon, start, end }) => `air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${WEATHER_API_KEY}`,
        }),
        getAirQualityForecast: builder.query({
            query: ({ lat, lon }) => `air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`,
        }),
        getForecast: builder.query({
            query: ({ lat, lon }) => `forecast?lat=${lat}&lon=${lon}&units=metric&cnt=8&appid=${WEATHER_API_KEY}`,
        }),
    }),
});

export const { useGetWeatherQuery, useGetAirQualityQuery, useGetAirQualityHistoryQuery, useGetAirQualityForecastQuery, useGetForecastQuery } = weatherApi;
