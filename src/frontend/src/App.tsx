import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const ORBITAL_PERIODS: Record<string, number> = {
  Mercury: 0.2408467,
  Venus: 0.6151972,
  Mars: 1.8808158,
  Jupiter: 11.862615,
  Saturn: 29.447498,
  Uranus: 84.016846,
  Neptune: 164.79132,
};

const PLANET_ORDER = [
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
] as const;

type Planet = (typeof PLANET_ORDER)[number];

const PLANET_CONFIG: Record<
  Planet,
  {
    emoji: string;
    glowColor: string;
    bgGradient: string;
    accentColor: string;
    borderColor: string;
    tagline: string;
  }
> = {
  Mercury: {
    emoji: "☿",
    glowColor: "oklch(0.65 0.04 265 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.65 0.04 265 / 0.12) 0%, transparent 60%)",
    accentColor: "oklch(0.65 0.04 265)",
    borderColor: "oklch(0.65 0.04 265 / 0.35)",
    tagline: "Closest to the Sun",
  },
  Venus: {
    emoji: "♀",
    glowColor: "oklch(0.78 0.18 75 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.78 0.18 75 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.78 0.18 75)",
    borderColor: "oklch(0.78 0.18 75 / 0.35)",
    tagline: "Morning star",
  },
  Mars: {
    emoji: "♂",
    glowColor: "oklch(0.62 0.22 22 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.62 0.22 22 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.62 0.22 22)",
    borderColor: "oklch(0.62 0.22 22 / 0.35)",
    tagline: "The Red Planet",
  },
  Jupiter: {
    emoji: "♃",
    glowColor: "oklch(0.72 0.15 52 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.72 0.15 52 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.72 0.15 52)",
    borderColor: "oklch(0.72 0.15 52 / 0.35)",
    tagline: "King of planets",
  },
  Saturn: {
    emoji: "♄",
    glowColor: "oklch(0.80 0.14 95 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.80 0.14 95 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.80 0.14 95)",
    borderColor: "oklch(0.80 0.14 95 / 0.35)",
    tagline: "Lord of the rings",
  },
  Uranus: {
    emoji: "⛢",
    glowColor: "oklch(0.75 0.16 195 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.75 0.16 195 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.75 0.16 195)",
    borderColor: "oklch(0.75 0.16 195 / 0.35)",
    tagline: "The tilted planet",
  },
  Neptune: {
    emoji: "♆",
    glowColor: "oklch(0.52 0.22 250 / 0.5)",
    bgGradient:
      "radial-gradient(ellipse at 15% 50%, oklch(0.52 0.22 250 / 0.15) 0%, transparent 60%)",
    accentColor: "oklch(0.52 0.22 250)",
    borderColor: "oklch(0.52 0.22 250 / 0.35)",
    tagline: "God of the sea",
  },
};

