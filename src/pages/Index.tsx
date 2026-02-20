import heroImage from "@/assets/fog-seek-hero.jpg";
import npcImage from "@/assets/fog-seek-npc.jpg";
import FogParticles from "@/components/FogParticles";
import HintTyper from "@/components/HintTyper";
import ZoneCards from "@/components/ZoneCards";
import { Eye, Map, MessageSquare, Clock, Users, Compass, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Eye,
    title: "Vision Radius",
    description:
      "Виждаш само малък кръг около себе си. Мъглата постепенно се връща след твоя преход — напрежението е постоянно.",
    color: "hsl(var(--primary))",
  },
  {
    icon: Map,
    title: "Discovery Map",
    description:
      "Картата се разкрива само там, където си стъпвал. Всяка нова зона носи нови тайни и скрити хора.",
    color: "hsl(42 75% 52%)",
  },
  {
    icon: MessageSquare,
    title: "AI Подсказки",
    description:
      "NPC-тата дават атмосферни, загадъчни подсказки. Никога преки координати — само намеци за посока и зона.",
    color: "hsl(260 60% 65%)",
  },
  {
    icon: Clock,
    title: "Таймер & Score",
    description:
      "Намери всички преди времето да изтече. Броят подсказки и времето определят крайния резултат.",
    color: "hsl(var(--destructive))",
  },
  {
    icon: Users,
    title: "Hide & Seek",
    description:
      "Скриващите се хора са на случайни позиции при всеки нов рунд — картата никога не е същата.",
    color: "hsl(142 50% 45%)",
  },
  {
    icon: Compass,
    title: "Зони & Атмосфера",
    description:
      "Гора, село, руини и поле — всяка зона с уникална атмосфера, обекти и места за скриване.",
    color: "hsl(30 65% 50%)",
  },
];

const ComingSoonModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-6"
    style={{ background: "hsl(218 45% 4% / 0.85)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <div
      className="relative max-w-md w-full rounded-2xl p-8 text-center"
      style={{
        background: "hsl(218 40% 7%)",
        border: "1px solid hsl(185 80% 52% / 0.35)",
        boxShadow: "0 0 60px hsl(185 80% 52% / 0.15), 0 20px 60px hsl(218 45% 2% / 0.8)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Glow orb */}
      <div
        className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center animate-glow-pulse"
        style={{
          background: "hsl(185 80% 52% / 0.12)",
          border: "1px solid hsl(185 80% 52% / 0.4)",
        }}
      >
        <div
          className="w-6 h-6 rounded-full"
          style={{ background: "hsl(185 80% 52%)", boxShadow: "0 0 20px hsl(185 80% 52%)" }}
        />
      </div>

      <h3
        className="text-2xl font-bold mb-3 glow-text"
        style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}
      >
        Играта е в разработка
      </h3>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif", fontWeight: 300 }}
      >
        <em>Fog & Seek</em> се създава в Godot. Мъглата скоро ще те погълне —<br />
        следи за обновления!
      </p>

      <div className="flex flex-col gap-3">
        <a
          href="https://itch.io"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow w-full py-3 rounded-lg text-xs tracking-widest uppercase"
          style={{ fontFamily: "Cinzel, serif", textDecoration: "none", display: "block" }}
        >
          Следи на itch.io
        </a>
        <button
          onClick={onClose}
          className="btn-outline-glow w-full py-3 rounded-lg text-xs tracking-widest uppercase"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Затвори
        </button>
      </div>

      {/* Fog particles inside modal */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${15 + i * 14}%`,
              width: 2 + i % 2,
              height: 2 + i % 2,
              background: "hsl(185 80% 52% / 0.5)",
              boxShadow: "0 0 6px hsl(185 80% 52% / 0.6)",
              animation: `particle-float ${10 + i * 2}s ${i * 1.5}s linear infinite`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen relative"
      style={{ background: "hsl(var(--background))", fontFamily: "Inter, sans-serif" }}
    >
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fog & Seek game atmosphere"
            className="w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
          {/* Fog gradient overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, hsl(218 45% 4% / 0.5) 0%, transparent 30%, transparent 60%, hsl(218 45% 4%) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(218 45% 4% / 0.6) 100%)" }}
          />
        </div>

        {/* Floating fog layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 20% 40%, hsl(218 45% 4% / 0.4) 0%, transparent 100%)",
            animation: "fog-drift 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 80% 60%, hsl(218 45% 4% / 0.35) 0%, transparent 100%)",
            animation: "fog-drift-reverse 22s ease-in-out infinite",
          }}
        />

        {/* Particles */}
        <FogParticles />

        {/* Vision glow effect */}
        <div
          className="absolute pointer-events-none vision-circle"
          style={{
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(185 80% 52% / 0.06) 0%, transparent 70%)",
            border: "1px solid hsl(185 80% 52% / 0.12)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.3)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-glow-pulse" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(var(--primary))", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
              2D Top-Down · Godot · Discovery
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold mb-2 glow-text"
            style={{
              fontFamily: "Cinzel, serif",
              color: "hsl(var(--foreground))",
              lineHeight: 1.05,
            }}
          >
            FOG &
          </h1>
          <h1
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{
              fontFamily: "Cinzel, serif",
              color: "hsl(var(--primary))",
              lineHeight: 1.05,
              textShadow: "0 0 40px hsl(185 80% 52% / 0.5), 0 0 80px hsl(185 80% 52% / 0.25)",
            }}
          >
            SEEK
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "hsl(var(--foreground) / 0.65)", fontWeight: 300 }}
          >
            Светът е покрит с мъгла. Само малък кръг светлина те следва.
            <br />
            <em>Намери всички скрити, преди тъмнината те погълне.</em>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/game")}
              className="btn-glow px-8 py-3.5 rounded-lg font-display text-sm tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Играй Сега
            </button>
            <button
              onClick={() => document.getElementById("mechanics")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline-glow px-8 py-3.5 rounded-lg font-display text-sm tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Научи Повече
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif" }}>Scroll</span>
          <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))", animation: "float 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ==================== CONCEPT ==================== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, hsl(185 80% 52% / 0.03) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "hsl(var(--primary))", fontFamily: "Inter, sans-serif" }}>
                — За Играта
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                Отkriй света{" "}
                <span className="text-gradient-cyan">стъпка по стъпка</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                В <strong style={{ color: "hsl(var(--primary))", fontWeight: 400 }}>Fog & Seek</strong>, целият свят е обвит в мъгла. Виждаш само малък кръг около себе си. Когато се отдалечиш, мъглата бавно се завръща — никога не знаеш какво те чака зад следващия ъгъл.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                Твоята цел: намери всички скрити хора на картата. NPC-тата ти дават мистериозни подсказки, но координати — никога. Темата е <em style={{ color: "hsl(var(--accent))" }}>Discovery</em> — не просто търсиш хора, а постепенно разкриваш света.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Изследване", "Мъгла", "AI Подсказки", "Discovery", "Напрежение"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: "hsl(var(--secondary))",
                      color: "hsl(var(--foreground) / 0.7)",
                      border: "1px solid hsl(var(--border))",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-glow), var(--shadow-card)" }}>
                <img src={npcImage} alt="NPC in foggy village" className="w-full object-cover" style={{ height: "420px" }} />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, hsl(218 45% 4%) 0%, transparent 50%)" }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <HintTyper />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-12" />

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(260 60% 52% / 0.03) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "hsl(var(--primary))", fontFamily: "Inter, sans-serif" }}>
              — Механики
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
              Как се играе
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="card-atmospheric rounded-xl p-6 group">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}30` }}
                  >
                    <Icon size={18} style={{ color: feat.color }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))", fontWeight: 300 }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider mx-12" />

      {/* ==================== ZONES ==================== */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "hsl(var(--accent))", fontFamily: "Inter, sans-serif" }}>
                — Картата
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                Четири зони,{" "}
                <span className="text-gradient-amber">безкрайни тайни</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                Картата е разделена на различни зони с уникален характер и атмосфера. Всяка зона съдържа обекти, зад които могат да се крият хора — и всяка рунд скриващите се появяват на нови, случайни места.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: "4", label: "Зони" },
                  { value: "∞", label: "Рандомност" },
                  { value: "AI", label: "Подсказки" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-lg" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
                    <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--primary))" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ZoneCards />
          </div>
        </div>
      </section>

      <div className="section-divider mx-12" />

      {/* ==================== AI HINTS ==================== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, hsl(185 80% 52% / 0.04) 0%, transparent 65%)" }}
        />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "hsl(var(--primary))", fontFamily: "Inter, sans-serif" }}>
            — AI Система
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
            Подсказки от{" "}
            <span className="text-gradient-cyan">сенките</span>
          </h2>
          <p className="text-base leading-relaxed mb-12" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
            NPC-тата анализират реалната позиция на скрития спрямо теб — посока, дистанция, тип зона, близки обекти. Резултатът: атмосферни, загадъчни подсказки, които те водят без да те отведат директно.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <HintTyper />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: "🧭", label: "Посока", desc: "Север, юг, изток, запад — никога точни координати" },
              { icon: "📏", label: "Дистанция", desc: "Близо, далеч, много далеч — приблизително" },
              { icon: "🌲", label: "Зона & Обект", desc: "До гората, до изоставената къща, край скалите" },
            ].map((item) => (
              <div key={item.label} className="card-atmospheric rounded-xl p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="text-sm font-semibold mb-1" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                  {item.label}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))", fontWeight: 300 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-12" />

      {/* ==================== CTA ==================== */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(185 80% 52% / 0.06) 0%, transparent 70%)" }} />
        <FogParticles />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Cinzel, serif" }}>
            <span className="glow-text" style={{ color: "hsl(var(--foreground))" }}>Готов ли си</span>
            <br />
            <span className="text-gradient-cyan">да откриеш?</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.55)", fontWeight: 300 }}>
            Мъглата те чака. Някъде там, в тъмнината,<br /> се крие нещо, което трябва да намериш.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/game")}
              className="btn-glow px-10 py-4 rounded-lg font-display text-sm tracking-widest uppercase animate-glow-pulse"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Влез в Мъглата
            </button>
            <button
              className="btn-outline-glow px-10 py-4 rounded-lg font-display text-sm tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              GitHub
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 px-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.4)" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))", boxShadow: "0 0 6px hsl(var(--primary))" }} />
            </div>
            <span className="text-sm font-semibold" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
              Fog & Seek
            </span>
          </div>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif" }}>
            Създадено с Godot · Тема: Discovery · 2D Top-Down
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
