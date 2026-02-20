import { Eye, EyeOff } from "lucide-react";

const zones = [
  {
    name: "The Mysterious Forest",
    icon: "🌲",
    color: "hsl(142 50% 35%)",
    description: "Dark trees and dense bushes. The perfect place to hide.",
    items: ["Old Oaks", "Dense Bushes", "Fallen Trunks"],
  },
  {
    name: "The Abandoned Village",
    icon: "🏚️",
    color: "hsl(30 40% 35%)",
    description: "Half-ruined buildings and dark corners behind every door.",
    items: ["Old Cabins", "Old Mill", "The Well"],
  },
  {
    name: "The Ancient Ruins",
    icon: "🏛️",
    color: "hsl(260 30% 45%)",
    description: "Remnants of past times. Secrets hidden in the stones.",
    items: ["Stone Walls", "Dark Arches", "Old Passages"],
  },
  {
    name: "The Open Field",
    icon: "🌾",
    color: "hsl(55 50% 38%)",
    description: "Don't be fooled — the fog hides everything even here.",
    items: ["Tall Grass", "Rocks", "Abandoned Cart"],
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
