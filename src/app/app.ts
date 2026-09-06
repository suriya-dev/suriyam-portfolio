import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NetworkAnimation } from './network-animation/network-animation';
import { TechCarousel } from './tech-carousel/tech-carousel';
import { FA, FaIcon, faSvg } from './icons';

interface NavItem {
  id: string;
  label: string;
  icon: FaIcon;
}

interface Project {
  icon: FaIcon;
  tag: string;
  title: string;
  desc: string;
  stack: string;
}

interface RndItem {
  icon: string;
  title: string;
  desc: string;
  status: 'imp' | 'rnd';
  statusLabel: string;
  chips: string[];
}

const THEME_KEY = 'suriya-theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NetworkAnimation, TechCarousel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();

  navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: FA.home },
    { id: 'skills', label: 'Skills', icon: FA.code },
    { id: 'projects', label: 'Projects', icon: FA.folder },
    { id: 'rnd', label: 'R&D', icon: FA.flask },
    { id: 'contact', label: 'Contact', icon: FA.envelope },
  ];

  projects: Project[] = [
    {
      icon: FA.mobileScreen,
      tag: 'CBDC · HDFC BANK · INDIA',
      title: 'Central Bank Digital Currency Platform',
      desc: 'Frontend owner for one of India\u2019s pioneering digital-currency platforms \u2014 digital wallet management, currency issuance flows, inter-bank transfer dashboards and regulatory reporting UIs.',
      stack: 'Angular 20 \u00b7 NgRx \u00b7 Native Federation \u00b7 RxJS \u00b7 Signals \u00b7 GraphQL \u00b7 JWT \u00b7 FusionCharts',
    },
    {
      icon: FA.buildingColumns,
      tag: 'GIB \u00b7 GULF INTERNATIONAL BANK',
      title: 'Micro-Frontend Architecture Platform',
      desc: 'Architected a micro-frontend platform using Native Federation with independently deployable, zero-coupling modules \u2014 cutting time-to-release per module by ~40% for the GIB platform.',
      stack: 'Angular 20 \u00b7 Native Federation \u00b7 Signal-based State \u00b7 TypeScript \u00b7 Vite/esbuild',
    },
    {
      icon: FA.rightToBracket,
      tag: 'FAB \u00b7 FIRST ABU DHABI BANK',
      title: 'Cards & Payments Banking Suite',
      desc: 'Built the Cards module \u2014 issuance, blocking/unblocking, spend-limit management and virtual-card generation with real-time API sync \u2014 alongside Payments, Account Services and dashboards.',
      stack: 'Angular 17\u201320 \u00b7 Kendo UI \u00b7 RxJS \u00b7 NgRx \u00b7 JWT \u00b7 REST & GraphQL \u00b7 Native Federation',
    },
    {
      icon: FA.chartColumn,
      tag: 'BANK ABC \u00b7 ARAB BANKING CORP.',
      title: 'Analytics & Account Services',
      desc: 'Delivered interactive analytics dashboards with FusionCharts and Kendo UI \u2014 account balances, transaction trends and card-spend summaries \u2014 with cross-browser compatibility and 10k+ record virtual scrolling.',
      stack: 'Angular 20 \u00b7 FusionCharts \u00b7 Kendo UI \u00b7 RxJS \u00b7 REST & GraphQL \u00b7 pdfmake (RTL) \u00b7 esbuild',
    },
  ];

  rndItems: RndItem[] = [
    {
      icon: '📜', title: 'Virtual Scroll (10k+ rows)',
      desc: 'Row-virtualisation with Kendo UI + RxJS stream optimisation — renders only the visible window so 10,000+ account and txn records scroll with sub-second paint and zero jank.',
      status: 'imp', statusLabel: 'Implemented', chips: ['RxJS', 'Kendo UI', 'CDK Virtual Scroll', 'OnPush'],
    },
    {
      icon: '⚡', title: 'OnPush Change Detection',
      desc: 'Strategically gated the component tree with ChangeDetectionStrategy.OnPush + Signals and zoneless mode to cut change-detection passes and measurable re-renders under live data.',
      status: 'imp', statusLabel: 'Implemented', chips: ['OnPush', 'Signals', 'Zoneless', 'Angular 20'],
    },
    {
      icon: '🧩', title: 'Micro-Frontend POC',
      desc: 'Native Federation proof-of-concept where independently deployable Angular modules lazily load into a shared shell — cutting per-module release time by ~40% for the GIB platform.',
      status: 'imp', statusLabel: 'Implemented', chips: ['Native Federation', 'Module Federation', 'Shell', 'Lazy Loading'],
    },
    {
      icon: '🛡️', title: 'Signal-based State Migration',
      desc: 'Refactored a feature area from NgRx to Angular Signals + computed() for simpler, more reactive state while reducing boilerplate and re-renders.',
      status: 'imp', statusLabel: 'Implemented', chips: ['Signals', 'computed()', 'RxJS', 'NgRx'],
    },
    {
      icon: '⚛️', title: 'React × Angular Interop',
      desc: 'R&D spike loading a React micro-app (Hooks) as a federated remote inside an Angular shell via a wrapper — evaluating mixed-framework micro-frontend teams.',
      status: 'rnd', statusLabel: 'R&D', chips: ['React', 'Hooks', 'Federation', 'Bridge'],
    },
    {
      icon: '🌍', title: 'RTL Arabic PDF Reports',
      desc: 'Custom font embedding into pdfmake to deliver correct right-to-left rendering for Middle East banking statements and reports.',
      status: 'imp', statusLabel: 'Implemented', chips: ['pdfmake', 'Font Embedding', 'RTL', 'i18n'],
    },
  ];

  /* theme (dark default) */
  isDark = true;
  /* menu show/hide */
  menuOpen = true;
  /* active section for scroll-spy */
  active = 'home';

  private sanitizer = inject(DomSanitizer);

  constructor() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefers = window.matchMedia('(prefers-color-scheme: light)').matches;
    this.isDark = saved ? saved === 'dark' : !prefers;
    this.applyTheme();
    // start the menu closed on small screens so it doesn't cover the hero
    this.menuOpen = window.innerWidth >= 900;
  }

  applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, this.isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.applyTheme();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  faIcon(icon: FaIcon): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(faSvg(icon, 16));
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.active = id;
    this.menuOpen = false; // auto-close the menu after navigating
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const ids = this.navItems.map(n => n.id);
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    }
    this.active = current;
  }

  mailto(): void {
    window.location.href = 'mailto:suriyamano123@outlook.com?subject=Opportunity%20for%20Senior%20Frontend%20Engineer';
  }
}
