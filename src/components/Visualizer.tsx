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

      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        if (mode === "bars") {
          analyser.getByteFrequencyData(dataArray);

          const barCount = 48;
          const barWidth = (width / barCount) * 0.7;
          const spacing = (width / barCount) * 0.3;

          for (let i = 0; i < barCount; i++) {
            // Pick logarithmic bin index for punchier bass and mid response
            const index = Math.floor(Math.pow(i / barCount, 1.8) * bufferLength);
            const value = dataArray[index] || 0;
            const barHeight = Math.max(4, (value / 255) * (height - 10));

            const x = i * (barWidth + spacing) + spacing;
            const y = height - barHeight;

            // Gradient from cyan to purple to pink
            const grad = ctx.createLinearGradient(0, height, 0, 0);
            grad.addColorStop(0, "#00f0ff");
            grad.addColorStop(0.6, "#9d4edd");
            grad.addColorStop(1, "#ff007f");

            ctx.fillStyle = grad;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0, 240, 255, 0.4)";

            // Rounded bar tops
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
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(255, 0, 127, 0.5)";

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
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();

        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 8 * Math.cos(time * 0.5);
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
    <div className="relative w-full h-28 sm:h-36 rounded-2xl glass-card overflow-hidden p-2 flex items-center justify-center border border-white/5 group">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Mode Switcher */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/80 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => setMode("bars")}
          className={`p-1.5 rounded ${
            mode === "bars" ? "bg-accent-cyan/20 text-accent-cyan" : "text-slate-400 hover:text-white"
          }`}
          title="Spectrum Bars"
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setMode("wave")}
          className={`p-1.5 rounded ${
            mode === "wave" ? "bg-accent-pink/20 text-accent-pink" : "text-slate-400 hover:text-white"
          }`}
          title="Waveform"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

