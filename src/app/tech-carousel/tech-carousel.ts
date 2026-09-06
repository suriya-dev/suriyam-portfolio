import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Tech {
  name: string;
  sub: string;
  hue: number;
  sat: number;
  lum: number;
  /** SVG path(s) for the icon glyph, drawn on a 0..64 grid */
  glyph: string;
  /** true => the hero card (Angular) gets an extra glow ring */
  featured?: boolean;
  label: string;
}

@Component({
  selector: 'app-tech-carousel',
  standalone: true,
  templateUrl: './tech-carousel.html',
  styleUrls: ['./tech-carousel.scss'],
})
export class TechCarousel implements AfterViewInit {
  techs: Tech[] = [
    { name: 'HTML', sub: 'HTML5', label: 'H5', hue: 23, sat: 92, lum: 50,
      glyph: '<path d="M12 8 L5 56 L32 61 L59 56 L53 22 H24 L25 16 H50 L51 10 H22 Z"/><path d="M32 21 H44 L39 51 L32 53 L27 51 L26 42 H20 L21 52 L32 56 L43 52 L46 31 H25 L25 25 H47 L47 19 H46 L26 19 Z"/>' },
    { name: 'CSS / SCSS', sub: 'CSS3 · SASS', label: 'CS', hue: 207, sat: 90, lum: 49,
      glyph: '<path d="M12 8 L16 56 L32 61 L48 56 L52 8 Z"/><path d="M25 19 H39 L40 25 H25 Z M25 31 H39 L40 40 H26 L27 46 L32 48 L37 46 L38 42 L44 42 L43 51 L32 55 L21 51 L20 44 L25 44 L25 46 L32 48 L38 46 L38 40 L26 40 Z"/>' },
    { name: 'Bootstrap', sub: 'v5', label: 'B', hue: 267, sat: 79, lum: 60,
      glyph: '<circle cx="32" cy="32" r="24"/><text x="32" y="40" font-size="26" font-family="Arial" font-weight="800" fill="#fff" text-anchor="middle">B</text>' },
    { name: 'JavaScript', sub: 'ES6+', label: 'JS', hue: 48, sat: 100, lum: 52,
      glyph: '<rect x="14" y="12" width="36" height="40" rx="4"/><text x="20" y="44" font-size="24" font-family="Arial" font-weight="800" fill="#0d1120" text-anchor="start">JS</text>' },
    { name: 'TypeScript', sub: 'Superset', label: 'TS', hue: 211, sat: 92, lum: 55,
      glyph: '<rect x="14" y="12" width="36" height="40" rx="4"/><text x="22" y="44" font-size="24" font-family="Arial" font-weight="800" fill="#fff" text-anchor="start">TS</text>' },
    { name: 'Angular', sub: 'v14–20', label: 'A', hue: 8, sat: 86, lum: 55, featured: true,
      glyph: '<path d="M32 8 L8 52 L14 48 L32 19 L50 48 L56 52 Z"/><path d="M25 34 L32 44 L39 34 L32 20 Z"/>' },
    { name: 'RxJS', sub: 'Reactive', label: 'X', hue: 317, sat: 82, lum: 60,
      glyph: '<circle cx="32" cy="32" r="24"/><path d="M22 22 L42 42 M42 22 L22 42" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' },
    { name: 'Kendo UI', sub: 'Component Kit', label: 'K', hue: 174, sat: 84, lum: 47,
      glyph: '<circle cx="32" cy="32" r="24"/><path d="M23 45 V26 L41 45 V19" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { name: 'GraphQL', sub: 'API Query', label: 'G', hue: 294, sat: 74, lum: 58,
      glyph: '<path d="M32 10 L52 21 V43 L32 54 L12 43 V21 Z"/><circle cx="32" cy="10" r="5"/><circle cx="52" cy="21" r="5"/><circle cx="52" cy="43" r="5"/><circle cx="32" cy="54" r="5"/><circle cx="12" cy="43" r="5"/><circle cx="12" cy="21" r="5"/>' },
    { name: 'JWT', sub: 'Auth / RBAC', label: 'K', hue: 43, sat: 96, lum: 55,
      glyph: '<circle cx="30" cy="32" r="13"/><circle cx="30" cy="32" r="5"/><path d="M39 32 H52 M46 32 V38 M52 38 H56"/>' },
    { name: 'React', sub: '18 · Hooks', label: 'R', hue: 199, sat: 92, lum: 52,
      glyph: '<circle cx="32" cy="32" r="6"/><ellipse cx="32" cy="32" rx="24" ry="10"/><ellipse cx="32" cy="32" rx="24" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="24" ry="10" transform="rotate(120 32 32)"/>' },
  ];

  @ViewChild('track', { static: false }) trackRef!: ElementRef<HTMLDivElement>;
  private autoTimer: any;
  private isHover = false;
  private sanitizer = inject(DomSanitizer);

  /** safe HTML for glyph — wraps the inner shapes in a full SVG (trusted: we authored every string) */
  glyph(g: string): SafeHtml {
    const svg = `<svg class="glyph" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">${g}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  ngAfterViewInit(): void {
    this.autoScroll();
  }

  autoScroll(): void {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    this.autoTimer = setInterval(() => {
      if (this.isHover) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 3200);
  }

  onMouseOver(): void { this.isHover = true; }
  onMouseOut(): void { this.isHover = false; }

  scroll(dx: number): void {
    this.trackRef?.nativeElement.scrollBy({ left: dx, behavior: 'smooth' });
  }

  hovered = -1;
  onEnter(i: number): void { this.hovered = i; }
  onExit(): void { this.hovered = -1; }
}
