import { clamp, hash3, smoothstep } from "./math";
import { KOI_NODES, type Koi, type KoiWorld } from "./world";

const SUBSAMPLES = [0.24, 0.28, 0.76, 0.28, 0.24, 0.74, 0.76, 0.74];
const SKIN_GLYPHS = ["·", ":", ";", "+", "*", "#", "%", "@"];
const EDGE_GLYPHS = ["·", ".", "'", ":"];
const FIN_GLYPHS = ["~", ":", ";", "+"];

const FLAG_BODY = 1;
const FLAG_EDGE = 2;
const FLAG_FIN = 3;
const FLAG_EYE = 4;

const COLOR_WHITE = 0;
const COLOR_RED = 1;
const COLOR_BLACK = 2;

function inTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNegative && hasPositive);
}

/** Top-down koi silhouette: blunt head, full shoulders, slim peduncle and soft fan tail. */
function koiHalfWidth(s: number) {
  if (s < 0.09) return 0.105 + 0.027 * smoothstep(0, 0.09, s);
  if (s < 0.24) return 0.132 + 0.02 * smoothstep(0.09, 0.24, s);
  if (s < 0.56) return 0.152 - 0.034 * smoothstep(0.24, 0.56, s);
  if (s < 0.82) return 0.118 - 0.092 * smoothstep(0.56, 0.82, s);
  if (s < 0.88) return 0.026;
  const fan = Math.sin(((s - 0.88) / 0.12) * Math.PI);
  return 0.022 + fan * 0.112;
}

