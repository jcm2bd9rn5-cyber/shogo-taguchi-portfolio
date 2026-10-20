import { angleDelta, clamp, random, TAU } from "./math";

export const KOI_NODES = 20;

export type KoiPattern = "kohaku" | "sanke";

export interface Koi {
  id: number;
  pattern: KoiPattern;
  length: number;
  depth: number;
  nodes: Float32Array;
  heading: number;
  speed: number;
  phase: number;
  turn: number;
  wander: number;
  orbitDirection: 1 | -1;
  orbitRadius: number;
}

export interface Minnow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  depth: number;
}

export class KoiWorld {
  width = 0;
  height = 0;
  time = 0;
  scroll = 0;
  koi: Koi[] = [];
  minnows: Minnow[] = [];
  pointer = { x: 0, y: 0, active: false };

  resize(width: number, height: number) {
    const firstLayout = this.width === 0;
    this.width = width;
    this.height = height;
    if (firstLayout) this.seed();
    else {
      for (const koi of this.koi) {
        for (let index = 0; index < KOI_NODES; index++) {
          koi.nodes[index * 2] = clamp(koi.nodes[index * 2], -koi.length, width + koi.length);
          koi.nodes[index * 2 + 1] = clamp(koi.nodes[index * 2 + 1], -koi.length, height + koi.length);
        }
      }
    }
  }

