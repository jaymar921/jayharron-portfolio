import { useEffect, useRef, useState } from "react";
import { jayPhoto } from "../../assets/images";
import { resumeProfile } from "../../constants";
import { fetchVisitorCountry, resolveGreeting } from "../../lib/greeting";

/**
 * The few seconds before the desktop: a boot log, then who this is, then a
 * hello in the visitor's language. The desktop is already rendered underneath,
 * so the exit is just this overlay letting go of its blur.
 *
 * It always plays through; there is no skip.
 */

// Milliseconds from mount, about six seconds end to end. Reduced motion gets
// a shorter run with no stagger. The progress bar in index.css is timed to
// fill between `identity` and `exit`.
const TIMINGS = {
  normal: { lineEvery: 270, identity: 2400, greeting: 3100, exit: 5300, done: 6000 },
  reduced: { lineEvery: 0, identity: 500, greeting: 500, exit: 2000, done: 2000 },
};

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function bootLines(locale) {
  const region = locale.countryName
    ? `${locale.countryName} (${locale.lang})`
    : `unknown, falling back to ${locale.lang}`;

  return [
    "Mounted /home/jayharron.",
    "Started dotnet runtime.",
    "Started node (react, next.js).",
    "Unlocked secrets from Azure Key Vault.",
    "Reached target Azure DevOps Pipelines.",
    "Loaded plugins from ~/jhprojects.",
    `Detected visitor region: ${region}.`,
    "Started desktop session.",
  ];
}

function BootScreen({ onDone }) {
  const [reduced] = useState(prefersReducedMotion);
  const timing = reduced ? TIMINGS.reduced : TIMINGS.normal;

  // Start from the browser's own guess so there is always something to show,
  // then upgrade to the edge's answer if it lands before the greeting does.
  const [locale, setLocale] = useState(() => resolveGreeting());
  const [phase, setPhase] = useState("log"); // log -> identity -> exit
  const [shownLines, setShownLines] = useState(reduced ? Infinity : 0);
  const [showGreeting, setShowGreeting] = useState(false);
  const greetingShown = useRef(false);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    fetchVisitorCountry({ timeoutMs: 2500 }).then((country) => {
      if (cancelled || !country || greetingShown.current) return;
      setLocale(resolveGreeting(country));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timers = [];
    const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));

    if (timing.lineEvery > 0) {
      for (let i = 1; i <= 8; i += 1) at(i * timing.lineEvery, () => setShownLines(i));
    }
    at(timing.identity, () => setPhase("identity"));
    at(timing.greeting, () => {
      greetingShown.current = true;
      setShowGreeting(true);
    });
    at(timing.exit, () => setPhase("exit"));
    at(timing.done, () => onDoneRef.current());

    return () => timers.forEach(window.clearTimeout);
  }, [timing]);

  const lines = bootLines(locale);

  return (
    <div
      className={`boot-screen fixed inset-0 flex items-center justify-center overflow-hidden font-mono text-slate-200 ${
        phase === "exit" ? "is-exiting" : ""
      } ${reduced ? "is-reduced" : ""}`}
      style={{ zIndex: 2147483000 }}
      role="dialog"
      aria-modal="true"
      aria-label="Starting the desktop"
    >
      <div className="boot-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Boot log, top left like a real console. */}
      <div
        className={`absolute left-4 top-4 max-w-[calc(100%-2rem)] text-[11px] leading-5 transition-opacity duration-500 sm:left-8 sm:top-8 sm:text-xs ${
          phase === "log" ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <p className="mb-2 text-ubuntu-warm-grey">jhOS 26.10 cebu tty1</p>
        {lines.slice(0, shownLines).map((line, index) => (
          // Indexed: the region line can be rewritten mid-boot and should not
          // animate in a second time when it is.
          <p key={index} className="boot-line truncate">
            <span className="text-slate-500">[</span>
            <span className="text-emerald-400">  OK  </span>
            <span className="text-slate-500">]</span> {line}
          </p>
        ))}
        {phase === "log" && <span className="boot-cursor mt-1 inline-block h-4 w-2 bg-slate-300" />}
      </div>

      {/* Identity and greeting. */}
      <div
        className={`boot-identity relative flex w-full max-w-md flex-col items-center px-6 text-center ${
          phase === "log" ? "" : "is-shown"
        }`}
      >
        <div
          className={`boot-greeting mb-6 min-h-[4.5rem] ${showGreeting ? "is-shown" : ""}`}
          dir={locale.dir}
          lang={locale.lang}
          role="status"
          aria-live="polite"
        >
          {showGreeting && (
            <>
              <p className="font-ubuntu text-3xl font-bold text-white sm:text-4xl">
                {locale.greeting}
              </p>
              <p className="mt-2 font-ubuntu text-sm text-ubuntu-warm-grey">
                {locale.welcome}
              </p>
            </>
          )}
        </div>

        <img
          src={jayPhoto}
          alt=""
          className="h-20 w-20 rounded-full object-cover ring-2 ring-white/15"
        />
        <h1 className="mt-4 font-ubuntu text-xl font-bold tracking-tight text-white sm:text-2xl">
          {resumeProfile.name}
        </h1>
        <p className="mt-1 font-ubuntu text-sm font-medium text-ubuntu-orange">
          {resumeProfile.title}
        </p>
        <p className="font-ubuntu text-xs text-ubuntu-warm-grey">{resumeProfile.tagline}</p>

        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="boot-progress h-full rounded-full bg-ubuntu-orange" />
        </div>
      </div>
    </div>
  );
}

export default BootScreen;
