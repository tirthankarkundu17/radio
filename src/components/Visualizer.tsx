"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, BarChart3 } from "lucide-react";

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export function Visualizer({ analyser, isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<"bars" | "wave">("bars");
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        if (mode === "bars") {
          analyser.getByteFrequencyData(dataArray);

          const barCount = 48;
          const barWidth = (width / barCount) * 0.7;
          const spacing = (width / barCount) * 0.3;

          for (let i = 0; i < barCount; i++) {
            const index = Math.floor(Math.pow(i / barCount, 1.8) * bufferLength);
            const value = dataArray[index] || 0;
            const barHeight = Math.max(4, (value / 255) * (height - 12));

            const x = i * (barWidth + spacing) + spacing;
            const y = height - barHeight;

            const grad = ctx.createLinearGradient(0, height, 0, 0);
            grad.addColorStop(0, "#00f0ff");
            grad.addColorStop(0.5, "#9d4edd");
            grad.addColorStop(1, "#ff007f");

            ctx.fillStyle = grad;
            ctx.shadowBlur = isDark ? 10 : 4;
            ctx.shadowColor = isDark ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 180, 216, 0.25)";

            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
            ctx.fill();
          }
        } else {
          // Waveform Mode
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.5;
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, "#00f0ff");
          grad.addColorStop(0.5, "#ff007f");
          grad.addColorStop(1, "#00f0ff");
          ctx.strokeStyle = grad;
          ctx.shadowBlur = isDark ? 12 : 5;
          ctx.shadowColor = isDark ? "rgba(255, 0, 127, 0.5)" : "rgba(255, 0, 127, 0.3)";

          ctx.beginPath();
          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
          }

          ctx.lineTo(width, height / 2);
          ctx.stroke();
        }
      } else {
        // Ambient idle animation
        const time = Date.now() * 0.003;
        ctx.lineWidth = 2;

        const idleGrad = ctx.createLinearGradient(0, 0, width, 0);
        idleGrad.addColorStop(0, isDark ? "rgba(0, 240, 255, 0.35)" : "rgba(0, 180, 216, 0.55)");
        idleGrad.addColorStop(0.5, isDark ? "rgba(157, 78, 221, 0.45)" : "rgba(157, 78, 221, 0.65)");
        idleGrad.addColorStop(1, isDark ? "rgba(255, 0, 127, 0.35)" : "rgba(255, 0, 127, 0.55)");

        ctx.strokeStyle = idleGrad;
        ctx.shadowBlur = isDark ? 8 : 2;
        ctx.shadowColor = isDark ? "rgba(0, 240, 255, 0.3)" : "rgba(0, 180, 216, 0.2)";
        ctx.beginPath();

        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 10 * Math.cos(time * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isPlaying, mode]);

  // Handle high-DPI canvas scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative w-full h-28 sm:h-36 rounded-2xl bg-slate-100/90 dark:bg-slate-950/60 overflow-hidden p-2 flex items-center justify-center border border-slate-200/90 dark:border-white/10 shadow-inner group">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Mode Switcher */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-300 dark:border-white/10 shadow-sm">
        <button
          onClick={() => setMode("bars")}
          className={`p-1.5 rounded transition-colors ${
            mode === "bars"
              ? "bg-accent-cyan/20 text-accent-cyan font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          title="Spectrum Bars"
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setMode("wave")}
          className={`p-1.5 rounded transition-colors ${
            mode === "wave"
              ? "bg-accent-pink/20 text-accent-pink font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          title="Waveform"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
