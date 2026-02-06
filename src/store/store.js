import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import uiReducer from "./slices/uiSlice";
import { weatherApi } from "./services/weatherApi";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      weatherApi.middleware,
    ]),
});

setupListeners(store.dispatch);
