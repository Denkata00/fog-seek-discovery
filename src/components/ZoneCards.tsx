import { Eye, EyeOff } from "lucide-react";

const zones = [
  {
    name: "Мистериозната Гора",
    icon: "🌲",
    color: "hsl(142 50% 35%)",
    description: "Тъмни дървета и гъсти храсти. Идеалното място за криеница.",
    items: ["Стари дъбове", "Гъсти храсти", "Паднали стволове"],
  },
  {
    name: "Изоставеното Село",
    icon: "🏚️",
    color: "hsl(30 40% 35%)",
    description: "Полуразрушени постройки и тъмни ъгли зад всяка врата.",
    items: ["Стари колиби", "Воденица", "Кладенец"],
  },
  {
    name: "Древните Руини",
    icon: "🏛️",
    color: "hsl(260 30% 45%)",
    description: "Останки от минали времена. Тайни в камъните.",
    items: ["Каменни стени", "Тъмни подземия", "Стари арки"],
  },
  {
    name: "Открито Поле",
    icon: "🌾",
    color: "hsl(55 50% 38%)",
    description: "Не се лъжи — мъглата крие всичко дори тук.",
    items: ["Висока трева", "Скали", "Изоставени коли"],
  },
];

const ZoneCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {zones.map((zone) => (
        <div key={zone.name} className="card-atmospheric rounded-xl p-5 group cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{zone.icon}</span>
            <div>
              <h4
                className="font-display text-sm font-semibold"
                style={{ color: zone.color, fontFamily: "Cinzel, serif" }}
              >
                {zone.name}
              </h4>
            </div>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif", fontWeight: 300 }}>
            {zone.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {zone.items.map((item) => (
              <span
                key={item}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: `${zone.color}20`,
                  color: zone.color,
                  border: `1px solid ${zone.color}40`,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZoneCards;
