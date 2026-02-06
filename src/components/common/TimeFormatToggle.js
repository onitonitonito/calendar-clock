"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTimeFormat } from "@/store/slices/uiSlice";
import { Clock } from "lucide-react";

export default function TimeFormatToggle() {
    const dispatch = useDispatch();
    const timeFormat = useSelector((state) => state.ui.timeFormat);

    const toggleFormat = () => {
        dispatch(setTimeFormat(timeFormat === "24h" ? "12h" : "24h"));
    };

    return (
        <button
            onClick={toggleFormat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[11px] font-bold uppercase tracking-wider backdrop-blur-md"
        >
            <Clock size={14} className="opacity-60" />
            <span>{timeFormat === "24h" ? "24H" : "12H"}</span>
        </button>
    );
}
