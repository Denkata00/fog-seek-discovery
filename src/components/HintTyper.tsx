import { useState, useEffect } from "react";

const hints = [
  "Чух шум от стъпки близо до изоставената къща…",
  "Мъглата е по-гъста на север, сякаш някой се крие там.",
  "Някой се крие близо до нещо високо… може би дърво.",
  "Усетих студено дъхание откъм западните руини.",
  "Тревата е смачкана — нечии крака са минавали наскоро.",
  "В мъглата се чуха далечни шепоти откъм гората.",
  "Птиците замлъкнаха на изток. Нещо ги е изплашило.",
  "Сенки танцуват зад старата воденица — не са от вятъра.",
];

const HintTyper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = hints[currentIndex];
    let i = 0;
    setDisplayed("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % hints.length);
        }, 3000);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <div className="relative rounded-lg p-6 card-atmospheric glow-border min-h-[100px] flex items-center">
      <div className="absolute top-3 left-4 flex gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary) / 0.6)" }} />
        <span className="text-xs font-body" style={{ color: "hsl(var(--primary))", fontFamily: "Inter, sans-serif", fontWeight: 300 }}>
          NPC Подсказка
        </span>
      </div>
      <p
        className="mt-4 text-sm leading-relaxed italic"
        style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "Inter, sans-serif", fontWeight: 300 }}
      >
        "{displayed}
        {isTyping && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 align-middle"
            style={{ background: "hsl(var(--primary))", animation: "glow-pulse 1s ease-in-out infinite" }}
          />
        )}
        "
      </p>
    </div>
  );
};

export default HintTyper;
