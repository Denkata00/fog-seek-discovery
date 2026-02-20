import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================
//  CONSTANTS
// ============================================================
const MAP_W = 2400;
const MAP_H = 1800;
const VISION_R = 130;
const PLAYER_SPEED = 2.8;
const FIND_R = 70;
const NPC_INTERACT_R = 85;
const GAME_DURATION = 300;

// ============================================================
//  TYPES
// ============================================================
interface Vec2 { x: number; y: number; }
interface HiddenPerson { id: number; x: number; y: number; zone: number; found: boolean; }
interface NPC { id: number; x: number; y: number; zone: number; name: string; }
interface MapObj { x: number; y: number; w: number; h: number; type: 'tree' | 'building' | 'rock' | 'ruin' | 'bush'; }
type GamePhase = 'start' | 'playing' | 'won' | 'lost';

// ============================================================
//  MAP DATA
// ============================================================
const ZONE_COLORS = ['#0c1f0e', '#19120a', '#10141a', '#111a0d'];
const ZONE_NAMES_BG = ['гората', 'селото', 'руините', 'полето'];
const ZONE_FEATURES = [
  ['стари дъбове', 'гъсти храсти', 'паднал ствол'],
  ['изоставената колиба', 'старата воденица', 'кладенеца'],
  ['каменните стени', 'старите арки', 'тъмния ъгъл'],
  ['скалите', 'високата трева', 'изоставената каруца'],
];

const getZone = (x: number, y: number) => {
  if (x < 1200 && y < 900) return 0;
  if (x >= 1200 && y < 900) return 1;
  if (x < 1200 && y >= 900) return 2;
  return 3;
};

const INITIAL_HIDDEN: HiddenPerson[] = [
  { id: 0, x: 320, y: 260, zone: 0, found: false },
  { id: 1, x: 1640, y: 340, zone: 1, found: false },
  { id: 2, x: 820, y: 1380, zone: 2, found: false },
  { id: 3, x: 1920, y: 1520, zone: 3, found: false },
  { id: 4, x: 980, y: 680, zone: 0, found: false },
];

const NPCS: NPC[] = [
  { id: 0, x: 750, y: 430, zone: 0, name: 'Стар Ловец' },
  { id: 1, x: 1450, y: 580, zone: 1, name: 'Странникът' },
  { id: 2, x: 380, y: 1240, zone: 2, name: 'Пазачът' },
  { id: 3, x: 1720, y: 1180, zone: 3, name: 'Отшелникът' },
];

