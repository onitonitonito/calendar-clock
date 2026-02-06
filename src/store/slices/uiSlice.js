import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark",
    timeFormat: "24h", // '12h' or '24h'
    language: "ko", // 'ko' or 'en'
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setTimeFormat: (state, action) => {
            state.timeFormat = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { setTheme, setTimeFormat, setLanguage } = uiSlice.actions;

export default uiSlice.reducer;
