# Immigame: Next.js Website Plan (.cursor/plans/plan.mdc)

@project: Immigame — Gamify the immigration process
@stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Radix Icons
@design: Neobrutalist; thick borders, chunky shadows, rounded-2xl, large type, playful micro-interactions
@palette: #B7E5CD, #8ABEB9, #305669, #C1785A
@a11y: WCAG AA contrast targets; keyboard-first
@storage: LocalStorage (MVP) + URL query sync; (Phase 3+) optional Supabase/Prisma

---

## Vision

Create a playful, phase-based onboarding that asks 3 questions on the landing page and smoothly scrolls the user through them. Choices are visually represented by circular flag/icon buttons with labels underneath. Selections persist and are editable. Neobrutalist styling throughout.

---

## High-Level Phases

1. **Phase 0 – Project Scaffolding & Tooling**
2. **Phase 1 – Landing Page MVP (3 questions + smooth scroll + store choices)**
3. **Phase 2 – Persistence, URL Sync, and A11y/Keyboard Flow**
4. **Phase 3 – Design Polish, Components Library, and Theming Tokens**
5. **Phase 4 – Analytics, SEO, and Deployment**
6. **Phase 5 – Gamification Foundations (progress, levels, rewards)**

---

## Phase 0 — Project Scaffolding & Tooling

@goal: Create a clean Next.js + TS stack with Tailwind and component primitives ready.

### Tasks

- [ ] Bootstrap Next.js App Router project with TypeScript.
- [ ] Install Tailwind CSS; configure base styles.
- [ ] Install shadcn/ui; scaffold Button, Card, Tabs, ScrollArea, Progress components.
- [ ] Add ESLint, Prettier, Husky + lint-staged (pre-commit hooks).
- [ ] Set global CSS tokens for neobrutalist styling (borders, shadows, radii).
- [ ] Create a `lib/ui/theme.ts` exporting palette + semantic tokens.
- [ ] Add favicon + placeholder plane icon (SVG) under `/public/icons/plane.svg`.

### Acceptance Criteria

- Next.js dev server runs; base page renders with Tailwind.
- shadcn/ui components available and themed.
- Type-safe project; lint passes; pre-commit hooks active.

### Commands (reference)

```bash
npx create-next-app@latest immigame --ts --eslint --src-dir --app --import-alias "@/*"
cd immigame
# Tailwind
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card tabs scroll-area progress
```

---

## Phase 1 — Landing Page MVP

@goal: Implement the three-step questionnaire with smooth, automatic scroll on completion of each step; allow scrolling back to edit.

### Questions & Options

1. **Citizenship** (round flag buttons; store selection)
   - India 🇮🇳, Canada 🇨🇦, Mexico 🇲🇽, Spain 🇪🇸, Germany 🇩🇪

2. **Destination** (round flag buttons)
   - USA 🇺🇸, Canada 🇨🇦, UK 🇬🇧

3. **Current Visa Status** (round icon buttons + label)
   - H1B (working person icon), F1 (student icon), B1/B2 (briefcase/plane), None/Other (question mark)

### UX Requirements

- Large “**Immigame**” hero text with a **cute plane icon** (SVG) in neobrutal style.
- Each step shows **circular buttons** with the **text label underneath**.
- After a selection, page **smoothly scrolls** to the next step.
- Provide a visible **“Change”** link/button to jump **back** to previous steps.
- A sticky mini **progress bar/stepper** indicates position (1/3, 2/3, 3/3).

### Components (proposed)

- `components/Brand/Logo.tsx` — Immigame wordmark + plane icon.
- `components/Steps/StepShell.tsx` — wrapper that exposes `onComplete()`, keyboard handlers, and anchors.
- `components/Steps/FlagSelect.tsx` — grid of circular flag buttons with label underneath.
- `components/Steps/VisaSelect.tsx` — grid of circular icon buttons with label underneath.
- `components/ui/CircleOption.tsx` — base circle button (selected, hover, disabled states).
- `components/ui/Stepper.tsx` — progress indicator; clickable steps.

### State Model (MVP)

```ts
// app/(landing)/state.ts
export type Citizenship = "INDIA" | "CANADA" | "MEXICO" | "SPAIN" | "GERMANY";
export type Destination = "USA" | "CANADA" | "UK";
export type Visa = "H1B" | "F1" | "B1B2" | "NONE";
export type OnboardingState = {
  citizenship?: Citizenship;
  destination?: Destination;
  visa?: Visa;
};
```

### Storage Strategy (MVP)

- Write to `localStorage` on each selection under key `immigame.onboarding.v1`.
- Hydrate client state from `localStorage` on mount.
- (Phase 2) Sync to URL query for shareability (e.g., `?c=INDIA&d=USA&v=H1B`).

### Smooth Scroll Behavior

- Each step wrapped in a section with an `id` anchor (`#step-1`, `#step-2`, `#step-3`).
- On select, call `scrollIntoView({ behavior: 'smooth', block: 'start' })` of the next section.
- “Change” control scrolls to the target section.
- Also support keyboard: Enter = confirm, Shift+Tab/Tab navigate focus.