// ============================================================
//  BUILD MAP OBJECTS
// ============================================================
function buildMap(): MapObj[] {
  const objs: MapObj[] = [];

  // Forest trees (zone 0)
  const trees = [
    [120,80,28],[260,180,22],[380,130,30],[90,320,25],[330,370,20],[480,270,26],
    [180,480,24],[630,170,28],[740,320,22],[800,130,32],[160,620,20],[400,590,26],
    [580,520,24],[880,270,30],[1020,190,22],[1040,420,26],[830,530,28],[940,680,20],
    [290,730,24],[580,780,22],[730,670,26],[80,780,20],[440,830,24],[1080,570,22],
    [1080,730,26],[50,190,20],[690,770,22],[940,800,24],[840,400,20],[200,300,26],
    [510,650,22],[680,440,28],[1100,350,24],[360,500,20],[750,580,26],[1000,450,22],
    [130,460,28],[450,190,24],[700,100,20],[900,600,22],[1050,650,28],[200,720,24],
  ];
  trees.forEach(([x, y, r]) => objs.push({ x: x!, y: y!, w: r!, h: r!, type: 'tree' }));

  // Village buildings (zone 1)
  const buildings = [
    [1260,80,80,60],[1380,70,100,70],[1560,130,90,80],
    [1710,90,80,60],[1860,70,110,70],[2010,130,90,80],
    [1310,280,120,80],[1510,260,100,60],[1720,300,80,70],
    [1910,260,100,80],[2110,280,90,60],[2220,130,100,80],
    [1410,430,80,60],[1610,410,100,70],[1810,440,90,60],
    [2060,410,80,70],[2310,330,100,80],[1260,480,90,60],
    [2160,480,80,70],[1460,560,110,65],[1660,540,90,70],
    [1960,560,100,60],[2260,530,80,60],[1360,620,90,55],
    [1560,700,100,60],[1760,680,80,65],[2060,700,90,60],
    [1300,760,70,55],[1500,780,100,60],[1700,760,80,60],
  ];
  buildings.forEach(([x, y, w, h]) => objs.push({ x: x!, y: y!, w: w!, h: h!, type: 'building' }));

  // Ruins — walls (zone 2)
  const ruins = [
    [80,940,70,9],[190,990,9,65],[340,970,80,9],[510,940,9,55],
    [140,1090,90,9],[290,1140,9,75],[600,990,65,9],[710,1040,9,65],
    [440,1090,75,9],[810,970,9,85],[900,990,65,9],[190,1240,85,9],
    [390,1290,9,65],[540,1270,75,9],[700,1240,9,55],[850,1140,65,9],
    [1000,1090,9,75],[290,1390,85,9],[490,1440,9,65],[640,1390,75,9],
    [800,1370,9,55],[950,1340,65,9],[1100,1190,9,75],[1040,1390,65,9],
    [90,1390,9,65],[190,1490,85,9],[390,1540,9,55],[590,1590,75,9],
    [790,1540,9,65],[990,1490,65,9],[250,1650,80,9],[650,1680,70,9],
    [950,1650,9,60],[1080,1580,60,9],[120,1720,80,9],[500,1750,70,9],
  ];
  ruins.forEach(([x, y, w, h]) => objs.push({ x: x!, y: y!, w: w!, h: h!, type: 'ruin' }));

  // Field rocks (zone 3)
  const rocks = [
    [1310,950,28,18],[1470,1010,22,14],[1620,960,30,20],[1770,1020,25,16],
    [1920,960,28,18],[2070,1010,22,15],[2220,960,26,17],[2370,1020,28,18],
    [1360,1120,24,16],[1510,1170,28,18],[1660,1120,22,14],[1820,1170,26,17],
    [1970,1120,28,18],[2120,1170,24,16],[2270,1120,22,15],[1410,1320,26,17],
    [1560,1370,28,18],[1710,1320,24,16],[1870,1370,28,18],[2020,1320,22,14],
    [2170,1370,26,17],[2320,1320,28,18],[1310,1520,24,16],[1460,1570,28,18],
    [1610,1520,22,14],[1760,1570,26,17],[1920,1520,28,18],[2070,1570,24,16],
    [2220,1520,22,15],[2370,1570,26,17],[1360,1720,28,18],[1510,1760,22,14],
    [1660,1720,26,17],[1820,1760,28,18],[2020,1720,22,14],[2220,1760,26,17],
  ];
  rocks.forEach(([x, y, w, h]) => objs.push({ x: x!, y: y!, w: w!, h: h!, type: 'rock' }));

  return objs;
}

const MAP_OBJECTS = buildMap();

