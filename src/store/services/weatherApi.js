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
    }),
});

export const { useGetWeatherQuery, useGetAirQualityQuery } = weatherApi;
