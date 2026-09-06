import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

/**
 * network-animation
 * -----------------
 * A canvas rendering of a "Micro-Frontend Architecture" —
 * floating nodes (polygons) that slowly drift & morph, connected by lines,
 * and glow as the pointer moves near them. Fully self-contained.
 */
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  sides: number;   // polygon sides (3..6) -> variety
  rotation: number;
  rotSpeed: number;
  baseHue: number; // 0..1 mapped toward cyan<->purple
  pulse: number;
  pulseSpeed: number;
}

@Component({
  selector: 'app-network-animation',
  standalone: true,
  template: `<canvas #canvas class="net-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: auto;
    }
    .net-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 1;
    }
  `]
})
export class NetworkAnimation implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private raf = 0;
  private w = 0;
  private h = 0;
  private mouse = { x: -9999, y: -9999 };
  private dpr = 1;
  private running = true;

  ngAfterViewInit(): void {
    this.init();
    this.start();
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    canvas.width = this.w * this.dpr;
    canvas.height = this.h * this.dpr;
    canvas.style.width = `${this.w}px`;
    canvas.style.height = `${this.h}px`;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(this.dpr, this.dpr);
    this.seed();
  }

  private seed(): void {
    const count = Math.max(16, Math.min(34, Math.floor((this.w * this.h) / 14000)));
    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 3 + Math.random() * 7,
      sides: 3 + Math.floor(Math.random() * 4),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      baseHue: Math.random(),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.init();
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.parentElement!.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (inside) {
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    } else {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    }
  }

  private start(): void {
    const loop = () => {
      if (!this.running) return;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private draw(): void {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    // Move nodes
    for (const n of this.nodes) {
      n.x += n.vx; n.y += n.vy;
      n.rotation += n.rotSpeed;
      n.pulse += n.pulseSpeed;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
    }

    const LINK = 150;

    // Connection lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK) {
          const alpha = (1 - dist / LINK) * 0.5;
          const hueA = 190 + a.baseHue * 90;   // 190..280 cyan->purple
          const hueB = 190 + b.baseHue * 90;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `hsla(${hueA}, 90%, 60%, ${alpha})`);
          grad.addColorStop(1, `hsla(${hueB}, 90%, 60%, ${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Mouse-proximity glow (higher on nearby nodes)
    let nearest = -1, nearestD = Infinity;
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
      if (d < nearestD) { nearestD = d; nearest = i; }
    }

    // Draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const mouseDist = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
      const near = Math.max(0, 1 - mouseDist / 260);           // 0..1 from pointer
      const pulse = (Math.sin(n.pulse) + 1) / 2;
      const glow = n.baseHue * 90 + 190;
      const radius = n.size * (1 + pulse * 0.25 + near * 0.9);
      const isNearest = i === nearest && nearestD < 260;

      // soft outer glow
      const hue = glow;
      const glowSize = radius * (isNearest ? 8 : 4.5);
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowSize);
      const gAlpha = (isNearest ? 0.55 : 0.28) + near * 0.25;
      g.addColorStop(0, `hsla(${hue}, 95%, 62%, ${gAlpha})`);
      g.addColorStop(1, `hsla(${hue}, 95%, 62%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // solid core (morphing polygon)
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rotation);
      const coreAlpha = 0.85 + near * 0.15;
      ctx.fillStyle = `hsla(${hue}, 92%, 64%, ${coreAlpha})`;
      this.poly(ctx, radius, n.sides);
      ctx.fill();
      ctx.restore();
    }
  }

  /** Draw an N-sided regular polygon path centered at current origin. */
  private poly(ctx: CanvasRenderingContext2D, r: number, sides: number): void {
    ctx.beginPath();
    for (let k = 0; k < sides; k++) {
      const a = (k / sides) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
}
