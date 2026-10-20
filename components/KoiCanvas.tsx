"use client";

import { useEffect, useRef } from "react";
import { KoiEngine } from "@/lib/koi/engine";

export function KoiCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new KoiEngine(canvasRef.current);
    return () => engine.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`koi-canvas ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