export class KoiRenderer {
  private context: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private cellWidth = 10;
  private cellHeight = 15;
  private columns = 0;
  private rows = 0;
  private flag = new Uint8Array(0);
  private shade = new Float32Array(0);
  private color = new Uint8Array(0);
  private key = new Uint32Array(0);
  private depth = new Float32Array(0);
  private spine = new Float32Array(KOI_NODES * 2);
  private arc = new Float32Array(KOI_NODES);
  private arcTotal = 1;
  private currentKoi!: Koi;
  private finLeft = 0;
  private finRight = 0;
  private hitFlag = 0;
  private hitShade = 0;
  private hitColor = 0;
  private hitS = 0;
  private hitV = 0;
  private hitDistance = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas 2D is unavailable");
    this.context = context;
  }

  resize(width: number, height: number, dpr: number) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.cellWidth = clamp(Math.round(width / 132), 7, 11);
    this.cellHeight = Math.round(this.cellWidth * 1.42);
    this.columns = Math.ceil(width / this.cellWidth);
    this.rows = Math.ceil(height / this.cellHeight);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    const total = this.columns * this.rows;
    this.flag = new Uint8Array(total);
    this.shade = new Float32Array(total);
    this.color = new Uint8Array(total);
    this.key = new Uint32Array(total);
    this.depth = new Float32Array(total);
  }

  render(world: KoiWorld) {
    if (!this.columns) return;
    this.rasterize(world.koi);
    const context = this.context;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.drawWater(world.time, world.scroll);
    this.drawMinnows(world);
    this.drawKoi(world.time);
  }

  private drawWater(time: number, scroll: number) {
    const context = this.context;
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    const yShift = (scroll * 0.018) % ch;

    context.lineWidth = 1;
    context.strokeStyle = "rgba(255,218,211,0.024)";
    context.beginPath();
    for (let column = 0; column <= this.columns; column += 2) {
      const x = Math.round(column * cw) + 0.5;
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    for (let row = -1; row <= this.rows; row += 2) {
      const y = Math.round(row * ch + yShift) + 0.5;
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }
    context.stroke();

    context.fillStyle = "rgba(226,104,90,0.12)";
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (hash3(column, row, 43) > 0.032) continue;
        const pulse = 0.45 + 0.55 * Math.sin(time * 0.4 + hash3(column, row, 12) * 8);
        context.globalAlpha = 0.25 + pulse * 0.3;
        context.fillRect(column * cw + cw * 0.68, row * ch + ch * 0.64 + yShift, 1, 1);
      }
    }
    context.globalAlpha = 1;
  }

  private drawMinnows(world: KoiWorld) {
    const context = this.context;
    context.font = `500 ${Math.round(this.cellHeight * 0.58)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (const fish of world.minnows) {
      const angle = Math.atan2(fish.vy, fish.vx);
      const glyph = Math.abs(Math.sin(angle)) > 0.72 ? "|" : Math.sin(angle) > 0.25 ? "/" : Math.sin(angle) < -0.25 ? "\\" : "—";
      context.fillStyle = `rgba(218,184,178,${(0.06 + fish.depth * 0.13).toFixed(3)})`;
      context.fillText(glyph, fish.x, fish.y);
    }
  }

  private rasterize(koi: Koi[]) {
    this.flag.fill(0);
    this.depth.fill(0);
    for (const fish of koi) {
      this.currentKoi = fish;
      const length = fish.length;
      const nodes = fish.nodes;
      const swim = clamp(fish.speed / 42, 0.55, 1.2);

      // A travelling wave grows towards the tail. The simulation spine remains stable;
      // this render spine adds muscle and fin motion without destabilising steering.
      for (let node = 0; node < KOI_NODES; node++) {
        const s = node / (KOI_NODES - 1);
        const previous = Math.max(0, node - 1);
        const next = Math.min(KOI_NODES - 1, node + 1);
        let tangentX = nodes[previous * 2] - nodes[next * 2];
        let tangentY = nodes[previous * 2 + 1] - nodes[next * 2 + 1];
        const tangentLength = Math.hypot(tangentX, tangentY) || 1;
        tangentX /= tangentLength;
        tangentY /= tangentLength;
        const amplitude = length * 0.052 * Math.pow(s, 1.75) * swim;
        const offset = amplitude * Math.sin(fish.phase - s * 5.7);
        this.spine[node * 2] = nodes[node * 2] - tangentY * offset;
        this.spine[node * 2 + 1] = nodes[node * 2 + 1] + tangentX * offset;
      }

      this.arc[0] = 0;
      for (let node = 1; node < KOI_NODES; node++) {
        this.arc[node] =
          this.arc[node - 1] +
          Math.hypot(
            this.spine[node * 2] - this.spine[(node - 1) * 2],
            this.spine[node * 2 + 1] - this.spine[(node - 1) * 2 + 1],
          );
      }
      this.arcTotal = this.arc[KOI_NODES - 1] || 1;

      const bank = clamp(fish.turn * 0.45, -0.22, 0.22);
      const finBeat = 1 + Math.sin(fish.phase * 0.62 + fish.id) * 0.12;
      this.finLeft = length * 0.19 * finBeat * (1 + bank);
      this.finRight = length * 0.19 * finBeat * (1 - bank);

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let node = 0; node < KOI_NODES; node++) {
        minX = Math.min(minX, this.spine[node * 2]);
        minY = Math.min(minY, this.spine[node * 2 + 1]);
        maxX = Math.max(maxX, this.spine[node * 2]);
        maxY = Math.max(maxY, this.spine[node * 2 + 1]);
      }
      const reach = length * 0.19;
      const columnStart = Math.max(0, Math.floor((minX - reach) / this.cellWidth));
      const columnEnd = Math.min(this.columns - 1, Math.ceil((maxX + reach) / this.cellWidth));
      const rowStart = Math.max(0, Math.floor((minY - reach) / this.cellHeight));
      const rowEnd = Math.min(this.rows - 1, Math.ceil((maxY + reach) / this.cellHeight));

      for (let row = rowStart; row <= rowEnd; row++) {
        for (let column = columnStart; column <= columnEnd; column++) {
          const x = column * this.cellWidth;
          const y = row * this.cellHeight;
          const centerHit = this.sampleKoi(x + this.cellWidth / 2, y + this.cellHeight / 2, length);
          if (!centerHit && this.hitDistance > reach + this.cellHeight) continue;
          const centerFlag = this.hitFlag;
          const centerShade = this.hitShade;
          const centerColor = this.hitColor;
          const centerS = this.hitS;
          const centerV = this.hitV;
          let hits = centerHit ? 1 : 0;
          for (let sample = 0; sample < SUBSAMPLES.length; sample += 2) {
            if (
              this.sampleKoi(
                x + SUBSAMPLES[sample] * this.cellWidth,
                y + SUBSAMPLES[sample + 1] * this.cellHeight,
                length,
              )
            ) hits++;
          }
          if (!hits) continue;

          const index = row * this.columns + column;
          if (this.depth[index] > fish.depth) continue;
          const coverage = hits / 5;
          this.depth[index] = fish.depth;
          this.key[index] = (hash3(Math.round(centerS * 79), Math.round(centerV / this.cellWidth), fish.id) * 4294967295) >>> 0;
          if (centerHit && coverage >= 0.6) {
            this.flag[index] = centerFlag;
            this.shade[index] = centerShade;
            this.color[index] = centerColor;
          } else {
            this.flag[index] = FLAG_EDGE;
            this.shade[index] = coverage;
            this.color[index] = centerColor;
          }
        }
      }
    }
  }

  private sampleKoi(px: number, py: number, length: number) {
    let bestDistance = Infinity;
    let bestS = 0;
    let bestSignedDistance = 0;
    let lightNormalX = 0;
    let lightNormalY = 0;

    for (let node = 0; node < KOI_NODES - 1; node++) {
      const ax = this.spine[node * 2];
      const ay = this.spine[node * 2 + 1];
      const segmentX = this.spine[(node + 1) * 2] - ax;
      const segmentY = this.spine[(node + 1) * 2 + 1] - ay;
      const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY || 1;
      const position = clamp(((px - ax) * segmentX + (py - ay) * segmentY) / segmentLengthSquared, 0, 1);
      const closestX = ax + segmentX * position;
      const closestY = ay + segmentY * position;
      const dx = px - closestX;
      const dy = py - closestY;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared >= bestDistance) continue;
      bestDistance = distanceSquared;
      const segmentLength = Math.sqrt(segmentLengthSquared);
      bestS = (this.arc[node] + position * segmentLength) / this.arcTotal;
      const sign = segmentX * (py - ay) - segmentY * (px - ax) >= 0 ? 1 : -1;
      bestSignedDistance = Math.sqrt(distanceSquared) * sign;
      lightNormalX = (-segmentY / segmentLength) * sign;
      lightNormalY = (segmentX / segmentLength) * sign;
    }

    const s = bestS;
    const distance = Math.sqrt(bestDistance);
    const width = koiHalfWidth(s) * length;
    const across = distance / (width || 1);
    this.hitDistance = distance;
    this.hitS = s;
    this.hitV = bestSignedDistance;
    this.hitColor = this.patternColor(s, bestSignedDistance / (width || 1));

    if (distance <= width) {
      const lighting = (lightNormalX * -0.55 + lightNormalY * -0.83) * across;
      this.hitShade = clamp(0.72 - across * across * 0.42 + lighting * 0.2, 0.15, 1);
      this.hitFlag = FLAG_BODY;
      if (s > 0.055 && s < 0.13 && across > 0.58) {
        this.hitFlag = FLAG_EYE;
        this.hitColor = COLOR_BLACK;
        this.hitShade = 0.1;
      }
      return true;
    }

    // Rounded pectoral fins flex independently as the fish banks and breathes.
    const longitudinal = s * length;
    const lateral = Math.abs(bestSignedDistance);
    const finReach = bestSignedDistance > 0 ? this.finRight : this.finLeft;
    if (inTriangle(longitudinal, lateral, length * 0.2, 0, length * 0.44, 0, length * 0.35, finReach)) {
      this.hitFlag = FLAG_FIN;
      this.hitColor = this.patternColor(clamp(s - 0.04, 0, 1), bestSignedDistance / finReach);
      this.hitShade = 0.4 + 0.25 * (1 - lateral / finReach);
      return true;
    }
    return false;
  }

  private patternColor(s: number, across: number) {
    if (s > 0.86) return COLOR_WHITE;
    const id = this.currentKoi.id;
    const redField =
      Math.sin(s * 17.4 + id * 1.7) * 0.75 +
      Math.cos(s * 8.2 - across * 2.8 + id) * 0.55 +
      Math.sin(s * 31 + across * 3.2) * 0.22;
    if (s > 0.06 && s < 0.79 && redField > 0.47) return COLOR_RED;
    if (this.currentKoi.pattern === "sanke" && s > 0.14 && s < 0.75) {
      const blackField = Math.sin(s * 27 - id * 1.4) + Math.cos(across * 5.1 + s * 7.7);
      if (blackField > 1.52) return COLOR_BLACK;
    }
    return COLOR_WHITE;
  }

  private drawKoi(time: number) {
    const context = this.context;
    const cw = this.cellWidth;
    const ch = this.cellHeight;
    context.font = `700 ${Math.round(ch * 0.72)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let index = 0; index < this.flag.length; index++) {
      const flag = this.flag[index];
      if (!flag) continue;
      const column = index % this.columns;
      const row = (index / this.columns) | 0;
      const x = column * cw;
      const y = row * ch;
      const depth = 0.48 + this.depth[index] * 0.52;
      const shade = this.shade[index];
      const key = this.key[index];
      const color = this.color[index];

      if (flag === FLAG_EDGE) {
        const glyph = EDGE_GLYPHS[(key >>> 8) % EDGE_GLYPHS.length];
        const alpha = (0.26 + shade * 0.5) * depth;
        context.fillStyle = color === COLOR_RED ? `rgba(215,76,58,${alpha})` : `rgba(225,230,222,${alpha})`;
        context.fillText(glyph, x + cw / 2, y + ch / 2 + 1);
        continue;
      }

      if (flag === FLAG_EYE) {
        context.fillStyle = `rgba(12,14,14,${0.9 * depth})`;
        context.fillRect(x + 1, y + 1, cw - 1, ch - 1);
        context.fillStyle = "rgba(232,255,205,0.9)";
        context.fillText("·", x + cw / 2, y + ch / 2);
        continue;
      }

      let background: string;
      let foreground: string;
      if (color === COLOR_RED) {
        background = `rgba(${Math.round(136 + shade * 75)},${Math.round(34 + shade * 37)},${Math.round(30 + shade * 26)},${0.72 * depth})`;
        foreground = shade > 0.62 ? "rgba(40,13,12,0.82)" : "rgba(245,219,205,0.86)";
      } else if (color === COLOR_BLACK) {
        background = `rgba(22,25,24,${0.9 * depth})`;
        foreground = "rgba(210,219,211,0.74)";
      } else {
        const level = Math.round(126 + shade * 100);
        background = `rgba(${level},${Math.min(236, level + 5)},${Math.max(118, level - 2)},${0.66 * depth})`;
        foreground = shade > 0.58 ? "rgba(26,29,27,0.86)" : "rgba(239,243,235,0.88)";
      }

      context.fillStyle = background;
      context.fillRect(x + 1, y + 1, cw - 1, ch - 1);
      const shimmer = hash3(key, Math.floor(time * 2.1), 17);
      if (shimmer > 0.988) foreground = "#ff493d";
      context.fillStyle = foreground;
      const glyphs = flag === FLAG_FIN ? FIN_GLYPHS : SKIN_GLYPHS;
      const glyphIndex = clamp(Math.floor((1 - shade) * glyphs.length), 0, glyphs.length - 1);
      context.fillText(glyphs[(glyphIndex + (key % 2)) % glyphs.length], x + cw / 2, y + ch / 2 + 1);
    }
  }
}
