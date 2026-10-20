import { KoiRenderer } from "./renderer";
import { KoiWorld } from "./world";

const FIXED_STEP = 1 / 60;
const MAX_STEPS = 4;

export class KoiEngine {
  private world = new KoiWorld();
  private renderer: KoiRenderer;
  private animationFrame = 0;
  private previousTime = 0;
  private accumulator = 0;
  private visible = true;
  private disposed = false;
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new KoiRenderer(canvas);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);
    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("blur", this.onPointerLeave);
    document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
    this.resize();
    this.onScroll();
    this.schedule();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("blur", this.onPointerLeave);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
  }

  private resize = () => {
    const bounds = this.canvas.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.resize(bounds.width, bounds.height, dpr);
    this.world.resize(bounds.width, bounds.height);
    if (this.reducedMotion.matches) this.drawStill();
  };

  private schedule() {
    cancelAnimationFrame(this.animationFrame);
    if (this.disposed || !this.visible || this.reducedMotion.matches) return;
    this.previousTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.frame);
  }

  private frame = (time: number) => {
    const elapsed = Math.min(0.1, (time - this.previousTime) / 1000);
    this.previousTime = time;
    this.accumulator += elapsed;
    let steps = 0;
    while (this.accumulator >= FIXED_STEP && steps < MAX_STEPS) {
      this.world.step(FIXED_STEP);
      this.accumulator -= FIXED_STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.accumulator = 0;
    this.renderer.render(this.world);
    this.animationFrame = requestAnimationFrame(this.frame);
  };

  private drawStill() {
    if (this.world.time < 3.5) {
      for (let step = 0; step < 210; step++) this.world.step(FIXED_STEP);
    }
    this.renderer.render(this.world);
  }

  private onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.animationFrame);
      this.drawStill();
    } else this.schedule();
  };

  private onPointerMove = (event: PointerEvent) => {
    const bounds = this.canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
    this.world.pointer.x = x;
    this.world.pointer.y = y;
    this.world.pointer.active = inside && event.pointerType !== "touch";
  };

  private onPointerLeave = () => {
    this.world.pointer.active = false;
  };

  private onScroll = () => {
    this.world.scroll = window.scrollY;
  };
}