// ============================================================
//  HINT GENERATION (no AI — pure algorithmic)
// ============================================================
function generateHint(player: Vec2, target: HiddenPerson): string {
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const dirs = ['изток','югоизток','юг','югозапад','запад','северозапад','север','североизток'];
  const dirIdx = ((Math.round((angle + 180) / 45)) % 8 + 8) % 8;
  const dir = dirs[dirIdx]!;
  const distStr = dist > 900 ? 'много далеч' : dist > 500 ? 'далеч' : dist > 250 ? 'наблизо' : 'много близо';
  const zone = ZONE_NAMES_BG[target.zone]!;
  const feats = ZONE_FEATURES[target.zone]!;
  const feat = feats[Math.floor(Math.random() * feats.length)]!;
  const templates = [
    `Чух шум откъм ${dir}… ${distStr}, близо до ${feat} в ${zone}.`,
    `Мъглата е по-гъста на ${dir}. Погледни до ${feat}.`,
    `Стъпки на ${dir}, ${distStr}… в ${zone}.`,
    `Усетих дъхание откъм ${dir}. Близо до ${feat}.`,
    `В ${zone} на ${dir}, ${distStr} — до ${feat}.`,
    `Птиците замлъкнаха на ${dir}. Нещо се крие до ${feat}.`,
    `Тревата е смачкана на ${dir}, ${distStr} от тук.`,
    `Сенки се движат в ${zone}, на ${dir}. Търси до ${feat}.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)]!;
}

// ============================================================
//  COLLISION
// ============================================================
function hasCollision(nx: number, ny: number, objects: MapObj[]): boolean {
  const PR = 10;
  for (const obj of objects) {
    if (obj.type === 'tree' || obj.type === 'bush') {
      const dx = nx - obj.x; const dy = ny - obj.y;
      if (Math.sqrt(dx * dx + dy * dy) < obj.w * 0.7 + PR) return true;
    } else if (obj.type === 'building') {
      if (nx + PR > obj.x && nx - PR < obj.x + obj.w &&
          ny + PR > obj.y && ny - PR < obj.y + obj.h) return true;
    }
  }
  return false;
}

// ============================================================
//  DRAW HELPERS
// ============================================================
function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#1a0e05';
  ctx.fillRect(x - 3, y, 6, 10);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0d2510'; ctx.fill();
  ctx.beginPath(); ctx.arc(x - r * 0.15, y - r * 0.15, r * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = '#122b13'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#163318'; ctx.fill();
}

function drawBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#1c1208'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#2e1e0a'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#120c05'; ctx.fillRect(x, y, w, 9);
  if (w > 55) {
    ctx.fillStyle = '#2a1f08'; ctx.fillRect(x + w * 0.3, y + h * 0.35, 11, 9);
    if (w > 80) ctx.fillRect(x + w * 0.6, y + h * 0.35, 11, 9);
  }
  // Door
  ctx.fillStyle = '#0e0905';
  ctx.fillRect(x + w * 0.5 - 6, y + h - 14, 12, 14);
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1b1e22'; ctx.fill();
  ctx.strokeStyle = '#252a2d'; ctx.lineWidth = 1; ctx.stroke();
}

function drawRuin(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#191c1f'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#252829'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
  // Cracks
  if (w > 30) {
    ctx.strokeStyle = '#0e1012'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + w * 0.3, y); ctx.lineTo(x + w * 0.35, y + h); ctx.stroke();
  }
}

function drawPersonFigure(ctx: CanvasRenderingContext2D, x: number, y: number, headColor: string, bodyColor: string, glowCol: string, glowR: number, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  // Glow aura
  const g = ctx.createRadialGradient(x, y + 4, 0, x, y + 4, glowR);
  g.addColorStop(0, glowCol + '55'); g.addColorStop(1, glowCol + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + 4, glowR, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.fillStyle = bodyColor; ctx.fillRect(x - 4, y, 8, 13);
  // Head
  ctx.beginPath(); ctx.arc(x, y - 5, 5, 0, Math.PI * 2);
  ctx.fillStyle = headColor; ctx.fill();
  ctx.restore();
}

function drawNPCMarker(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  // Bounce
  const bob = Math.sin(t * 3) * 3;
  ctx.save();
  ctx.fillStyle = '#9966ff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#9966ff';
  ctx.shadowBlur = 8;
  ctx.fillText('!', x, y - 22 + bob);
  ctx.restore();
}

function drawPlayerGlow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Outer soft glow (drawn OVER fog but inside vision)
  const g = ctx.createRadialGradient(x, y, 0, x, y, 24);
  g.addColorStop(0, 'rgba(0,220,200,0.3)');
  g.addColorStop(1, 'rgba(0,220,200,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.fillStyle = '#0dceba'; ctx.fillRect(x - 4, y - 2, 8, 12);
  ctx.beginPath(); ctx.arc(x, y - 7, 5, 0, Math.PI * 2); ctx.fillStyle = '#0dceba'; ctx.fill();
  // Center dot
  ctx.beginPath(); ctx.arc(x, y - 7, 2, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
}

// ============================================================
//  GAME COMPONENT
// ============================================================
export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameTimeRef = useRef(0); // elapsed game time in seconds

  // Mutable game state (via ref for game loop perf)
  const stateRef = useRef({
    player: { x: 1200, y: 900 } as Vec2,
    camera: { x: 0, y: 0 } as Vec2,
    hiddenPeople: INITIAL_HIDDEN.map(p => ({ ...p })),
    keys: new Set<string>(),
    phase: 'start' as GamePhase,
    timeLeft: GAME_DURATION,
    hintsUsed: 0,
    nearNPC: null as NPC | null,
    nearHidden: null as HiddenPerson | null,
    interactCooldown: 0,
    t: 0, // for animations
  });

  // React UI state
  const [phase, setPhase] = useState<GamePhase>('start');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [found, setFound] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [dialog, setDialog] = useState<{ name: string; text: string } | null>(null);
  const [nearNPCUI, setNearNPCUI] = useState(false);
  const [nearHiddenUI, setNearHiddenUI] = useState(false);
  const [justFound, setJustFound] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Init offscreen fog canvas
  useEffect(() => {
    const fc = document.createElement('canvas');
    fogRef.current = fc;
  }, []);

  // Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      stateRef.current.keys.add(e.key.toLowerCase());
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'e') {
        handleInteract();
      }
      if (e.key === 'Escape') setDialog(null);
    };
    const up = (e: KeyboardEvent) => stateRef.current.keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const handleInteract = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== 'playing') return;
    if (s.interactCooldown > 0) return;
    s.interactCooldown = 0.5;

    // Find nearest hidden person
    if (s.nearHidden) {
      const person = s.hiddenPeople.find(p => p.id === s.nearHidden!.id && !p.found);
      if (person) {
        person.found = true;
        const foundCount = s.hiddenPeople.filter(p => p.found).length;
        setFound(foundCount);
        const zoneName = ZONE_NAMES_BG[person.zone] ?? 'неизвестна зона';
        setJustFound(`Намерен! (${foundCount}/${INITIAL_HIDDEN.length})`);
        setTimeout(() => setJustFound(null), 2000);
        if (foundCount >= INITIAL_HIDDEN.length) {
          s.phase = 'won';
          const finalScore = Math.round(s.timeLeft * 10 - s.hintsUsed * 50);
          setScore(Math.max(0, finalScore));
          setPhase('won');
        }
        return;
      }
    }

    // Talk to NPC
    if (s.nearNPC) {
      // Find nearest unfound hidden person
      const unfound = s.hiddenPeople.filter(p => !p.found);
      if (unfound.length === 0) return;
      const closest = unfound.reduce((a, b) => {
        const da = Math.hypot(a.x - s.player.x, a.y - s.player.y);
        const db = Math.hypot(b.x - s.player.x, b.y - s.player.y);
        return da < db ? a : b;
      });
      const hint = generateHint(s.player, closest);
      s.hintsUsed++;
      setHintsUsed(s.hintsUsed);
      setDialog({ name: s.nearNPC.name, text: hint });
      s.interactCooldown = 1;
    }
  }, []);

  // Main game loop
  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.phase = 'playing';
    s.player = { x: 1200, y: 900 };
    s.hiddenPeople = INITIAL_HIDDEN.map(p => ({ ...p }));
    s.timeLeft = GAME_DURATION;
    s.hintsUsed = 0;
    s.t = 0;
    gameTimeRef.current = 0;
    lastTimeRef.current = 0;
    setPhase('playing');
    setFound(0);
    setHintsUsed(0);
    setTimeLeft(GAME_DURATION);
    setDialog(null);
    setJustFound(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Size canvas to window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (fogRef.current) {
        fogRef.current.width = canvas.width;
        fogRef.current.height = canvas.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (ts: number) => {
      const dt = Math.min((ts - (lastTimeRef.current || ts)) / 1000, 0.05);
      lastTimeRef.current = ts;
      const s = stateRef.current;
      s.t += dt;
      if (s.interactCooldown > 0) s.interactCooldown -= dt;

      const W = canvas.width;
      const H = canvas.height;

      if (s.phase === 'playing') {
        // Timer
        s.timeLeft -= dt;
        if (s.timeLeft <= 0) {
          s.timeLeft = 0;
          s.phase = 'lost';
          setPhase('lost');
        }
        if (Math.floor(s.timeLeft) !== Math.floor(s.timeLeft + dt)) {
          setTimeLeft(Math.ceil(s.timeLeft));
        }

        // Movement
        let dx = 0, dy = 0;
        const k = s.keys;
        if (k.has('arrowleft') || k.has('a')) dx -= 1;
        if (k.has('arrowright') || k.has('d')) dx += 1;
        if (k.has('arrowup') || k.has('w')) dy -= 1;
        if (k.has('arrowdown') || k.has('s')) dy += 1;
        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
        const nx = s.player.x + dx * PLAYER_SPEED;
        const ny = s.player.y + dy * PLAYER_SPEED;
        if (nx > 15 && nx < MAP_W - 15 && !hasCollision(nx, s.player.y, MAP_OBJECTS)) s.player.x = nx;
        if (ny > 15 && ny < MAP_H - 15 && !hasCollision(s.player.x, ny, MAP_OBJECTS)) s.player.y = ny;

        // Camera
        s.camera.x = Math.max(0, Math.min(MAP_W - W, s.player.x - W / 2));
        s.camera.y = Math.max(0, Math.min(MAP_H - H, s.player.y - H / 2));

        // Near NPC / hidden
        const nearNPC = NPCS.find(n => Math.hypot(n.x - s.player.x, n.y - s.player.y) < NPC_INTERACT_R) ?? null;
        const nearHidden = s.hiddenPeople.find(p => !p.found && Math.hypot(p.x - s.player.x, p.y - s.player.y) < FIND_R) ?? null;
        s.nearNPC = nearNPC;
        s.nearHidden = nearHidden ?? null;
        setNearNPCUI(!!nearNPC);
        setNearHiddenUI(!!nearHidden);
      }

      // ==============================
      //  RENDER
      // ==============================
      const cx = s.camera.x, cy = s.camera.y;
      const px = s.player.x - cx, py = s.player.y - cy;

      // Draw background zones
      ctx.fillStyle = '#0c1208'; ctx.fillRect(0, 0, W, H);

      // Zone fills
      const zones = [
        { x: 0, y: 0, w: 1200, h: 900, color: '#0c1f0e' },
        { x: 1200, y: 0, w: 1200, h: 900, color: '#19120a' },
        { x: 0, y: 900, w: 1200, h: 900, color: '#10131a' },
        { x: 1200, y: 900, w: 1200, h: 900, color: '#111a0d' },
      ];
      zones.forEach(z => {
        const sx = z.x - cx, sy = z.y - cy;
        ctx.fillStyle = z.color;
        ctx.fillRect(sx, sy, z.w, z.h);
      });

      // Zone border paths (subtle)
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(1200 - cx, -cy); ctx.lineTo(1200 - cx, MAP_H - cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-cx, 900 - cy); ctx.lineTo(MAP_W - cx, 900 - cy); ctx.stroke();

      // Ground texture dots (subtle)
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      for (let i = 0; i < 60; i++) {
        const gx = ((i * 137 + 41) % MAP_W) - cx;
        const gy = ((i * 89 + 23) % MAP_H) - cy;
        if (gx > -5 && gx < W + 5 && gy > -5 && gy < H + 5) {
          ctx.fillRect(gx, gy, 2, 2);
        }
      }

      // Zone labels (always in world)
      ctx.font = 'bold 28px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ГОРА', 600 - cx, 450 - cy);
      ctx.fillText('СЕЛО', 1800 - cx, 450 - cy);
      ctx.fillText('РУИНИ', 600 - cx, 1350 - cy);
      ctx.fillText('ПОЛЕ', 1800 - cx, 1350 - cy);
      ctx.globalAlpha = 1;

      // Map objects
      MAP_OBJECTS.forEach(obj => {
        const sx = obj.x - cx, sy = obj.y - cy;
        if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) return;
        if (obj.type === 'tree') drawTree(ctx, sx, sy, obj.w);
        else if (obj.type === 'building') drawBuilding(ctx, sx, sy, obj.w, obj.h);
        else if (obj.type === 'rock') drawRock(ctx, sx, sy, obj.w, obj.h);
        else if (obj.type === 'ruin') drawRuin(ctx, sx, sy, obj.w, obj.h);
      });

      // Hidden people (only visible within FIND_R)
      s.hiddenPeople.forEach(p => {
        if (p.found) return;
        const d = Math.hypot(p.x - s.player.x, p.y - s.player.y);
        if (d > FIND_R + 10) return;
        const alpha = Math.max(0, Math.min(1, (FIND_R - d + 10) / 20));
        const sx = p.x - cx, sy = p.y - cy;
        drawPersonFigure(ctx, sx, sy, '#f5c842', '#c8a028', '#f5c842', 18, alpha);
        // "!" indicator
        if (d < FIND_R) {
          ctx.save(); ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = '#f5c842'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
          ctx.shadowColor = '#f5c842'; ctx.shadowBlur = 6;
          ctx.fillText('E', sx, sy - 22 + Math.sin(s.t * 4) * 2);
          ctx.restore();
        }
      });

      // NPCs (visible within vision)
      NPCS.forEach(npc => {
        const d = Math.hypot(npc.x - s.player.x, npc.y - s.player.y);
        if (d > VISION_R + 40) return;
        const alpha = Math.min(1, (VISION_R + 20 - d) / 30);
        const sx = npc.x - cx, sy = npc.y - cy;
        drawPersonFigure(ctx, sx, sy, '#bb99ff', '#8855ee', '#9966ff', 14, alpha);
        if (d < NPC_INTERACT_R) drawNPCMarker(ctx, sx, sy, s.t);
      });

      // Player
      drawPlayerGlow(ctx, px, py);

      // ==============================
      //  FOG OF WAR
      // ==============================
      const fc = fogRef.current;
      if (fc && fc.width === W && fc.height === H) {
        const fctx = fc.getContext('2d')!;
        fctx.clearRect(0, 0, W, H);
        // Solid fog
        fctx.fillStyle = 'rgba(5,10,18,0.94)';
        fctx.fillRect(0, 0, W, H);
        // Cut vision circle
        fctx.globalCompositeOperation = 'destination-out';
        const vg = fctx.createRadialGradient(px, py, 0, px, py, VISION_R);
        vg.addColorStop(0, 'rgba(0,0,0,1)');
        vg.addColorStop(0.65, 'rgba(0,0,0,0.85)');
        vg.addColorStop(0.85, 'rgba(0,0,0,0.4)');
        vg.addColorStop(1, 'rgba(0,0,0,0)');
        fctx.fillStyle = vg;
        fctx.fillRect(0, 0, W, H);
        fctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(fc, 0, 0);
      }

      // Player glow ON TOP of fog
      ctx.save();
      const pg = ctx.createRadialGradient(px, py, 0, px, py, 18);
      pg.addColorStop(0, 'rgba(0,220,200,0.45)');
      pg.addColorStop(1, 'rgba(0,220,200,0)');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Found people indicators (checkmarks)
      s.hiddenPeople.filter(p => p.found).forEach(p => {
        const d = Math.hypot(p.x - s.player.x, p.y - s.player.y);
        if (d > VISION_R) return;
        const sx = p.x - cx, sy = p.y - cy;
        ctx.save(); ctx.fillStyle = '#44ff88'; ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center'; ctx.shadowColor = '#44ff88'; ctx.shadowBlur = 8;
        ctx.fillText('✓', sx, sy - 22); ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const timerColor = timeLeft < 60 ? '#ff4444' : timeLeft < 120 ? '#ff8c00' : '#0dceba';

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#050a12', fontFamily: 'Inter, sans-serif' }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* ======== START SCREEN ======== */}
      {phase === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(5,10,18,0.88)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center px-8 py-12 rounded-2xl max-w-md w-full mx-4"
            style={{ background: 'hsl(218 40% 7%)', border: '1px solid hsl(185 80% 52% / 0.35)', boxShadow: '0 0 60px hsl(185 80% 52% / 0.12)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center animate-glow-pulse"
              style={{ background: 'hsl(185 80% 52% / 0.12)', border: '1px solid hsl(185 80% 52% / 0.5)' }}>
              <div className="w-6 h-6 rounded-full" style={{ background: 'hsl(185 80% 52%)', boxShadow: '0 0 20px hsl(185 80% 52%)' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2 glow-text" style={{ fontFamily: 'Cinzel, serif', color: 'hsl(var(--foreground))' }}>FOG & SEEK</h1>
            <p className="text-sm mb-6" style={{ color: 'hsl(185 80% 52%)' }}>2D Top-Down · Discovery</p>
            <div className="text-left rounded-lg p-4 mb-6 space-y-2" style={{ background: 'hsl(218 40% 5%)', border: '1px solid hsl(var(--border))' }}>
              {[
                ['WASD / Стрелки', 'Движение'],
                ['E', 'Намери скрит / Говори с NPC'],
                ['Esc', 'Затвори диалог'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'hsl(var(--secondary))', color: 'hsl(185 80% 52%)' }}>{k}</span>
                  <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Намери <strong style={{ color: 'hsl(42 75% 52%)' }}>5 скрити хора</strong> на картата преди времето да изтече.<br />
              Говори с <strong style={{ color: '#bb99ff' }}>NPC (лилави)</strong> за подсказки.<br />
              Жълтите фигури се виждат само отблизо!
            </p>
            <button onClick={startGame} className="btn-glow w-full py-3.5 rounded-lg text-sm tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Влез в Мъглата
            </button>
            <button onClick={() => navigate('/')} className="mt-3 w-full py-2 text-xs rounded-lg btn-outline-glow" style={{ fontFamily: 'Cinzel, serif' }}>
              ← Назад
            </button>
          </div>
        </div>
      )}

      {/* ======== HUD ======== */}
      {phase === 'playing' && (
        <>
          {/* Top bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(5,10,18,0.85)', border: '1px solid rgba(13,206,186,0.3)' }}>
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>⏱</span>
              <span className="text-sm font-mono font-bold" style={{ color: timerColor, textShadow: `0 0 10px ${timerColor}` }}>{fmt(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(5,10,18,0.85)', border: '1px solid rgba(245,200,66,0.3)' }}>
              <span className="text-xs" style={{ color: '#f5c842' }}>👤</span>
              <span className="text-sm font-bold" style={{ color: '#f5c842' }}>{found}<span style={{ color: 'hsl(var(--muted-foreground))' }}>/{INITIAL_HIDDEN.length}</span></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(5,10,18,0.85)', border: '1px solid rgba(153,102,255,0.3)' }}>
              <span className="text-xs" style={{ color: '#bb99ff' }}>💡</span>
              <span className="text-sm font-bold" style={{ color: '#bb99ff' }}>{hintsUsed}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-4 left-4 z-10 space-y-1">
            {[['#0dceba','Ти'],['#f5c842','Скрит (близо!)'],['#bb99ff','NPC (E=говори)']].map(([c,l])=>(
              <div key={l} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                <span className="text-xs" style={{ color: 'rgba(200,210,220,0.6)' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Interact prompt */}
          {(nearHiddenUI || nearNPCUI) && !dialog && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-full flex items-center gap-2"
              style={{ background: 'rgba(5,10,18,0.9)', border: `1px solid ${nearHiddenUI ? '#f5c842' : '#9966ff'}88` }}>
              <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: nearHiddenUI ? '#f5c84222' : '#9966ff22', color: nearHiddenUI ? '#f5c842' : '#bb99ff' }}>E</span>
              <span className="text-xs" style={{ color: 'rgba(200,210,220,0.8)' }}>
                {nearHiddenUI ? 'Намерен! Натисни E' : 'Говори с NPC'}
              </span>
            </div>
          )}

          {/* Just found banner */}
          {justFound && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-full animate-fade-up"
              style={{ background: 'rgba(68,255,136,0.15)', border: '1px solid #44ff88aa', color: '#44ff88', fontSize: 14, fontWeight: 700, textShadow: '0 0 10px #44ff88' }}>
              ✓ {justFound}
            </div>
          )}

          {/* NPC Dialog */}
          {dialog && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-20">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(5,10,18,0.95)', border: '1px solid rgba(153,102,255,0.4)', boxShadow: '0 0 30px rgba(153,102,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#bb99ff', boxShadow: '0 0 6px #bb99ff' }} />
                  <span className="text-xs font-semibold" style={{ color: '#bb99ff', fontFamily: 'Cinzel, serif' }}>{dialog.name}</span>
                  <span className="ml-auto text-xs" style={{ color: 'rgba(150,160,180,0.5)' }}>Esc / E για затваряне</span>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(200,215,225,0.85)' }}>
                  "{dialog.text}"
                </p>
                <button onClick={() => setDialog(null)} className="mt-3 text-xs px-3 py-1 rounded" style={{ background: 'rgba(153,102,255,0.15)', color: '#bb99ff', border: '1px solid rgba(153,102,255,0.3)' }}>
                  Затвори
                </button>
              </div>
            </div>
          )}

          {/* Mobile controls */}
          <div className="absolute bottom-6 right-6 z-10 grid grid-cols-3 gap-1 sm:hidden">
            {[['↑','arrowup'],['←','arrowleft'],['↓','arrowdown'],['→','arrowright']].map(([label, key]) => (
              <button key={key}
                className={label === '↑' ? 'col-start-2' : label === '←' ? 'col-start-1' : label === '↓' ? 'col-start-2' : 'col-start-3'}
                style={{ width: 44, height: 44, background: 'rgba(13,206,186,0.15)', border: '1px solid rgba(13,206,186,0.3)', color: '#0dceba', borderRadius: 8, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
                onPointerDown={() => stateRef.current.keys.add(key!)}
                onPointerUp={() => stateRef.current.keys.delete(key!)}
              >{label}</button>
            ))}
          </div>
        </>
      )}

      {/* ======== WON ======== */}
      {phase === 'won' && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(5,10,18,0.88)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center px-8 py-12 rounded-2xl max-w-sm w-full mx-4"
            style={{ background: 'hsl(218 40% 7%)', border: '1px solid rgba(68,255,136,0.4)', boxShadow: '0 0 60px rgba(68,255,136,0.1)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#44ff88', textShadow: '0 0 20px #44ff88' }}>Победа!</h2>
            <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>Намери всички 5 скрити хора!</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-lg" style={{ background: 'hsl(218 40% 5%)', border: '1px solid hsl(var(--border))' }}>
                <div className="text-lg font-bold" style={{ color: '#0dceba' }}>{fmt(timeLeft)}</div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Останало</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'hsl(218 40% 5%)', border: '1px solid hsl(var(--border))' }}>
                <div className="text-lg font-bold" style={{ color: '#bb99ff' }}>{hintsUsed}</div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Подсказки</div>
              </div>
            </div>
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(68,255,136,0.08)', border: '1px solid rgba(68,255,136,0.2)' }}>
              <div className="text-3xl font-bold" style={{ color: '#44ff88', fontFamily: 'Cinzel, serif' }}>{score}</div>
              <div className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Точки</div>
            </div>
            <button onClick={startGame} className="btn-glow w-full py-3 rounded-lg text-sm tracking-widest uppercase mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Нова игра</button>
            <button onClick={() => navigate('/')} className="btn-outline-glow w-full py-2 text-xs rounded-lg" style={{ fontFamily: 'Cinzel, serif' }}>← Начало</button>
          </div>
        </div>
      )}

      {/* ======== LOST ======== */}
      {phase === 'lost' && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(5,10,18,0.88)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center px-8 py-12 rounded-2xl max-w-sm w-full mx-4"
            style={{ background: 'hsl(218 40% 7%)', border: '1px solid rgba(255,68,68,0.3)', boxShadow: '0 0 60px rgba(255,68,68,0.08)' }}>
            <div className="text-5xl mb-4">🌫️</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#ff6666', textShadow: '0 0 20px #ff4444' }}>Мъглата те погълна</h2>
            <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>Намерени: <strong style={{ color: '#f5c842' }}>{found}</strong> от {INITIAL_HIDDEN.length}</p>
            <button onClick={startGame} className="btn-glow w-full py-3 rounded-lg text-sm tracking-widest uppercase mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Опитай пак</button>
            <button onClick={() => navigate('/')} className="btn-outline-glow w-full py-2 text-xs rounded-lg" style={{ fontFamily: 'Cinzel, serif' }}>← Начало</button>
          </div>
        </div>
      )}
    </div>
  );
}
