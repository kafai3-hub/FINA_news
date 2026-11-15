import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { slides } from "@/data/brief";
import { chartFor } from "@/components/charts";

export function Deck() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingRef = useRef(false);
  const indexRef = useRef(0);

  const slide = slides[index];
  const Chart = chartFor[slide.id];

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  function load(next: number, shouldPlay: boolean) {
    const i = (next + slides.length) % slides.length;
    setIndex(i);
    indexRef.current = i;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = slides[i].audio;
    if (shouldPlay) void audio.play().catch(() => setPlaying(false));
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    playingRef.current = true;
    if (!audio.src || audio.src.endsWith(slides[index].audio) === false) {
      audio.src = slides[index].audio;
    }
    void audio.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") load(indexRef.current + 1, playingRef.current);
      if (event.key === "ArrowLeft") load(indexRef.current - 1, playingRef.current);
      if (event.key === " ") {
        event.preventDefault();
        const audio = audioRef.current;
        if (!audio) return;
        if (playingRef.current) {
          audio.pause();
          setPlaying(false);
        } else {
          setPlaying(true);
          playingRef.current = true;
          if (!audio.getAttribute("src")) audio.src = slides[indexRef.current].audio;
          void audio.play().catch(() => setPlaying(false));
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink lg:h-dvh lg:flex-row lg:overflow-hidden">
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
              onClick={() => load(i, playingRef.current)}
              className={
                "shrink-0 rounded-full px-3 py-2 text-left text-sm lg:rounded-md " +
                (i === index ? "bg-ink text-paper" : "bg-transparent text-ink/80 hover:bg-ink/5")
              }
            >
              <span className={"mr-2 tabular-nums " + (i === index ? "text-paper/70" : "text-ink/50")}>{String(i + 1).padStart(2, "0")}</span>
              <span className={i === index ? "text-paper" : ""}>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col lg:min-h-0">
        <header className="flex items-end justify-between gap-4 px-4 pt-4 lg:px-8 lg:pt-6">
          <div>
            <p className="text-xs tracking-widest text-brass uppercase">{slide.kicker}</p>
            <h1 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{slide.title}</h1>
          </div>
          <p className="hidden text-sm tabular-nums text-ink/50 sm:block">
            {index + 1} / {slides.length}
          </p>
        </header>

        <section className="px-3 py-3 lg:min-h-0 lg:flex-1 lg:px-8 lg:py-4">
          <div className="rounded-xl border border-ink/10 bg-card p-3 sm:p-4 lg:h-full">
            <Chart />
          </div>
        </section>

        <footer className="space-y-3 px-4 pb-4 lg:px-8 lg:pb-6">
          <p className="text-base text-ink sm:text-lg">{slide.insight}</p>
          <p className="border-l-2 border-forest pl-3 text-sm text-ink/80">{slide.caption}</p>
          <p className="text-xs text-ink/50">{slide.note}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => load(index - 1, playing)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-card text-ink"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : "Play briefing"}
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => load(index + 1, playing)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-card text-ink"
            >
              <ChevronRight className="size-5" />
            </button>
            <a href="/briefing.mp4" className="h-11 content-center rounded-full px-3 text-sm text-ink/70">
              Video file
            </a>
          </div>
        </footer>
      </main>

      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => {
          if (!playingRef.current) return;
          const next = indexRef.current + 1;
          if (next >= slides.length) {
            setPlaying(false);
            return;
          }
          load(next, true);
        }}
        onPause={() => {
          if (audioRef.current?.ended) return;
        }}
      />
    </div>
  );
}
