import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  problem: string;
  role: string;
  impact: string[];
  stack: string;
  github: string;
  live?: string;
}

interface RndItem {
  icon: string;
  title: string;
  desc: string;
  status: 'imp' | 'rnd';
  statusLabel: string;
  chips: string[];
}

interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  initials: string;
}

const THEME_KEY = 'suriya-theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NetworkAnimation, TechCarousel, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();

  readonly resumeUrl = 'Suriya_M_Resume.pdf';
  readonly liveUrl = 'https://suriyam-portfolio.vercel.app/';
  readonly FA = FA;

  navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: FA.home },
    { id: 'about', label: 'About', icon: FA.user },
    { id: 'skills', label: 'Skills', icon: FA.code },
    { id: 'projects', label: 'Projects', icon: FA.folder },
    { id: 'experience', label: 'Experience', icon: FA.briefcase },
    { id: 'rnd', label: 'R&D', icon: FA.flask },
    { id: 'contact', label: 'Contact', icon: FA.envelope },
  ];

  about = {
    name: 'Suriya M',
    role: 'Senior Frontend Engineer',
    location: 'Chennai, India',
    experience: '4+ years',
    bio: [
      "I'm a frontend engineer who has spent 4+ years building high-stakes Angular applications for banks in India and the Middle East. Today I'm the frontend owner for HDFC Bank's CBDC (Central Bank Digital Currency) platform — a pioneering national digital-currency project — where I lead a team of three engineers across micro-frontend architecture, state management and performance.",
      "I'm comfortable owning a product area end to end: from design discussions through to release. That means translating product requirements into a scalable frontend architecture, mentoring juniors, and driving the quality bar with code reviews and shared component libraries across multiple banking clients.",
      "If it touches Angular, TypeScript, micro-frontends, or performance under load — I'm in my element.",
    ],
    highlights: [
      { k: '4+', v: 'Years Experience' },
      { k: '3', v: 'Engineers Led' },
      { k: '4+', v: 'Banks Served' },
      { k: '40%', v: 'Faster Releases' },
      { k: '10k+', v: 'Rows Virtualized' },
    ],
  };

  projects: Project[] = [
    {
      icon: FA.mobileScreen,
      tag: 'CBDC · HDFC BANK · INDIA',
      title: 'Central Bank Digital Currency Platform',
      problem: 'India needed a national digital-currency product where wallets, issuance flows, inter-bank transfers and regulatory reporting had to be real-time, secure and zero-coupling across teams.',
      role: 'Frontend owner & architect — led a team of 3 engineers.',
      impact: [
        'Real-time dashboards with sub-second circulation metrics & ledger visibility',
        'Zero-coupling micro-frontend modules via Native Federation',
        'JWT + RBAC security across wallet, ledger & currency-flow data',
      ],
      stack: 'Angular 20 · NgRx · Native Federation · RxJS · Signals · GraphQL · JWT · FusionCharts',
      github: 'https://github.com/suriya-dev',
    },
    {
      icon: FA.buildingColumns,
      tag: 'GIB · GULF INTERNATIONAL BANK',
      title: 'Micro-Frontend Architecture Platform',
      problem: 'A single monolith slowed release cycles and tightly coupled product teams — shipping one module meant redeploying everything.',
      role: 'Architect — designed the federation strategy and module boundaries.',
      impact: [
        '~40% reduction in time-to-release per module',
        'Independently deployable, zero-coupling modules',
        'Final build migrated to Angular Vite / esbuild builder',
      ],
      stack: 'Angular 20 · Native Federation · Signal-based State · TypeScript · Vite/esbuild',
      github: 'https://github.com/suriya-dev',
    },
    {
      icon: FA.rightToBracket,
      tag: 'FAB · FIRST ABU DHABI BANK',
      title: 'Cards & Payments Banking Suite',
      problem: 'Card operations (issuance, blocking, spend limits, virtual cards) needed a fast, reliable frontend that syncs with banking APIs in real time.',
      role: 'Frontend owner — Cards, Payments, Account Services & dashboard modules.',
      impact: [
        'Real-time API sync for card issuance & virtual card generation',
        'Virtual scrolling for 10,000+ transaction records',
        'Cross-browser & cross-device compatibility in production',
      ],
      stack: 'Angular 17–20 · Kendo UI · RxJS · NgRx · JWT · REST & GraphQL · Native Federation',
      github: 'https://github.com/suriya-dev',
    },
    {
      icon: FA.chartColumn,
      tag: 'BANK ABC · ARAB BANKING CORP.',
      title: 'Analytics & Account Services',
      problem: 'Middle East banking clients needed Arabic/RTL PDF statements and interactive analytics with drill-down over large datasets.',
      role: 'Frontend engineer — analytics, dashboards, and RTL report generation.',
      impact: [
        'pdfmake custom font embedding for correct Arabic RTL rendering',
        'Interactive dashboards with date-range & drill-down filtering',
        'Sub-second rendering on 10k+ rows via RxJS stream optimisation',
      ],
      stack: 'Angular 20 · FusionCharts · Kendo UI · RxJS · REST & GraphQL · pdfmake (RTL) · esbuild',
      github: 'https://github.com/suriya-dev',
    },
  ];

  experience: Experience[] = [
    {
      role: 'Senior Software Developer',
      company: 'Mindgate Solutions',
      period: 'Jul 2022 – Present',
      location: 'Chennai, India',
      summary: 'Frontend owner for the CBDC project at HDFC Bank, leading a team of 3 engineers across micro-frontend architecture, state management and application performance.',
      bullets: [
        'Architected a Micro-Frontend platform for GIB using Native Federation, cutting time-to-release per module by ~40%.',
        'Built & maintained enterprise Angular 20 apps with Kendo UI for FAB, GIB, Bank ABC and Ajman Bank.',
        'Engineered high-performance data grids with RxJS + Kendo UI virtual scrolling for 10,000+ records.',
        'Implemented client-side PDF reports with pdfmake + custom font embedding for Arabic (correct RTL rendering).',
        'Adopted Angular Signals & standalone components; improved performance ~25% via lazy loading + OnPush CD.',
        'Migrated builds to the Angular Vite / esbuild builder, cutting build times and improving hot-reload speed.',
        'Ran code reviews for a 3-member team and mentored juniors, cutting ramp-up time by ~30%.',
        'Drove a reusable shared component library across banking projects, cutting duplicate effort and improving UI consistency.',
      ],
    },
  ];

  testimonials: Testimonial[] = [
    {
      quote: 'Suriya leads our CBDC frontend with real ownership. He turns a complex digital-currency roadmap into an architecture the whole team can build on — reliable, fast, and well documented.',
      name: 'Engineering Partner',
      title: 'Banking Product Team',
      initials: 'BP',
    },
    {
      quote: 'The micro-frontend platform he architected cut our release time dramatically. Modules ship independently now and the quality bar across our banking clients is consistently high.',
      name: 'Delivery Lead',
      title: 'Fintech Delivery',
      initials: 'DL',
    },
    {
      quote: 'He mentors juniors generously and holds the line on standards in code review. Ramp-up on new team members is noticeably faster under his guidance.',
      name: 'Team Member',
      title: 'Senior Frontend Engineer',
      initials: 'TM',
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

  faIconSize(icon: FaIcon, size: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(faSvg(icon, size));
  }

  faIcon(icon: FaIcon): SafeHtml {
    return this.faIconSize(icon, 16);
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

  /* contact form */
  form = { name: '', email: '', message: '' };
  formSent = false;

  submitContact(event?: Event): void {
    event?.preventDefault();
    const { name, email, message } = this.form;
    const subject = encodeURIComponent(`Portfolio contact from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:suriyamano123@outlook.com?subject=${subject}&body=${body}`;
    this.formSent = true;
    this.form = { name: '', email: '', message: '' };
  }
}
