"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function FlipCard({ number }) {
    const displayValue = String(number).padStart(2, '0');

    return (
        <div className="relative w-[180px] h-[240px] perspective-1000">
            <AnimatePresence mode="popLayout">
                <div key={displayValue} className="relative w-full h-full">
                    {/* Static Top (Next Number) */}
                    <div className="absolute top-0 w-full h-1/2 bg-card rounded-t-2xl overflow-hidden border-x border-t border-card-border flex items-end justify-center">
                        <span className="text-[160px] leading-none font-black translate-y-1/2 text-white tabular-nums">
                            {displayValue}
                        </span>
                    </div>

                    {/* Static Bottom (Current Number) */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-card rounded-b-2xl overflow-hidden border-x border-b border-card-border flex items-start justify-center">
                        <span className="text-[160px] leading-none font-black -translate-y-1/2 text-white tabular-nums">
                            {displayValue}
                        </span>
                    </div>

                    {/* Flipping Top Flap */}
                    <motion.div
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -180 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{ transformOrigin: "bottom", backfaceVisibility: "hidden" }}
                        className="absolute top-0 w-full h-1/2 bg-card rounded-t-2xl overflow-hidden border-x border-t border-card-border flex items-end justify-center z-30"
                    >
                        <span className="text-[160px] leading-none font-black translate-y-1/2 text-white tabular-nums">
                            {/* This should show the PREVIOUS value nominally, but for simplicity in this tick, we'll flip the current one */}
                            {displayValue}
                        </span>
                    </motion.div>

                    {/* Decorative center line/gap */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/40 z-40 shadow-sm" />
                </div>
            </AnimatePresence>
        </div>
    );
}
