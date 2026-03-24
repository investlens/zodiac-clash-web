"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Player = {
  id: number;
  name: string;
  hp: number;
  zod: number;
  x: number;
  y: number;
  alive: boolean;
  color: string;
  avatar?: string | null;
  vx: number;
  vy: number;
  eliminatedAt?: number | null;
};

type Fragment = {
  id: number;
  x: number;
  y: number;
  value: number;
  tier: "small" | "medium" | "large" | "mega";
};

type ArenaTheme = {
  id: string;
  name: string;
  wrapperClass: string;
  fragmentGlow: string;
};

type Trail = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
};

type ArenaPatch = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  kind: "rune" | "crack" | "dust" | "grid";
  opacity: number;
};

const ARENA_W = 920;
const ARENA_H = 560;
const PLAYER_SIZE = 56;
const MAX_TICKS = 220;
const ARENA_PADDING = 20;
const FINAL_ZONE_CENTER = { x: ARENA_W / 2, y: ARENA_H / 2 };
const FINAL_ZONE_START_RADIUS = 230;
const FINAL_ZONE_MIN_RADIUS = 90;

const THEMES: ArenaTheme[] = [
  {
    id: "nebula",
    name: "Nebula Core",
    wrapperClass:
      "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.10),transparent_30%),linear-gradient(180deg,#0e1020,#090b14)]",
    fragmentGlow: "shadow-[0_0_22px_rgba(34,211,238,0.18)]",
  },
  {
    id: "void",
    name: "Void Grid",
    wrapperClass: "bg-[linear-gradient(180deg,#0a0d16,#06080f)]",
    fragmentGlow: "shadow-[0_0_22px_rgba(99,102,241,0.18)]",
  },
  {
    id: "solar",
    name: "Solar Ruins",
    wrapperClass:
      "bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.10),transparent_32%),linear-gradient(180deg,#1a120b,#0f0b08)]",
    fragmentGlow: "shadow-[0_0_22px_rgba(251,146,60,0.22)]",
  },
  {
    id: "frost",
    name: "Frost Rift",
    wrapperClass:
      "bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_32%),linear-gradient(180deg,#09111f,#060a12)]",
    fragmentGlow: "shadow-[0_0_22px_rgba(125,211,252,0.20)]",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function shortName(name: string, max = 12) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

function pickTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

function spawnOnEdge() {
  const side = Math.floor(Math.random() * 4);

  if (side === 0) {
    return { x: rand(28, ARENA_W - 90), y: rand(20, 60) };
  }
  if (side === 1) {
    return { x: rand(28, ARENA_W - 90), y: rand(ARENA_H - 80, ARENA_H - 30) };
  }
  if (side === 2) {
    return { x: rand(20, 60), y: rand(28, ARENA_H - 90) };
  }
  return { x: rand(ARENA_W - 80, ARENA_W - 30), y: rand(28, ARENA_H - 90) };
}

function makePlayers(): Player[] {
  const palette = [
    "#38bdf8",
    "#a78bfa",
    "#f472b6",
    "#34d399",
    "#f59e0b",
    "#fb7185",
    "#22d3ee",
    "#818cf8",
  ];

  return Array.from({ length: 25 }).map((_, i) => {
    const pos = spawnOnEdge();

    return {
      id: i + 1,
      name: `Fighter ${i + 1}`,
      hp: 100,
      zod: 0,
      x: pos.x,
      y: pos.y,
      alive: true,
      color: palette[i % palette.length],
      avatar: null,
      vx: 0,
      vy: 0,
      eliminatedAt: null,
    };
  });
}

function makeArenaPatches(): ArenaPatch[] {
  const kinds: ArenaPatch["kind"][] = ["rune", "crack", "dust", "grid"];

  return Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    x: rand(40, ARENA_W - 160),
    y: rand(40, ARENA_H - 140),
    w: rand(70, 170),
    h: rand(45, 135),
    rotate: rand(-25, 25),
    kind: kinds[Math.floor(Math.random() * kinds.length)],
    opacity: rand(0.14, 0.28),
  }));
}

