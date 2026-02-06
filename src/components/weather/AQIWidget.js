import { useSelector } from "react-redux";

export default function AQIWidget({ data, isLoading }) {
    const language = useSelector((state) => state.ui.language);
    if (isLoading || !data) {
        return (
            <div className="card-base animate-pulse">
                <div className="h-full bg-gray-700 rounded"></div>
            </div>
        );
    }

    const { components, main } = data;
    const aqi = main.aqi; // 1 to 5
    const pm10 = Math.round(components.pm10);
    const pm25 = Math.round(components.pm2_5);

    const getAqiStatus = (val) => {
        if (language === "ko") {
            if (val <= 2) return { label: "좋음", color: "text-green-400", border: "border-green-400" };
            if (val <= 3) return { label: "보통", color: "text-yellow-400", border: "border-yellow-400" };
            return { label: "나쁨", color: "text-red-400", border: "border-red-400" };
        } else {
            if (val <= 2) return { label: "Good", color: "text-green-400", border: "border-green-400" };
            if (val <= 3) return { label: "Fair", color: "text-yellow-400", border: "border-yellow-400" };
            return { label: "Poor", color: "text-red-400", border: "border-red-400" };
        }
    };

    const status = getAqiStatus(aqi);

    return (
        <div className="card-base flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform">
            <div className="text-xs uppercase tracking-widest opacity-50 font-bold">
                {language === "ko" ? "대기질" : "AIR QUALITY"}
            </div>

            <div className="flex justify-around items-center py-2">
                <div className="flex flex-col items-center gap-1">
                    <div className={`w-14 h-14 rounded-full border-4 ${status.border} flex items-center justify-center font-black text-lg`}>
                        {pm10}
                    </div>
                    <span className="text-[9px] opacity-50 font-bold">
                        {language === "ko" ? "미세먼지 (PM10)" : "PM10"}
                    </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-14 h-14 rounded-full border-4 border-accent/40 flex items-center justify-center font-black text-lg">
                        {pm25}
                    </div>
                    <span className="text-[9px] opacity-50 font-bold">
                        {language === "ko" ? "초미세먼지 (PM2.5)" : "PM2.5"}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold">
                <span className={status.color}>{status.label}</span>
                <span className="opacity-40 uppercase">
                    {language === "ko" ? "수원시" : "Suwon-si"}
                </span>
            </div>
        </div>
    );
}