// ─── Star Field Canvas ────────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  opacity: number;
  speed: number;
  phase: number;
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initStars = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 3500);
    starsRef.current = Array.from({ length: count }, () => {
      const baseOpacity = Math.random() * 0.6 + 0.1;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.2,
        baseOpacity,
        opacity: baseOpacity,
        speed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.opacity =
          star.baseOpacity +
          Math.sin(timeRef.current * star.speed * 60 + star.phase) *
            star.baseOpacity *
            0.5;
        star.opacity = Math.max(0, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 220, 255, ${star.opacity})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Calculations ─────────────────────────────────────────────────────────────

function calcEarthAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const now = new Date();
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (now.getTime() - birth.getTime()) / msPerYear;
}

function calcPlanetAges(earthAge: number): Record<Planet, number> {
  return Object.fromEntries(
    PLANET_ORDER.map((planet) => [planet, earthAge / ORBITAL_PERIODS[planet]]),
  ) as Record<Planet, number>;
}

function formatAge(age: number): string {
  return age.toFixed(1);
}

// ─── Planet Card ──────────────────────────────────────────────────────────────

interface PlanetCardProps {
  planet: Planet;
  age: number;
  index: number;
}

function PlanetCard({ planet, age, index }: PlanetCardProps) {
  const config = PLANET_CONFIG[planet];
  const ocid = `calculator.planet_card.${index + 1}` as const;

  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: `${config.bgGradient}, oklch(0.13 0.025 265 / 0.85)`,
        border: `1px solid ${config.borderColor}`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 24px -4px ${config.glowColor}, inset 0 1px 0 oklch(1 0 0 / 0.06)`,
      }}
    >
      {/* Orb glow blob */}
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: config.accentColor }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4 px-5 py-4">
        {/* Planet symbol */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{
            background: `radial-gradient(circle at 35% 35%, oklch(from ${config.accentColor} calc(l + 0.15) c h / 0.3), ${config.accentColor}18)`,
            border: `1px solid ${config.accentColor}40`,
            color: config.accentColor,
            textShadow: `0 0 12px ${config.glowColor}`,
          }}
          aria-hidden="true"
        >
          {config.emoji}
        </div>

        {/* Planet info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3
              className="text-base font-semibold tracking-wide"
              style={{ color: config.accentColor }}
            >
              {planet}
            </h3>
            <span className="text-xs" style={{ color: "oklch(0.55 0.04 265)" }}>
              {config.tagline}
            </span>
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{
                color: "oklch(0.94 0.02 265)",
                textShadow: `0 0 20px ${config.glowColor}`,
              }}
            >
              {formatAge(age)}
            </span>
            <span className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
              years old
            </span>
          </div>
        </div>

        {/* Orbital period badge */}
        <div
          className="flex-shrink-0 text-right"
          style={{ color: "oklch(0.45 0.04 265)" }}
        >
          <div className="text-xs leading-none">1 year =</div>
          <div className="text-xs leading-none mt-0.5">
            {ORBITAL_PERIODS[planet] < 1
              ? `${(ORBITAL_PERIODS[planet] * 365).toFixed(0)}d Earth`
              : `${ORBITAL_PERIODS[planet].toFixed(1)}y Earth`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Comparison Line ──────────────────────────────────────────────────────────

interface ComparisonLineProps {
  planetAges: Record<Planet, number>;
}

function ComparisonLine({ planetAges }: ComparisonLineProps) {
  const entries = PLANET_ORDER.map((p) => ({ planet: p, age: planetAges[p] }));
  const oldest = entries.reduce((a, b) => (a.age > b.age ? a : b));
  const youngest = entries.reduce((a, b) => (a.age < b.age ? a : b));

  const oldestConfig = PLANET_CONFIG[oldest.planet];
  const youngestConfig = PLANET_CONFIG[youngest.planet];

  return (
    <motion.div
      data-ocid="calculator.comparison_line"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl px-5 py-4 text-center text-sm leading-relaxed"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, oklch(0.72 0.18 225 / 0.08) 0%, oklch(0.13 0.025 265 / 0.7) 70%)",
        border: "1px solid oklch(0.72 0.18 225 / 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span
        className="mr-1 text-base"
        aria-hidden="true"
        style={{ color: "oklch(0.72 0.18 225)" }}
      >
        ✦
      </span>
      <span style={{ color: "oklch(0.75 0.04 265)" }}>You&apos;d be </span>
      <strong style={{ color: oldestConfig.accentColor }}>
        {formatAge(oldest.age)} on {oldest.planet}
      </strong>
      <span style={{ color: "oklch(0.75 0.04 265)" }}> but only </span>
      <strong style={{ color: youngestConfig.accentColor }}>
        {formatAge(youngest.age)} on {youngest.planet}
      </strong>
      <span style={{ color: "oklch(0.75 0.04 265)" }}>.</span>
      <span
        className="ml-1 text-base"
        aria-hidden="true"
        style={{ color: "oklch(0.72 0.18 225)" }}
      >
        ✦
      </span>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 130,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const validateDate = useCallback((value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    const now = new Date();
    if (Number.isNaN(date.getTime())) return "Please enter a valid date.";
    if (date >= now) return "Birthdate must be in the past.";
    const minD = new Date(
      now.getFullYear() - 130,
      now.getMonth(),
      now.getDate(),
    );
    if (date < minD) return "That's a bit too far back — try within 130 years.";
    return null;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthdate(val);
    setError(validateDate(val));
  };

  const isValid = birthdate !== "" && error === null;
  const earthAge = isValid ? calcEarthAge(birthdate) : null;
  const planetAges = earthAge !== null ? calcPlanetAges(earthAge) : null;

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: "oklch(0.09 0.015 265)" }}
    >
      {/* Animated star field */}
      <StarField />

      {/* Nebula backdrop blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.52 0.22 250) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-8"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.62 0.22 22) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <main
        className="relative flex-1 flex flex-col items-center px-4 pt-10 pb-8"
        style={{ zIndex: 1 }}
      >
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="text-4xl mb-2 leading-none" aria-hidden="true">
              🪐
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
              style={{
                color: "oklch(0.94 0.02 265)",
                textShadow: "0 0 40px oklch(0.72 0.18 225 / 0.4)",
                fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif",
              }}
            >
              Your Age on
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.16 195), oklch(0.72 0.18 225), oklch(0.78 0.18 75))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Other Planets
              </span>
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "oklch(0.55 0.04 265)" }}
            >
              Enter your birthdate to explore how old you'd be across the solar
              system.
            </p>
          </motion.header>

          {/* Date input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-2"
          >
            <label
              htmlFor="birthdate"
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "oklch(0.55 0.06 225)" }}
            >
              Your Birthdate
            </label>
            <div className="relative">
              <input
                id="birthdate"
                data-ocid="calculator.birthdate_input"
                type="date"
                value={birthdate}
                min={minDate}
                max={maxDate}
                onChange={handleChange}
                aria-describedby={error ? "birthdate-error" : undefined}
                aria-invalid={error !== null}
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                style={{
                  background: "oklch(0.13 0.025 265 / 0.85)",
                  border: error
                    ? "1px solid oklch(0.62 0.22 22 / 0.7)"
                    : birthdate && !error
                      ? "1px solid oklch(0.72 0.18 225 / 0.5)"
                      : "1px solid oklch(0.28 0.04 265)",
                  color: "oklch(0.94 0.02 265)",
                  backdropFilter: "blur(8px)",
                  boxShadow: error
                    ? "0 0 0 3px oklch(0.62 0.22 22 / 0.15)"
                    : birthdate && !error
                      ? "0 0 0 3px oklch(0.72 0.18 225 / 0.12)"
                      : "none",
                  fontSize: "16px",
                }}
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  id="birthdate-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs px-1"
                  style={{ color: "oklch(0.72 0.22 22)" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isValid && planetAges && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {/* Earth age context */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center text-xs"
                  style={{ color: "oklch(0.55 0.04 265)" }}
                >
                  <span style={{ color: "oklch(0.72 0.18 225 / 0.7)" }}>
                    🌍
                  </span>{" "}
                  You are{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.78 0.04 265)" }}
                  >
                    {formatAge(earthAge!)} Earth years
                  </span>{" "}
                  old
                </motion.div>

                {/* Comparison line */}
                <ComparisonLine planetAges={planetAges} />

                {/* Planet cards */}
                <section
                  data-ocid="calculator.results_section"
                  aria-label="Planet age results"
                  className="flex flex-col gap-3"
                >
                  {PLANET_ORDER.map((planet, i) => (
                    <PlanetCard
                      key={planet}
                      planet={planet}
                      age={planetAges[planet]}
                      index={i}
                    />
                  ))}
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty prompt when no date */}
          <AnimatePresence>
            {!birthdate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center py-8"
                style={{ color: "oklch(0.38 0.04 265)" }}
              >
                <div className="text-5xl mb-3 opacity-50" aria-hidden="true">
                  ✦
                </div>
                <p className="text-sm">
                  Pick your birthdate above to
                  <br />
                  journey through the solar system.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative text-center py-4 text-xs"
        style={{ color: "oklch(0.38 0.04 265)", zIndex: 1 }}
      >
        © {currentYear}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-opacity hover:opacity-80"
          style={{ color: "oklch(0.45 0.06 225)" }}
        >
          Built with ♥ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