function pushCluster(
  list: Fragment[],
  centerX: number,
  centerY: number,
  count: number,
  nextIdStart: number
) {
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let tier: Fragment["tier"] = "small";
    let value = 5;

    if (r > 0.97) {
      tier = "mega";
      value = 50;
    } else if (r > 0.84) {
      tier = "large";
      value = 25;
    } else if (r > 0.5) {
      tier = "medium";
      value = 10;
    }

    list.push({
      id: nextIdStart + i,
      x: clamp(centerX + rand(-85, 85), 24, ARENA_W - 24),
      y: clamp(centerY + rand(-75, 75), 24, ARENA_H - 24),
      value,
      tier,
    });
  }
}

function makeFragments(): Fragment[] {
  const fragments: Fragment[] = [];
  let nextId = 1;

  const clusters = [
    { x: 170, y: 150, count: 22 },
    { x: 720, y: 150, count: 22 },
    { x: 180, y: 420, count: 22 },
    { x: 730, y: 410, count: 22 },
    { x: 460, y: 280, count: 26 },
  ];

  for (const cluster of clusters) {
    pushCluster(fragments, cluster.x, cluster.y, cluster.count, nextId);
    nextId += cluster.count;
  }

  return fragments;
}

function fragmentSize(tier: Fragment["tier"]) {
  if (tier === "small") return 8;
  if (tier === "medium") return 12;
  if (tier === "large") return 16;
  return 22;
}

function fragmentClass(tier: Fragment["tier"]) {
  if (tier === "small") {
    return "bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.6)]";
  }
  if (tier === "medium") {
    return "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]";
  }
  if (tier === "large") {
    return "bg-fuchsia-400 shadow-[0_0_22px_rgba(232,121,249,1)]";
  }
  return "bg-orange-300 shadow-[0_0_30px_rgba(251,146,60,1)]";
}

function hudStatus(running: boolean, finished: boolean) {
  if (finished) return "Complete";
  if (running) return "Live";
  return "Ready";
}

function getPatchClass(kind: ArenaPatch["kind"]) {
  if (kind === "rune") {
    return "border border-cyan-300/20 bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_65%)]";
  }
  if (kind === "crack") {
    return "bg-[linear-gradient(135deg,rgba(244,114,182,0.08),transparent_35%,rgba(34,211,238,0.08),transparent_70%)]";
  }
  if (kind === "dust") {
    return "bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]";
  }
  return "border border-white/5 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:18px_18px]";
}

function getLateGameState(fragmentCount: number, tick: number) {
  const finalZoneActive = fragmentCount <= 28 || tick >= 90;
  const suddenDeath = fragmentCount <= 10 || tick >= 150;
  return { finalZoneActive, suddenDeath };
}

function getFinalZoneRadius(tick: number, finalZoneActive: boolean) {
  if (!finalZoneActive) return FINAL_ZONE_START_RADIUS;

  const progress = clamp((tick - 90) / 90, 0, 1);
  return (
    FINAL_ZONE_START_RADIUS -
    (FINAL_ZONE_START_RADIUS - FINAL_ZONE_MIN_RADIUS) * progress
  );
}

function distanceToCenter(x: number, y: number) {
  return Math.hypot(
    x + PLAYER_SIZE / 2 - FINAL_ZONE_CENTER.x,
    y + PLAYER_SIZE / 2 - FINAL_ZONE_CENTER.y
  );
}

function rankPlayers(players: Player[]) {
  return [...players].sort((a, b) => {
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    if ((b.eliminatedAt ?? Infinity) !== (a.eliminatedAt ?? Infinity)) {
      return (b.eliminatedAt ?? Infinity) - (a.eliminatedAt ?? Infinity);
    }
    if (b.zod !== a.zod) return b.zod - a.zod;
    return b.hp - a.hp;
  });
}

