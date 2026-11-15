import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { slides } from "@/data/brief";
import { chartFor } from "@/components/charts";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

function asset(path: string) {
  if (typeof window === "undefined") return path;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
  return `${prefix}${path}`;
}

type Engine = {
  ctx: AudioContext;
  buffers: AudioBuffer[];
  offsets: number[];
  sources: AudioBufferSourceNode[];
  origin: number;
  position: number;
  playing: boolean;
};

function stopSources(engine: Engine) {
  for (const source of engine.sources) {
    try {
      source.onended = null;
      source.stop();
    } catch {
      /* already stopped */
    }
    source.disconnect();
  }
  engine.sources = [];
}

function schedule(engine: Engine, from: number) {
  stopSources(engine);
  const when0 = engine.ctx.currentTime + 0.05;
  engine.position = from;
  engine.origin = when0 - from;
  engine.playing = true;
  engine.buffers.forEach((buffer, i) => {
    const start = engine.offsets[i];
    const end = start + buffer.duration;
    if (end <= from + 0.01) return;
    const offset = Math.max(0, from - start);
    const source = engine.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(engine.ctx.destination);
    source.start(when0 + (start + offset - from), offset);
    engine.sources.push(source);
  });
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const [sound, setSound] = useState<"loading" | "running" | "blocked" | "error">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<Engine | null>(null);

  const slide = slides[index];
  const Chart = chartFor[slide.id];

  useEffect(() => {
    const ctx = new AudioContext();
    const engine: Engine = {
      ctx,
      buffers: [],
      offsets: [],
      sources: [],
      origin: 0,
      position: 0,
      playing: false,
    };
    engineRef.current = engine;
    let cancelled = false;
    let gate = 0;

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.src = asset("/briefing.mp4");
      video.poster = asset("/poster.png");
      void video.play().catch(() => undefined);
    }

    async function arm() {
      try {
        const buffers = await Promise.all(
          slides.map(async (item) => {
            const response = await fetch(asset(item.audio));
            if (!response.ok) throw new Error(`audio ${response.status}`);
            const bytes = await response.arrayBuffer();
            return ctx.decodeAudioData(bytes);
          }),
        );
        if (cancelled) return;
        engine.buffers = buffers;
        let cursor = 0;
        engine.offsets = buffers.map((buffer) => {
          const start = cursor;
          cursor += buffer.duration;
          return start;
        });
        const begin = () => {
          if (cancelled || engine.playing || ctx.state !== "running") return;
          schedule(engine, engine.position);
          setPlaying(true);
          setNeedsSound(false);
          setSound("running");
        };
        ctx.onstatechange = begin;
        void ctx.resume();
        gate = window.setTimeout(() => {
          if (cancelled || engine.playing) return;
          if (ctx.state === "running") begin();
          else {
            setNeedsSound(true);
            setSound("blocked");
          }
        }, 400);
      } catch {
        if (!cancelled) {
          setNeedsSound(true);
          setSound("error");
        }
      }
    }

    function tick() {
      const current = engineRef.current;
      if (!current?.playing) return;
      const time = current.ctx.currentTime - current.origin;
      let next = 0;
      for (let i = 0; i < current.offsets.length; i += 1) {
        if (time >= current.offsets[i]) next = i;
      }
      setIndex((value) => (value === next ? value : next));
      const clip = videoRef.current;
      if (clip && Number.isFinite(clip.duration) && Math.abs(clip.currentTime - time) > 0.45) {
        clip.currentTime = Math.min(time, clip.duration);
      }
      const last = current.buffers.at(-1);
      const end = last ? current.offsets[current.offsets.length - 1] + last.duration : 0;
      if (time >= end - 0.05) {
        current.playing = false;
        setPlaying(false);
      }
    }

    void arm();
    const timer = window.setInterval(tick, 200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearTimeout(gate);
      stopSources(engine);
      void ctx.close();
      engineRef.current = null;
    };
  }, []);

  async function resumeAt(position: number) {
    const engine = engineRef.current;
    if (!engine || engine.buffers.length === 0) return;
    try {
      await engine.ctx.resume();
    } catch {
      setNeedsSound(true);
      return;
    }
    if (engine.ctx.state !== "running") {
      engine.position = position;
      setNeedsSound(true);
      setSound("blocked");
      return;
    }
    schedule(engine, position);
    setPlaying(true);
    setNeedsSound(false);
    setSound("running");
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.currentTime = position;
      void video.play().catch(() => undefined);
    }
  }

  function playFrom(i: number) {
    const engine = engineRef.current;
    const next = (i + slides.length) % slides.length;
    setIndex(next);
    void resumeAt(engine?.offsets[next] ?? 0);
  }

  function togglePlay() {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.playing) {
      engine.position = Math.max(0, engine.ctx.currentTime - engine.origin);
      engine.playing = false;
      stopSources(engine);
      setPlaying(false);
      videoRef.current?.pause();
      return;
    }
    void resumeAt(engine.position);
  }

  return (
    <div className="min-h-dvh bg-paper text-ink lg:flex" data-sound={sound}>
      <aside className="flex shrink-0 gap-2 overflow-x-auto border-b border-ink/10 px-3 py-3 lg:w-56 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
        <div className="hidden lg:block">
          <p className="font-serif text-xl tracking-tight">FINA News</p>
          <p className="mt-1 text-xs tracking-wide text-ink/60 uppercase">Credit brief</p>
        </div>
        <nav className="flex gap-2 lg:mt-6 lg:flex-col" aria-label="Slides">
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => playFrom(i)}
              className={
                "shrink-0 rounded-full px-3 py-2 text-left text-sm lg:rounded-md " +
                (i === index ? "bg-ink text-paper" : "bg-transparent text-ink/80 hover:bg-ink/5")
              }
            >
              <span className={"mr-2 tabular-nums " + (i === index ? "text-paper/70" : "text-ink/50")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={i === index ? "text-paper" : ""}>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-end justify-between gap-4 px-4 pt-4 lg:px-8 lg:pt-6">
          <div>
            <p className="text-xs tracking-widest text-brass uppercase">{slide.kicker}</p>
            <h1 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{slide.title}</h1>
          </div>
          <p className="hidden text-sm tabular-nums text-ink/50 sm:block">
            {index + 1} / {slides.length}
          </p>
        </header>

        <section className="px-3 pt-3 lg:px-8">
          <div className="rounded-xl border border-ink/10 bg-card p-3 sm:p-4">
            <Chart />
          </div>
        </section>

        <div className="px-3 pt-3 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-ink">
            <video
              ref={videoRef}
              className="aspect-video w-full bg-ink"
              poster="/poster.png"
              controls
              playsInline
              autoPlay
              muted
              preload="auto"
            />
            {needsSound ? (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute bottom-4 left-4 inline-flex h-12 items-center gap-2 rounded-full bg-paper px-5 text-sm font-medium text-ink"
              >
                <Play className="size-4" />
                Tap for sound
              </button>
            ) : null}
          </div>
        </div>

        <footer className="space-y-3 px-4 pb-8 pt-3 lg:px-8">
          <p className="text-base text-ink sm:text-lg">{slide.insight}</p>
          <p className="border-l-2 border-forest pl-3 text-sm text-ink/80">{slide.caption}</p>
          <p className="text-xs text-ink/50">{slide.note}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : "Play briefing"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
