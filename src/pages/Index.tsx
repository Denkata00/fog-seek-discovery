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
      "You only see a small circle around yourself. The fog slowly returns after you move — the tension is constant.",
    color: "hsl(var(--primary))",
  },
  {
    icon: Map,
    title: "Discovery Map",
    description:
      "The map reveals only where you've walked. Every new zone brings new secrets and hidden people.",
    color: "hsl(42 75% 52%)",
  },
  {
    icon: MessageSquare,
    title: "AI Hints",
    description:
      "NPCs give atmospheric, cryptic hints. Never direct coordinates — only clues about direction and zone.",
    color: "hsl(260 60% 65%)",
  },
  {
    icon: Clock,
    title: "Timer & Score",
    description:
      "Find everyone before time runs out. Hints used and time remaining determine your final score.",
    color: "hsl(var(--destructive))",
  },
  {
    icon: Users,
    title: "Hide & Seek",
    description:
      "Hidden people spawn at random positions each round — the map is never the same.",
    color: "hsl(142 50% 45%)",
  },
  {
    icon: Compass,
    title: "Zones & Atmosphere",
    description:
      "Forest, village, ruins and field — each zone with a unique atmosphere, objects and hiding spots.",
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
        Game In Development
      </h3>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "hsl(var(--muted-foreground))", fontFamily: "Inter, sans-serif", fontWeight: 300 }}
      >
        <em>Fog & Seek</em> is being built in Godot. The fog will consume you soon —<br />
        stay tuned for updates!
      </p>

      <div className="flex flex-col gap-3">
        <a
          href="https://itch.io"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow w-full py-3 rounded-lg text-xs tracking-widest uppercase"
          style={{ fontFamily: "Cinzel, serif", textDecoration: "none", display: "block" }}
        >
          Follow on itch.io
        </a>
        <button
          onClick={onClose}
          className="btn-outline-glow w-full py-3 rounded-lg text-xs tracking-widest uppercase"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Close
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
          {/* Badge removed */}

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
            The world is shrouded in fog. Only a small circle of light follows you.
            <br />
            <em>Find everyone hidden before the darkness swallows you.</em>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/game")}
              className="btn-glow px-8 py-3.5 rounded-lg font-display text-sm tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Play Now
            </button>
            <button
              onClick={() => document.getElementById("mechanics")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline-glow px-8 py-3.5 rounded-lg font-display text-sm tracking-widest uppercase"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Learn More
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
                — About the Game
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                Discover the world{" "}
                <span className="text-gradient-cyan">step by step</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                In <strong style={{ color: "hsl(var(--primary))", fontWeight: 400 }}>Fog & Seek</strong>, the entire world is shrouded in fog. You only see a small circle around yourself. As you move away, the fog slowly returns — you never know what awaits around the next corner.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                Your goal: find all hidden people on the map. NPCs give you mysterious hints, but never coordinates. The theme is <em style={{ color: "hsl(var(--accent))" }}>Discovery</em> — you're not just finding people, you're gradually uncovering the world.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Exploration", "Fog", "AI Hints", "Discovery", "Tension"].map((tag) => (
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
              — Mechanics
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
              How to Play
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
                — The Map
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
                Four zones,{" "}
                <span className="text-gradient-amber">endless secrets</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
                The map is divided into distinct zones with unique character and atmosphere. Each zone contains objects behind which people can hide — and every round the hidden ones appear in new, random spots.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: "4", label: "Zones" },
                  { value: "∞", label: "Randomness" },
                  { value: "AI", label: "Hints" },
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
            — AI System
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "Cinzel, serif", color: "hsl(var(--foreground))" }}>
            Hints from{" "}
            <span className="text-gradient-cyan">the shadows</span>
          </h2>
          <p className="text-base leading-relaxed mb-12" style={{ color: "hsl(var(--foreground) / 0.6)", fontWeight: 300 }}>
            NPCs analyse the real position of the hidden person relative to you — direction, distance, zone type, nearby objects. The result: atmospheric, cryptic hints that guide you without giving it away directly.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <HintTyper />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: "🧭", label: "Direction", desc: "North, south, east, west — never exact coordinates" },
              { icon: "📏", label: "Distance", desc: "Close, far, very far — approximate only" },
              { icon: "🌲", label: "Zone & Object", desc: "Near the forest, by the abandoned cabin, among the rocks" },
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
            <span className="glow-text" style={{ color: "hsl(var(--foreground))" }}>Are you ready</span>
            <br />
            <span className="text-gradient-cyan">to discover?</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.55)", fontWeight: 300 }}>
            The fog is waiting. Somewhere out there, in the darkness,<br /> something hides that you must find.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/game")}
              className="btn-glow px-10 py-4 rounded-lg font-display text-sm tracking-widest uppercase animate-glow-pulse"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Enter the Fog
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
            Built with Godot · Theme: Discovery · 2D Top-Down
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
