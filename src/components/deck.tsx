import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cueStarts, slides } from "@/data/brief";
import { chartFor } from "@/components/charts";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

function asset(path: string) {
  if (typeof window === "undefined") return path;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
  return `${prefix}${path}`;
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slide = slides[index];
  const Chart = chartFor[slide.id];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = asset("/briefing.mp4");
    video.poster = asset("/poster.png");
    let cancelled = false;

    async function start(clip: HTMLVideoElement) {
      clip.muted = false;
      try {
        await clip.play();
        if (!cancelled) setPlaying(true);
      } catch {
        clip.muted = true;
        try {
          await clip.play();
          if (!cancelled) {
            setPlaying(true);
            setNeedsSound(true);
          }
        } catch {
          if (!cancelled) setNeedsSound(true);
        }
      }
    }

    void start(video);
    return () => {
      cancelled = true;
    };
  }, []);

  function onTime() {
    const time = videoRef.current?.currentTime ?? 0;
    let next = 0;
    for (let i = 0; i < cueStarts.length; i += 1) {
      if (time >= cueStarts[i]) next = i;
    }
    setIndex((current) => (current === next ? current : next));
  }

  function playFrom(i: number) {
    const video = videoRef.current;
    const next = (i + slides.length) % slides.length;
    setIndex(next);
    if (!video) return;
    video.muted = false;
    video.currentTime = cueStarts[next] ?? 0;
    void video
      .play()
      .then(() => {
        setPlaying(true);
        setNeedsSound(false);
      })
      .catch(() => setNeedsSound(true));
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }
    video.muted = false;
    void video
      .play()
      .then(() => {
        setPlaying(true);
        setNeedsSound(false);
      })
      .catch(() => setNeedsSound(true));
  }

  return (
    <div className="min-h-dvh bg-paper text-ink lg:flex">
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
              preload="auto"
              onTimeUpdate={onTime}
              onPlay={() => setPlaying(true)}
              onPause={() => {
                if (videoRef.current?.ended) setPlaying(false);
              }}
              onEnded={() => setPlaying(false)}
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
