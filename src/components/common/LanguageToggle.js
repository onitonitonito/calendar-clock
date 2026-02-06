"use client";

import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "@/store/slices/uiSlice";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.ui.language);

    const toggleLanguage = () => {
        dispatch(setLanguage(language === "ko" ? "en" : "ko"));
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[11px] font-bold uppercase tracking-wider backdrop-blur-md"
        >
            <Languages size={14} className="opacity-60" />
            <span>{language === "ko" ? "ENGLISH" : "한국어"}</span>
        </button>
    );
}