export default function SurvivalArenaPage() {
  const [players, setPlayers] = useState<Player[]>(() => makePlayers());
  const [fragments, setFragments] = useState<Fragment[]>(() => makeFragments());
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [tick, setTick] = useState(0);
  const [theme, setTheme] = useState<ArenaTheme>(() => pickTheme());
  const [patches, setPatches] = useState<ArenaPatch[]>(() => makeArenaPatches());
  const [trails, setTrails] = useState<Trail[]>([]);

  const tickRef = useRef(0);
  const trailIdRef = useRef(0);
  const phaseLogRef = useRef({
    finalZoneAnnounced: false,
    suddenDeathAnnounced: false,
  });

  function pushLog(line: string) {
    setLogs((prev) => {
      if (prev[0] === line) return prev;
      return [line, ...prev].slice(0, 8);
    });
  }

  function addTrail(x: number, y: number, color: string, size = 22) {
    const id = `trail-${trailIdRef.current++}`;
    const trail = { id, x, y, color, size };
    setTrails((prev) => [...prev.slice(-70), trail]);

    window.setTimeout(() => {
      setTrails((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }

  function resetArena() {
    setPlayers(makePlayers());
    setFragments(makeFragments());
    setLogs([]);
    setFinished(false);
    setTick(0);
    tickRef.current = 0;
    setRunning(false);
    setTheme(pickTheme());
    setPatches(makeArenaPatches());
    setTrails([]);
    phaseLogRef.current = {
      finalZoneAnnounced: false,
      suddenDeathAnnounced: false,
    };
  }

  function startArena() {
    if (running) return;
    if (finished) {
      resetArena();
      return;
    }
    setRunning(true);
    pushLog(`🌌 Arena opened: ${theme.name}`);
  }

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (!running || finished) return;

    const interval = window.setInterval(() => {
      setTick((prevTick) => {
        const nextTick = prevTick + 1;
        tickRef.current = nextTick;
        return nextTick;
      });

      setPlayers((prevPlayers) => {
        const nextPlayers = prevPlayers.map((p) => ({ ...p }));

        setFragments((prevFragments) => {
          let nextFragments = [...prevFragments];
          const { finalZoneActive, suddenDeath } = getLateGameState(
            nextFragments.length,
            tickRef.current
          );
          const finalZoneRadius = getFinalZoneRadius(
            tickRef.current,
            finalZoneActive
          );

          if (finalZoneActive && !phaseLogRef.current.finalZoneAnnounced) {
            phaseLogRef.current.finalZoneAnnounced = true;
            pushLog("🌀 Final Core activated — all fighters are pulled inward");
          }

          if (suddenDeath && !phaseLogRef.current.suddenDeathAnnounced) {
            phaseLogRef.current.suddenDeathAnnounced = true;
            pushLog("☠️ Sudden Death — clashes intensified");
          }

          for (const p of nextPlayers) {
            if (!p.alive) continue;

            let targetX = FINAL_ZONE_CENTER.x;
            let targetY = FINAL_ZONE_CENTER.y;

            if (!finalZoneActive) {
              let nearest: Fragment | null = null;
              let nearestDistance = Number.POSITIVE_INFINITY;

              for (const f of nextFragments) {
                const d = Math.hypot(
                  p.x + PLAYER_SIZE / 2 - f.x,
                  p.y + PLAYER_SIZE / 2 - f.y
                );
                if (d < nearestDistance) {
                  nearest = f;
                  nearestDistance = d;
                }
              }

              if (nearest) {
                targetX = nearest.x;
                targetY = nearest.y;
              }
            }

            const dx = targetX - (p.x + PLAYER_SIZE / 2);
            const dy = targetY - (p.y + PLAYER_SIZE / 2);
            const dist = Math.max(1, Math.hypot(dx, dy));

            const baseSpeed = finalZoneActive ? 9.6 : 8.8;
            const speed = suddenDeath ? baseSpeed + 1.7 : baseSpeed;

            p.vx = (dx / dist) * speed + rand(-0.28, 0.28);
            p.vy = (dy / dist) * speed + rand(-0.28, 0.28);

            p.x = clamp(
              p.x + p.vx,
              ARENA_PADDING,
              ARENA_W - PLAYER_SIZE - ARENA_PADDING
            );
            p.y = clamp(
              p.y + p.vy,
              ARENA_PADDING,
              ARENA_H - PLAYER_SIZE - ARENA_PADDING
            );

            if (Math.abs(p.vx) > 1.5 || Math.abs(p.vy) > 1.5) {
              addTrail(
                p.x + PLAYER_SIZE / 2 - 7,
                p.y + PLAYER_SIZE / 2 + 9,
                p.color,
                24
              );
            }

            const collectedIds: number[] = [];
            for (const f of nextFragments) {
              const distToFragment = Math.hypot(
                p.x + PLAYER_SIZE / 2 - f.x,
                p.y + PLAYER_SIZE / 2 - f.y
              );

              if (distToFragment < 30) {
                p.zod += f.value;
                collectedIds.push(f.id);

                if (Math.random() > 0.45) {
                  pushLog(`💎 ${p.name} collected +${f.value} ZOD`);
                }
              }
            }

            if (collectedIds.length > 0) {
              nextFragments = nextFragments.filter(
                (f) => !collectedIds.includes(f.id)
              );
            }

            if (finalZoneActive) {
              const distCenter = distanceToCenter(p.x, p.y);
              if (distCenter > finalZoneRadius) {
                const zoneDamage = suddenDeath ? 8 : 4;
                p.hp = clamp(p.hp - zoneDamage, 0, 100);

                if (Math.random() > 0.6) {
                  pushLog(`⚠️ ${p.name} is outside the Final Core`);
                }

                if (p.hp <= 0 && p.alive) {
                  p.alive = false;
                  p.eliminatedAt = tickRef.current;
                  pushLog(`💀 ${p.name} was consumed by the storm`);
                }
              }
            }
          }

          const { suddenDeath: clashSuddenDeath } = getLateGameState(
            nextFragments.length,
            tickRef.current
          );

          for (let i = 0; i < nextPlayers.length; i++) {
            const a = nextPlayers[i];
            if (!a.alive) continue;

            for (let j = i + 1; j < nextPlayers.length; j++) {
              const b = nextPlayers[j];
              if (!b.alive) continue;

              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              const clashChance = clashSuddenDeath ? 0.68 : 0.8;
              const clashRange = clashSuddenDeath ? 46 : 38;

              if (dist < clashRange && Math.random() > clashChance) {
                const damageToA = Math.floor(
                  rand(clashSuddenDeath ? 12 : 7, clashSuddenDeath ? 24 : 16)
                );
                const damageToB = Math.floor(
                  rand(clashSuddenDeath ? 12 : 7, clashSuddenDeath ? 24 : 16)
                );

                a.hp = clamp(a.hp - damageToA, 0, 100);
                b.hp = clamp(b.hp - damageToB, 0, 100);

                a.vx += rand(-1.2, 1.2);
                a.vy += rand(-1.2, 1.2);
                b.vx += rand(-1.2, 1.2);
                b.vy += rand(-1.2, 1.2);

                pushLog(
                  `⚔️ ${a.name} hit ${b.name} • -${damageToB} / -${damageToA}`
                );

                if (a.hp <= 0 && a.alive) {
                  a.alive = false;
                  a.eliminatedAt = tickRef.current;
                  pushLog(`💀 ${a.name} was eliminated`);
                }
                if (b.hp <= 0 && b.alive) {
                  b.alive = false;
                  b.eliminatedAt = tickRef.current;
                  pushLog(`💀 ${b.name} was eliminated`);
                }
              }
            }
          }

          const aliveCount = nextPlayers.filter((p) => p.alive).length;
          if (aliveCount <= 1 || tickRef.current >= MAX_TICKS) {
            setFinished(true);
            setRunning(false);
          }

          return nextFragments;
        });

        return nextPlayers;
      });
    }, 480);

    return () => {
      window.clearInterval(interval);
    };
  }, [running, finished, theme.name]);

  const alivePlayers = useMemo(
    () => players.filter((p) => p.alive),
    [players]
  );

  const ranking = useMemo(() => rankPlayers(players), [players]);
  const podium = ranking.slice(0, 3);
  const currentUser = players[0];
  const { finalZoneActive, suddenDeath } = getLateGameState(fragments.length, tick);
  const finalZoneRadius = getFinalZoneRadius(tick, finalZoneActive);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/70">
              Zodiac Clash Web
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              🌌 Survival Arena
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
              25 zodiac riders enter from the edges. They rush fragment clusters,
              then the Final Core activates and forces a brutal last-man-standing
              finish. Top 3 win. Last survivor becomes champion.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={startArena}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              {running ? "Arena Running..." : finished ? "Reset & Start" : "Start Arena"}
            </button>
            <button
              onClick={resetArena}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              New Arena
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="rounded-[28px] border border-white/10 bg-[#0a0d16] p-5 shadow-[0_0_60px_rgba(34,211,238,0.06)]">
            <div className="mb-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-7">
              <HudCard label="Players Alive" value={String(alivePlayers.length)} />
              <HudCard label="Fragments Left" value={String(fragments.length)} />
              <HudCard label="Your ZOD" value={String(currentUser?.zod ?? 0)} />
              <HudCard label="Status" value={hudStatus(running, finished)} />
              <HudCard label="Arena Theme" value={theme.name} />
              <HudCard label="Phase" value={suddenDeath ? "Sudden Death" : finalZoneActive ? "Final Core" : "Loot Rush"} />
              <HudCard label="Tick" value={`${tick}/${MAX_TICKS}`} />
            </div>

            <div
              className={`relative overflow-hidden rounded-[24px] border border-white/10 ${theme.wrapperClass} ${theme.fragmentGlow}`}
            >
              <div
                className="relative"
                style={{ width: ARENA_W, height: ARENA_H }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />
                <div className="absolute inset-0 opacity-30 animate-pulse bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(251,146,60,0.06),transparent_28%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:36px_36px]" />

                {patches.map((patch) => (
                  <div
                    key={patch.id}
                    className={`absolute rounded-[28px] blur-[0.5px] ${getPatchClass(patch.kind)}`}
                    style={{
                      left: patch.x,
                      top: patch.y,
                      width: patch.w,
                      height: patch.h,
                      opacity: patch.opacity,
                      transform: `rotate(${patch.rotate}deg)`,
                    }}
                  />
                ))}

                {finalZoneActive && (
                  <>
                    <div
                      className="absolute rounded-full border border-cyan-300/25 bg-cyan-300/5 shadow-[0_0_50px_rgba(34,211,238,0.08)] transition-all duration-500"
                      style={{
                        width: finalZoneRadius * 2,
                        height: finalZoneRadius * 2,
                        left: FINAL_ZONE_CENTER.x - finalZoneRadius,
                        top: FINAL_ZONE_CENTER.y - finalZoneRadius,
                      }}
                    />
                    <div
                      className="absolute rounded-full border border-cyan-200/35 animate-pulse"
                      style={{
                        width: 36,
                        height: 36,
                        left: FINAL_ZONE_CENTER.x - 18,
                        top: FINAL_ZONE_CENTER.y - 18,
                      }}
                    />
                    <div
                      className="absolute rounded-full bg-cyan-300/30 blur-xl"
                      style={{
                        width: 44,
                        height: 44,
                        left: FINAL_ZONE_CENTER.x - 22,
                        top: FINAL_ZONE_CENTER.y - 22,
                      }}
                    />
                  </>
                )}

                {trails.map((trail) => (
                  <div
                    key={trail.id}
                    className="pointer-events-none absolute rounded-full blur-md animate-ping"
                    style={{
                      left: trail.x,
                      top: trail.y,
                      width: trail.size,
                      height: trail.size,
                      background: trail.color,
                      opacity: 0.22,
                    }}
                  />
                ))}

                {fragments.map((f) => {
                  const size = fragmentSize(f.tier);

                  return (
                    <div
                      key={f.id}
                      className="absolute"
                      style={{
                        left: f.x,
                        top: f.y,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`+${f.value} ZOD`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full blur-md opacity-80 animate-pulse ${fragmentClass(f.tier)}`}
                        style={{
                          width: size + 10,
                          height: size + 10,
                          left: -5,
                          top: -5,
                        }}
                      />
                      {(f.tier === "large" || f.tier === "mega") && (
                        <div
                          className="absolute rounded-full border border-white/25 animate-spin"
                          style={{
                            width: size + 14,
                            height: size + 14,
                            left: -7,
                            top: -7,
                            animationDuration: "3.4s",
                          }}
                        />
                      )}
                      {f.tier === "mega" && (
                        <div
                          className="absolute rounded-full border border-orange-200/40 animate-ping"
                          style={{
                            width: size + 24,
                            height: size + 24,
                            left: -12,
                            top: -12,
                          }}
                        />
                      )}
                      <div
                        className={`relative rounded-full ${fragmentClass(f.tier)}`}
                        style={{
                          width: size,
                          height: size,
                        }}
                      />
                    </div>
                  );
                })}

                {players.map((p) => {
                  const tilt = clamp(p.vx * 2.4, -14, 14);

                  return (
                    <div
                      key={p.id}
                      className="absolute transition-all duration-500 ease-out"
                      style={{
                        left: p.x,
                        top: p.y,
                        width: PLAYER_SIZE,
                        opacity: p.alive ? 1 : 0.22,
                        filter: p.alive ? "none" : "grayscale(1)",
                      }}
                    >
                      <div className="mb-1 text-center text-[10px] font-medium text-white/85">
                        {shortName(p.name)}
                      </div>

                      <div
                        className="relative mx-auto h-[42px] w-[52px]"
                        style={{
                          transform: `rotate(${tilt}deg)`,
                        }}
                      >
                        <div
                          className="absolute bottom-[2px] left-1/2 h-[18px] w-[42px] -translate-x-1/2 rounded-[999px] border border-white/10 shadow-[0_0_18px_rgba(255,255,255,0.08)]"
                          style={{
                            background: `linear-gradient(90deg, rgba(255,255,255,0.12), ${p.color}, rgba(255,255,255,0.12))`,
                          }}
                        />
                        <div
                          className="absolute bottom-[8px] left-1/2 h-[10px] w-[54px] -translate-x-1/2 rounded-full blur-md opacity-70"
                          style={{
                            background: p.color,
                          }}
                        />
                        <div className="absolute bottom-[14px] left-1/2 h-[18px] w-[18px] -translate-x-1/2 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm" />
                        {p.avatar ? (
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="absolute bottom-[14px] left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full border border-white/25 object-cover"
                          />
                        ) : (
                          <div
                            className="absolute bottom-[14px] left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), ${p.color})`,
                            }}
                          />
                        )}

                        <div
                          className="absolute bottom-[4px] left-[4px] h-[6px] w-[10px] rounded-full blur-[1px]"
                          style={{ background: "rgba(255,255,255,0.55)" }}
                        />
                        <div
                          className="absolute bottom-[4px] right-[4px] h-[6px] w-[10px] rounded-full blur-[1px]"
                          style={{ background: "rgba(255,255,255,0.55)" }}
                        />

                        {p.alive ? (
                          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_18px_rgba(34,211,238,0.18)]" />
                        ) : null}
                      </div>

                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            p.hp > 60
                              ? "bg-emerald-400"
                              : p.hp > 30
                              ? "bg-yellow-400"
                              : "bg-rose-400"
                          }`}
                          style={{ width: `${clamp(p.hp, 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm">
                  {theme.name}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0a0d16] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                Your Fighter
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-fuchsia-500/30">
                  <div className="absolute inset-x-2 bottom-2 h-3 rounded-full bg-cyan-300/40 blur-md" />
                  <div className="absolute inset-x-3 bottom-4 h-4 rounded-full bg-white/10" />
                  <div className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full border border-white/20 bg-white/10" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {currentUser?.name ?? "Fighter 1"}
                  </p>
                  <p className="text-sm text-white/60">
                    HP {currentUser?.hp ?? 0} • ZOD {currentUser?.zod ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0a0d16] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                Live Feed
              </p>
              <div className="mt-4 space-y-3">
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <div
                      key={`${log}-${i}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
                    >
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-sm text-white/50">
                    Start the arena to watch the rush, the convergence, and the final clash.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0a0d16] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                Top Collectors
              </p>
              <div className="mt-4 space-y-3">
                {ranking.slice(0, 5).map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {i + 1}. {p.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {p.alive ? "Alive" : "Eliminated"} • HP {p.hp}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-300">
                        {p.zod} ZOD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {finished ? (
          <div className="mt-8 rounded-[32px] border border-white/10 bg-[#0a0d16] p-6 shadow-[0_0_70px_rgba(168,85,247,0.10)]">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                Survival Arena Complete
              </p>
              <h2 className="mt-2 text-3xl font-semibold">🏆 Final Results</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {podium.map((p, i) => {
                const suiReward =
                  i === 0 ? "0.5 SUI" : i === 1 ? "0.3 SUI" : "0.2 SUI";

                return (
                  <div
                    key={p.id}
                    className={`rounded-[26px] border p-5 ${
                      i === 0
                        ? "border-yellow-300/30 bg-yellow-300/5"
                        : i === 1
                        ? "border-zinc-300/20 bg-zinc-300/5"
                        : "border-orange-400/20 bg-orange-400/5"
                    }`}
                  >
                    <p className="text-sm font-medium text-white/55">
                      {i === 0
                        ? "👑 Champion"
                        : i === 1
                        ? "🥈 2nd Place"
                        : "🥉 3rd Place"}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">{p.name}</p>
                    <div className="mt-4 space-y-2 text-sm text-white/70">
                      <p>💰 Reward: {suiReward}</p>
                      <p>💎 ZOD Collected: {p.zod}</p>
                      <p>❤️ HP Left: {p.hp}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-white/40">
                Full Ranking
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {ranking.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        #{i + 1} {p.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {p.alive ? "Survived" : "Eliminated"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-300">
                        {p.zod} ZOD
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetArena}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HudCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}