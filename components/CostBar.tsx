"use client";

import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useEffect, useState } from "react";

interface CostBreakdown {
  currency: string;
  llm_model: string;
  llm_per_min: number;
  tts_provider: string;
  tts_per_min: number;
  stt_provider: string;
  stt_per_min: number;
  telephony_per_min: number;
  platform_per_min: number;
  total_per_min: number;
}

interface Props {
  cost: CostBreakdown | null;
}

export default function CostBar({ cost }: Props) {
  const [internalCost, setInternalCost] = useState(cost);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cost) return;
    setLoading(true);
    const t = setTimeout(() => {
      setInternalCost(cost);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [cost]);

  if (!internalCost) return null;

  // ✅ Soft pastel palette
  const segments = [
    {
      label: "LLM",
      value: internalCost.llm_per_min,
      color: "from-indigo-300 to-indigo-400",
    },
    {
      label: "TTS",
      value: internalCost.tts_per_min,
      color: "from-emerald-200 to-emerald-300",
    },
    {
      label: "STT",
      value: internalCost.stt_per_min,
      color: "from-amber-200 to-amber-300",
    },
    {
      label: "Telephony",
      value: internalCost.telephony_per_min,
      color: "from-rose-200 to-rose-300",
    },
    {
      label: "Platform",
      value: internalCost.platform_per_min,
      color: "from-gray-200 to-gray-300",
    },
  ];

  const total = internalCost.total_per_min;

  const totalMV = useMotionValue(total);
  const totalSpring = useSpring(totalMV, { stiffness: 120, damping: 20 });
  const totalTextNum = useTransform(totalSpring, (v) =>
    Number.isFinite(v) ? v.toFixed(3) : "0.000"
  );
  const totalText = useMotionTemplate`$${totalTextNum}`;

  useEffect(() => {
    totalMV.set(total);
  }, [total, totalMV]);

  return (
    <motion.div
      layout
      className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm relative overflow-hidden"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer z-10"
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide">
          Estimated Cost per Minute ({internalCost.currency})
        </h2>
        <motion.span className="font-bold text-indigo-600 text-sm">
          {totalText}
        </motion.span>
      </div>

      {/* pastel gradient bar */}
      <div className="flex w-full h-4 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shadow-inner">
        {segments.map((seg) => (
          <motion.div
            key={seg.label}
            layout
            animate={{ width: `${(seg.value / (total || 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`h-full bg-gradient-to-r ${seg.color}`}
            style={{
              opacity: seg.value === 0 ? 0.3 : 1,
            }}
          />
        ))}
      </div>

      {/* legend */}
      <div className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-700">
        <AnimatePresence>
          {segments.map((seg) => {
            const segMV = useMotionValue(seg.value);
            const segSpring = useSpring(segMV, { stiffness: 120, damping: 15 });
            const segNum = useTransform(segSpring, (v) =>
              Number.isFinite(v) ? v.toFixed(3) : "0.000"
            );
            const segText = useMotionTemplate`$${segNum}`;

            useEffect(() => {
              segMV.set(seg.value);
            }, [seg.value]);

            return (
              <motion.div
                key={seg.label}
                layout
                className="flex justify-between items-center gap-3"
              >
                <span className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`inline-block w-3 h-3 rounded-sm bg-gradient-to-r ${seg.color} shadow-sm`}
                  />
                  {seg.label}
                </span>
                <motion.span className="font-medium text-gray-800 whitespace-nowrap">
                  {segText}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
