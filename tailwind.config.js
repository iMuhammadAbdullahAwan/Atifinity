/**
 * Tailwind config for the Atifinity site — ATIFINITY DESIGN SYSTEM v2.
 *
 * Every color below is a Tailwind alias for a CSS custom property defined
 * once in src/css/input.css's `:root` block (see the "BRAND" section
 * there). Nothing here is a literal hex value — this file just gives the
 * tokens Tailwind's utility-class ergonomics (bg-primary, text-accent/40,
 * border-ink-muted, …). To retheme the entire site (new brand color, new
 * background, new type scale), edit the `:root` variables in input.css;
 * you should never need to touch this file for a color/type change.
 *
 * The `rgb(var(--x) / <alpha-value>)` pattern (not a bare `var(--x)`) is
 * what keeps Tailwind's opacity modifiers working — `bg-primary/20`,
 * `border-ink/10`, etc. — while the color itself still lives in one place.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/js/**/*.js'],
  // .btn-red isn't applied to any element yet (no page markup references it),
  // so Tailwind's content scan would otherwise tree-shake the @layer
  // components rule that defines it — safelist it so the class is ready to
  // use as soon as it's added to markup.
  safelist: ['btn-red'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // Ground
        base: 'rgb(var(--color-bg) / <alpha-value>)',
        panel: 'rgb(var(--color-surface) / <alpha-value>)',
        'panel-high': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        // Text
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        // Brand — exactly two hues, each with one job. See input.css for
        // the full role documentation.
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-bright': 'rgb(var(--color-primary-bright) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-deep': 'rgb(var(--color-accent-deep) / <alpha-value>)',
      },
      fontFamily: {
        // Wide, confident, broadcast-title energy for anything meant to
        // dominate a composition (hero line, section statements).
        display: ['"Archivo Expanded"', 'Arial Narrow', 'sans-serif'],
        // The same type family at normal width for everything that needs
        // to stay quiet and readable — body copy, UI, nav, buttons.
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Reserved for labels, eyebrows, and live data (Growth Simulator
        // output, package meta) — a small "instrument panel" texture.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Hero-scale statement. Fluid so it never needs a breakpoint stack
        // of one-off sizes in the markup.
        display: ['clamp(2.75rem, 2rem + 3.2vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.25rem, 1.8rem + 2vw, 3.25rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.75rem, 1.5rem + 1.1vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        h3: ['1.25rem', { lineHeight: '1.3' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.55' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        button: ['0.875rem', { lineHeight: '1', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '22px',
      },
      boxShadow: {
        // Neutral only — no colored "glow" shadows. Elevation is used on
        // exactly one surface at a time (the featured package card), never
        // as a decorative default on buttons/icons.
        sm: '0 1px 2px rgba(0,0,0,0.35)',
        md: '0 24px 48px -20px rgba(0,0,0,0.55)',
      },
      maxWidth: {
        // The one content-width ceiling every section shares — see
        // .container-x in input.css.
        container: '1280px',
      },
      spacing: {
        // Fluid section rhythm (replaces the old py-16/20/28 breakpoint
        // stack with one value that scales continuously) — see .section.
        section: 'clamp(4rem, 3.2rem + 3.5vw, 7.5rem)',
      },
      backgroundImage: {
        // The ONE gradient in the system, reserved for the Atifinity mark
        // and the rare flagship moment (hero/closing headline word) — never
        // a default surface, button, or badge treatment.
        'brand-gradient': 'linear-gradient(90deg, rgb(var(--color-primary-bright)) 0%, rgb(var(--color-accent)) 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};