### Styling Tokens (Tailwind)

- Border: `border-4`, radius: `rounded-2xl`, shadow: `shadow-[6px_6px_0_0_rgba(0,0,0,0.9)]` (neobrutal).
- Colors map:
  - `--brand-mint: #B7E5CD;`
  - `--brand-teal: #8ABEB9;`
  - `--brand-navy: #305669;`
  - `--brand-clay: #C1785A;`

- Primary button bg: `--brand-clay`; selected ring: `--brand-navy`; hover: darken by ~8%.
- Body background: `--brand-mint` with contrasting dark text.

### Acceptance Criteria

- Landing page renders hero with plane icon.
- Users can select options per step; selection clearly highlighted with label under button.
- After each selection, viewport auto-scrolls to next step smoothly.
- Users can jump back via stepper or “Change” controls.
- State persists in `localStorage`; refresh keeps choices.

---

## Phase 2 — Persistence, URL Sync, and A11y

@goal: Make state shareable and fully accessible.

### Tasks

- [ ] Bidirectional URL sync: parse query on load; update query on change.
- [ ] Keyboard navigation for grids (arrow keys) with roving tab index.
- [ ] ARIA roles: `role="radiogroup"`, `role="radio"` for single-select groups; labels via `aria-label`.
- [ ] Visible focus outlines; ensure 44x44 hit targets for circles on touch.
- [ ] Add `@/lib/storage.ts` abstraction with schema versioning.

### Acceptance Criteria

- Deep link with `?c=INDIA&d=USA&v=F1` pre-populates UI.
- Full keyboard flow; screen reader announces selections and steps.

---

## Phase 3 — Design Polish & Theming

@goal: Codify neobrutalist system, refine micro-interactions.

### Tasks

- [ ] Define CSS variables for palette in `:root` and Tailwind config.
- [ ] Add playful hover/press animations (scale bump, shadow offset).
- [ ] Plane icon micro-animation on step advance (small arc motion).
- [ ] Extract `CircleOption` to support both flag and vector icon modes.
- [ ] Add `tokens.md` documenting spacing, type scale, radii, shadows.

### Acceptance Criteria

- Consistent neobrutal style across components.
- Animation performant (prefers-reduced-motion respected).

---

## Phase 4 — Analytics, SEO & Deployment

@goal: Measure engagement; ship.

### Tasks

- [ ] Add Next SEO defaults, open graph tags, and social card.
- [ ] Event tracking: `citizenship_selected`, `destination_selected`, `visa_selected`, `step_completed`.
- [ ] Vercel deploy; preview + prod envs.

### Acceptance Criteria

- Production URL live on Vercel with analytics events in dashboard.

---

## Phase 5 — Gamification Foundations (Preview)

@goal: Establish the gameplay loop after onboarding.

### Ideas

- Progress bar that unlocks “tracks” based on the trio of answers.
- XP for completing checklists; badges for milestones; streaks for daily actions.
- Persona-tailored guidance (e.g., India→USA→F1 suggests student visa track).

### Tasks

- [ ] Data model for user progress (client-only for prototype; server later).
- [ ] `/dashboard` route with modular track cards.

---

## File/Folder Structure (Proposed)

```
src/
  app/
    page.tsx                 # Landing
    dashboard/page.tsx       # Phase 5+
  components/
    Brand/Logo.tsx
    Steps/StepShell.tsx
    Steps/FlagSelect.tsx
    Steps/VisaSelect.tsx
    ui/CircleOption.tsx
    ui/Stepper.tsx
  lib/
    ui/theme.ts
    storage.ts
```

---

## Flags & Icons

- Flags: Prefer SVG assets under `/public/flags/*.svg` or a small vetted set from `flag-icons` (tree-shaken).
- Visa icons: simple SVGs under `/public/icons/` (worker, student cap, briefcase/plane, question mark).

---

## Prompts (For Cursor)

@prompt: "Implement Phase 1. Use `components/ui/CircleOption.tsx` for circular options. Ensure label text sits **under** the circle. On selection, persist to localStorage and smooth-scroll to the next section. Add a clickable Stepper to jump backward."

@prompt: "Wire URL <-> state sync (Phase 2). Parse `?c=`, `?d=`, `?v=` on load and update query with `replaceState` to avoid history spam. Maintain a11y roles and keyboard navigation."

---

## Risks & Mitigations

- **Contrast issues** with the palette → add `--brand-navy` as text/outline for readability.
- **Motion sensitivity** → respect `prefers-reduced-motion` and disable animations.
- **Flag licensing/size** → self-host minimal SVG set.

---

## Definition of Done (MVP)

- Landing page hero with plane icon, neobrutalist aesthetics.
- Three-step selection with circular buttons + labels underneath.
- Smooth scroll forward after each choice; clear affordance to go back.
- Choices stored locally and restored on reload.
- Accessible and keyboard-friendly; URL deep links work (Phase 2).
