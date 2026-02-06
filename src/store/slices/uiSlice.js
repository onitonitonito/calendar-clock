import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark",
    timeFormat: "24h", // '12h' or '24h'
    language: "ko", // 'ko' or 'en'
    alarmTime: null, // timestamp
    isAlarmActive: false, // triggered state
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
        setAlarmByMinutes: (state, action) => {
            const now = new Date();
            state.alarmTime = now.getTime() + action.payload * 60 * 1000;
            state.isAlarmActive = false;
        },
        setAlarmManual: (state, action) => {
            state.alarmTime = action.payload;
            state.isAlarmActive = false;
        },
        setAlarmTriggered: (state, action) => {
            state.isAlarmActive = action.payload;
        },
        clearAlarm: (state) => {
            state.alarmTime = null;
            state.isAlarmActive = false;
        },
    },
});

export const { setTheme, setTimeFormat, setLanguage, setAlarmByMinutes, setAlarmManual, setAlarmTriggered, clearAlarm } = uiSlice.actions;

export default uiSlice.reducer;