  private seed() {
    const minSide = Math.min(this.width, this.height);
    const baseLength = clamp(minSide * 0.58, 250, 500);
    const specs: Array<Pick<Koi, "pattern" | "depth" | "orbitDirection"> & {
      size: number;
      x: number;
      y: number;
      angle: number;
      radius: number;
    }> = [
      { pattern: "kohaku", size: 1, depth: 1, orbitDirection: 1, x: 0.72, y: 0.4, angle: -0.3, radius: 0.36 },
      { pattern: "sanke", size: 0.64, depth: 0.62, orbitDirection: -1, x: 0.76, y: 0.72, angle: 2.89, radius: 0.28 },
      { pattern: "kohaku", size: 0.36, depth: 0.36, orbitDirection: -1, x: 0.34, y: 0.24, angle: 1.22, radius: 0.24 },
      { pattern: "sanke", size: 0.29, depth: 0.28, orbitDirection: 1, x: 0.88, y: 0.18, angle: 2.34, radius: 0.2 },
    ];

    this.koi = specs.map((spec, index) => {
      const length = baseLength * spec.size;
      const angle = spec.angle;
      const x = this.width * spec.x;
      const y = this.height * spec.y;
      const nodes = new Float32Array(KOI_NODES * 2);
      const segment = length / (KOI_NODES - 1);
      for (let node = 0; node < KOI_NODES; node++) {
        nodes[node * 2] = x - Math.cos(angle) * segment * node;
        nodes[node * 2 + 1] = y - Math.sin(angle) * segment * node;
      }
      return {
        id: index + 1,
        pattern: spec.pattern,
        length,
        depth: spec.depth,
        nodes,
        heading: angle,
        speed: 28 + 8 * spec.depth,
        phase: index * 2.4,
        turn: 0,
        wander: index ? -0.25 : 0.2,
        orbitDirection: spec.orbitDirection,
        orbitRadius: minSide * spec.radius,
      };
    });
    this.koi.sort((a, b) => a.depth - b.depth);

    const minnowCount = clamp(Math.round((this.width * this.height) / 62000), 8, 18);
    this.minnows = Array.from({ length: minnowCount }, (_, index) => {
      const angle = random(0, TAU);
      const speed = random(8, 16);
      return {
        x: random(0, this.width),
        y: random(0, this.height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        phase: index * 0.83,
        depth: random(0.25, 0.7),
      };
    });
  }

  step(dt: number) {
    this.time += dt;
    this.stepMinnows(dt);
    this.stepKoi(dt);
  }

  private stepKoi(dt: number) {
    const centerX = this.width * 0.58;
    const centerY = this.height * 0.5;
    const minSide = Math.min(this.width, this.height);

    for (const koi of this.koi) {
      const headX = koi.nodes[0];
      const headY = koi.nodes[1];
      let desiredX = Math.cos(koi.heading) * 0.8;
      let desiredY = Math.sin(koi.heading) * 0.8;

      // A slowly changing Reynolds wander vector prevents mechanical loops.
      koi.wander = clamp(koi.wander + random(-1, 1) * dt * 0.65, -0.8, 0.8);
      desiredX += Math.cos(koi.heading + koi.wander) * 0.38;
      desiredY += Math.sin(koi.heading + koi.wander) * 0.38;

      // Tangential orbit with a soft radial correction.
      const scaleX = this.width / minSide;
      const radialX = (headX - centerX) / scaleX;
      const radialY = headY - centerY;
      const radialLength = Math.hypot(radialX, radialY) || 1;
      const orbit = koi.orbitRadius * (1 + 0.1 * Math.sin(this.time * 0.11 + koi.id));
      const correction = clamp((orbit - radialLength) / orbit, -1, 1);
      desiredX += ((-radialY / radialLength) * koi.orbitDirection + (radialX / radialLength) * correction) * 0.72;
      desiredY += ((radialX / radialLength) * koi.orbitDirection + (radialY / radialLength) * correction) * 0.72;

      // The pointer nudges the route rather than making the fish bolt.
      if (this.pointer.active) {
        const dx = headX - this.pointer.x;
        const dy = headY - this.pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = koi.length * 0.72;
        if (distance < radius && distance > 1) {
          const force = Math.pow(1 - distance / radius, 2) * 1.8;
          desiredX += (dx / distance) * force;
          desiredY += (dy / distance) * force;
        }
      }

      // Koi separate from one another by testing heads against each spine.
      for (const other of this.koi) {
        if (other === koi) continue;
        for (let node = 0; node < KOI_NODES; node += 4) {
          const dx = headX - other.nodes[node * 2];
          const dy = headY - other.nodes[node * 2 + 1];
          const distance = Math.hypot(dx, dy);
          const radius = (koi.length + other.length) * 0.32;
          if (distance < radius && distance > 1) {
            const force = (1 - distance / radius) * 1.7;
            desiredX += (dx / distance) * force;
            desiredY += (dy / distance) * force;
          }
        }
      }

      // Keep the name and introduction calm and readable.
      const quietX = (headX - this.width * 0.24) / (this.width * 0.27);
      const quietY = (headY - this.height * 0.72) / (this.height * 0.23);
      const quietDistance = quietX * quietX + quietY * quietY;
      if (quietDistance < 1) {
        const length = Math.sqrt(quietDistance) || 0.001;
        const force = (1 - length) * 1.8;
        desiredX += (quietX / length) * force;
        desiredY += (quietY / length) * force;
      }

      const margin = koi.length * 0.12;
      if (headX < margin || headX > this.width - margin || headY < margin || headY > this.height - margin) {
        const dx = centerX - headX;
        const dy = centerY - headY;
        const distance = Math.hypot(dx, dy) || 1;
        const overflow = Math.max(margin - headX, headX - (this.width - margin), margin - headY, headY - (this.height - margin));
        const force = 1.1 + clamp(overflow / (koi.length * 0.25), 0, 1) * 2.5;
        desiredX += (dx / distance) * force;
        desiredY += (dy / distance) * force;
      }

      const desiredHeading = Math.atan2(desiredY, desiredX);
      const maxTurn = (0.62 + (1 - koi.depth) * 0.12) * dt;
      const turn = clamp(angleDelta(koi.heading, desiredHeading), -maxTurn, maxTurn);
      koi.heading += turn;
      koi.turn += (turn / dt - koi.turn) * Math.min(1, dt * 3.2);

      const cruise = 24 + koi.length * 0.033;
      const pulse = 1 + Math.sin(this.time * 0.45 + koi.id) * 0.08;
      koi.speed += (cruise * pulse - koi.speed) * Math.min(1, dt * 0.8);
      koi.phase += dt * (2.2 + koi.speed / 28);
      koi.nodes[0] += Math.cos(koi.heading) * koi.speed * dt;
      koi.nodes[1] += Math.sin(koi.heading) * koi.speed * dt;

      // Follow-the-leader spine. Joint curvature is limited so the body cannot fold.
      const segment = koi.length / (KOI_NODES - 1);
      let previousAngle = koi.heading + Math.PI;
      for (let node = 1; node < KOI_NODES; node++) {
        const previousX = koi.nodes[(node - 1) * 2];
        const previousY = koi.nodes[(node - 1) * 2 + 1];
        let angle = Math.atan2(koi.nodes[node * 2 + 1] - previousY, koi.nodes[node * 2] - previousX);
        const flexibility = 0.105 + (node / (KOI_NODES - 1)) * 0.065;
        angle = previousAngle + clamp(angleDelta(previousAngle, angle), -flexibility, flexibility);
        koi.nodes[node * 2] = previousX + Math.cos(angle) * segment;
        koi.nodes[node * 2 + 1] = previousY + Math.sin(angle) * segment;
        previousAngle = angle;
      }
    }
  }

  private stepMinnows(dt: number) {
    const perception = 86;
    for (const fish of this.minnows) {
      let separationX = 0;
      let separationY = 0;
      let alignmentX = 0;
      let alignmentY = 0;
      let cohesionX = 0;
      let cohesionY = 0;
      let neighbours = 0;

      for (const other of this.minnows) {
        if (other === fish) continue;
        const dx = other.x - fish.x;
        const dy = other.y - fish.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= perception || distance < 0.001) continue;
        if (distance < 25) {
          const force = (1 - distance / 25) / distance;
          separationX -= dx * force;
          separationY -= dy * force;
        }
        alignmentX += other.vx;
        alignmentY += other.vy;
        cohesionX += dx;
        cohesionY += dy;
        neighbours++;
      }

      let accelerationX = separationX * 24;
      let accelerationY = separationY * 24;
      if (neighbours) {
        accelerationX += (alignmentX / neighbours - fish.vx) * 0.16 + (cohesionX / neighbours) * 0.025;
        accelerationY += (alignmentY / neighbours - fish.vy) * 0.16 + (cohesionY / neighbours) * 0.025;
      }

      for (const koi of this.koi) {
        const dx = fish.x - koi.nodes[0];
        const dy = fish.y - koi.nodes[1];
        const distance = Math.hypot(dx, dy);
        const radius = koi.length * 0.52;
        if (distance < radius && distance > 1) {
          const force = Math.pow(1 - distance / radius, 2) * 78;
          accelerationX += (dx / distance) * force;
          accelerationY += (dy / distance) * force;
        }
      }

      const margin = 42;
      if (fish.x < margin) accelerationX += 12;
      if (fish.x > this.width - margin) accelerationX -= 12;
      if (fish.y < margin) accelerationY += 12;
      if (fish.y > this.height - margin) accelerationY -= 12;

      fish.vx += accelerationX * dt;
      fish.vy += accelerationY * dt;
      const speed = Math.hypot(fish.vx, fish.vy) || 1;
      const target = clamp(speed, 8, 21);
      fish.vx = (fish.vx / speed) * target;
      fish.vy = (fish.vy / speed) * target;
      fish.x += fish.vx * dt;
      fish.y += fish.vy * dt;
      fish.phase += dt * 4;
    }
  }
}
