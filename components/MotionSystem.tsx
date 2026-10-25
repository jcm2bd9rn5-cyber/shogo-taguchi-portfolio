"use client";

import { useEffect, useRef } from "react";

export function MotionSystem() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    root.classList.add("motion-ready");

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    const magneticTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magneticCleanups = magneticTargets.map((target) => {
      const onMove = (event: PointerEvent) => {
        if (reducedMotion.matches || event.pointerType === "touch") return;
        const bounds = target.getBoundingClientRect();
        const x = Math.max(-8, Math.min(8, (event.clientX - bounds.left - bounds.width / 2) * 0.04));
        const y = Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * 0.08));
        target.style.setProperty("--magnet-x", `${x}px`);
        target.style.setProperty("--magnet-y", `${y}px`);
      };
      const onLeave = () => {
        target.style.setProperty("--magnet-x", "0px");
        target.style.setProperty("--magnet-y", "0px");
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
      return () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerleave", onLeave);
      };
    });

    let targetX = -80;
    let targetY = -80;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;
    let cursorRunning = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.2 && !document.hidden) {
        frame = requestAnimationFrame(render);
      } else {
        cursorRunning = false;
      }
    };

    const startCursor = () => {
      if (cursorRunning || document.hidden || reducedMotion.matches || !finePointer.matches) return;
      cursorRunning = true;
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorRef.current?.classList.add("is-present");
      startCursor();
    };

    const interactiveTargets = Array.from(document.querySelectorAll<HTMLElement>("a, button"));
    const cursorCleanups = interactiveTargets.map((target) => {
      const onEnter = () => cursorRef.current?.classList.add("is-active");
      const onLeave = () => cursorRef.current?.classList.remove("is-active");
      target.addEventListener("pointerenter", onEnter);
      target.addEventListener("pointerleave", onLeave);
      return () => {
        target.removeEventListener("pointerenter", onEnter);
        target.removeEventListener("pointerleave", onLeave);
      };
    });

    let scrollTicking = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      scrollTicking = false;
    };
    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateProgress);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        cursorRunning = false;
      } else if (!reducedMotion.matches) {
        updateProgress();
      }
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame);
        cursorRunning = false;
        cursorRef.current?.classList.remove("is-present");
        revealTargets.forEach((target) => target.classList.add("is-visible"));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer.matches) window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);
    updateProgress();
    if (reducedMotion.matches) onMotionChange();

    return () => {
      observer.disconnect();
      magneticCleanups.forEach((cleanup) => cleanup());
      cursorCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <div className="cursor-follower" ref={cursorRef} aria-hidden="true" />
    </>
  );
}
