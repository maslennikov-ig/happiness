# DeepThink Results: Technical Architecture

This architecture prioritizes **orchestration** and **perceived performance**. To achieve the "premium feel," we must separate concerns: use GSAP as the "Director" of the timeline and scroll, and Framer Motion as the "Actor" handling UI states.

## 1. Animation Architecture (GSAP vs Framer Motion)

### Recommended Division: "The Director & The Actor"

Do not try to make one library do everything. Use a hybrid approach where roles are strictly defined to avoid bundle bloat and conflicts.

* **GSAP (The Director):** Handles **Macro-Animations**.
    * *Role:* Scroll position control, pinning, complex sequenced timelines, and SVG manipulation.
    * *Why:* `ScrollTrigger` is the industry standard for pinning and scrubbing. Framer Motion's `useScroll` lacks the robustness needed for complex roadmap/parallax pinning.
* **Framer Motion (The Actor):** Handles **Micro-Interactions**.
    * *Role:* Component mounting/unmounting (`AnimatePresence`), hover states, toggles, and shared layout transitions.
    * *Why:* It is declarative. Handling a "hover" state in GSAP requires manual event listeners and cleanup; in Framer, it's just `whileHover`.

### Code Organization

Prevent "prop drilling" animation references. Colocate animation logic with the components it controls.

```text
src/
├── components/
│   ├── ui/                 # Reusable Atoms (Framer Motion)
│   │   └── Toggle.tsx      # Uses layoutId for highlight
│   └── sections/           # Heavy Logic (GSAP)
│       └── Hero.tsx        # Contains useGSAP implementation
├── hooks/
│   ├── use-gsap-context.ts # Scope helper (optional)
│   ├── use-preloader.ts    # Logic for loading state/Lenis lock
│   └── use-is-mobile.ts    # Media query logic
└── animations/
    ├── variants.ts         # Reusable Framer Motion variants (FadeIn, SlideUp)
    └── timelines.ts        # Complex GSAP configs
```

### Per-Animation Recommendations

| Animation | Library | Strategy |
|-----------|---------|----------|
| **Preloader (Morph/Draw)** | **GSAP** | Use a Master Timeline. You need precise sequencing (e.g., "Start brush B 0.5s before text A finishes"). Framer Motion cannot handle this imperative dependency easily. |
| **Hero Parallax** | **GSAP** | `ScrollTrigger` with `scrub: true`. Use `yPercent` for performance. |
| **Card Hover** | **Framer Motion** | `<motion.div whileHover={{ y: -10 }} />`. Simple, declarative, automatic cleanup. |
| **Card Entrance** | **GSAP** | Since these trigger on scroll, use `ScrollTrigger` with `batch` or `stagger`. |
| **Table Flip/Reveal** | **Framer Motion** | Use the `layout` prop. Framer is best-in-class for FLIP (First Last Invert Play) animations when DOM layout changes. |
| **Diagnostic Toggles** | **Framer Motion** | Use `layoutId`. This allows a shared "highlight" background to magically slide between the selected toggle items. |
| **Roadmap (Horizontal)** | **GSAP** | Use `ScrollTrigger` with `pin: true`. This is a classic GSAP pattern ("Pin container, translate content X%"). |
| **Page Transitions** | **Framer Motion** | Use `template.tsx` with `AnimatePresence`. |

### Pitfalls & Solutions

1. **The "Fighting" Problem:** Both libraries fighting for control of the CSS `transform` property on the same element.
    * *Solution:* **The Wrapper Pattern**. Never apply GSAP and Framer Motion to the exact same DOM node.
    * *Example:* An outer `div` (GSAP Scroll Entrance) wraps an inner `div` (Framer Motion Hover).
2. **React 18 Double-Fire:** `useEffect` runs twice in Strict Mode, causing GSAP timelines to duplicate.
    * *Solution:* **Mandatory** use of the `@gsap/react` package and the `useGSAP` hook. It handles scope and cleanup automatically.
3. **Scroll Conflict:** User scrolls while preloader is active.
    * *Solution:* Stop **Lenis** scrolling while the preloader is mounted.

### Example Code: Hybrid Wrapper Pattern

```tsx
'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophyCard() {
  const wrapperRef = useRef(null);

  // GSAP: The Director (Handles Scroll Entrance)
  useGSAP(() => {
    gsap.from(wrapperRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 85%',
      }
    });
  }, { scope: wrapperRef });

  return (
    <div ref={wrapperRef}>
      {/* Framer Motion: The Actor (Handles Interaction) */}
      <motion.div
        className="bg-white p-8 card-shadow"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3>Philosophy</h3>
      </motion.div>
    </div>
  );
}
```

---

## 2. Loading Strategy

### Loading Sequence

To achieve the "Premium" feel, use a **Resource-Gated Minimum Timer**. The preloader is a mask that hides the "ugly" loading parts (font swapping, hydration).

1. **Immediate:** HTML Shell + Inline Critical CSS + Preloader JS.
2. **Act 1 (The Mask):** Preloader animation runs (GSAP).
    * *Background:* Hero Image (`priority`), Fonts, and JS bundles are fetching.
3. **The Gate:** Wait for `Promise.all([MinTime, AssetsLoaded])`.
4. **Act 2 (The Reveal):** Preloader executes exit animation (curtain up).
5. **Act 3 (Interactivity):** Lenis scroll unlocks, Hero animations trigger.

### Preloader Implementation

This hook handles the logic, including locking Lenis.

```tsx
// hooks/use-initial-load.ts
import { useState, useEffect } from 'react';
import { useLenis } from 'lenis/react'; // or your lenis context

export const useInitialLoad = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) lenis.stop(); // 1. Lock Scroll

    const minTimer = new Promise(resolve => setTimeout(resolve, 2500));

    // 2. Critical Image Check (Hero)
    const heroImg = new Image();
    heroImg.src = "/hero-author.jpg";
    const assetLoad = new Promise(resolve => {
        if (heroImg.complete) resolve(true); // Cached? Done.
        heroImg.onload = () => resolve(true);
        heroImg.onerror = () => resolve(true); // Don't block forever on error
    });

    // 3. Wait for Fonts
    const fontLoad = document.fonts.ready;

    Promise.all([minTimer, assetLoad, fontLoad]).then(() => {
      setIsLoaded(true);
      if (lenis) lenis.start(); // 4. Unlock Scroll
    });
  }, [lenis]);

  return isLoaded;
};
```

### Font Strategy

* **Tool:** `next/font/google`.
* **Setting:** `display: 'swap'`.
* **Strategy:** Since the preloader covers the screen for ~2.5s, the "swap" (FOUT) happens **behind the curtain**. By the time the preloader lifts, the fonts are guaranteed ready and stable.

### Image Strategy

* **Brush Strokes:** **Inline SVGs.** Do not load as `<img>`. Inlining allows GSAP to animate the `stroke-dashoffset` immediately and saves network requests.
* **Hero Image:** `<Image priority loading="eager" ... />`.
* **Below Fold:** Standard Next.js Lazy Loading.

### Bundle Splitting

* **GSAP:** Keep it in the **Main Bundle**. It is required for Section 0 (Preloader) and Section 1 (Hero). Lazy loading it will cause a "jump" or delay in the opening sequence.
* **Heavy Sections:** Use `next/dynamic` for the **Contact Section** (Cal.com embed is heavy) and the **Roadmap** if it uses complex libraries.

---

## 3. Mobile UX Adaptations

### Animation Matrix

| Feature | Desktop | Mobile Adaptation |
| :--- | :--- | :--- |
| **Hero Parallax** | Mouse-move tilt + Scroll Parallax | **Disable Mouse-move.** Reduce Scroll Parallax depth (`yPercent`) to prevent jitter. |
| **Philosophy Cards** | Hover to 3D Tilt | **Tap Interaction.** Remove 3D Tilt. Use `active` scale state. |
| **Roadmap** | **Horizontal Scroll** (Pin) | **Vertical Stack.** Horizontal scrolling on mobile often conflicts with "Back" swipe gestures and feels unnatural. |
| **Preloader** | Full Morph + Draw | Simplified version. Reduce particle counts or complex path calculations. |
| **Decorations** | Backdrop Blur (Glassmorphism) | **Solid Opacity.** Blur is expensive on mobile GPUs. Replace `backdrop-blur` with `bg-white/95`. |

### Detection Approach

Use `gsap.matchMedia()` within your `useGSAP` hooks. This allows you to serve different logic to different devices without hydration mismatches.

```tsx
useGSAP(() => {
  let mm = gsap.matchMedia();

  // Desktop: Horizontal Scroll
  mm.add("(min-width: 800px)", () => {
    gsap.to(container.current, {
      xPercent: -100,
      scrollTrigger: { trigger: container.current, pin: true, scrub: 1 }
    });
  });

  // Mobile: Simple Vertical Fade
  mm.add("(max-width: 799px)", () => {
    gsap.from(".roadmap-item", {
      y: 50, opacity: 0, stagger: 0.1,
      scrollTrigger: { trigger: container.current }
    });
  });
});
```

### Touch Patterns

* **Hover States:** Do not rely on "First tap = Hover". Remove hover-dependent reveals. Information must be visible or togglable via explicit clicks/taps.
* **Diagnostic Toggles:** Ensure touch targets are **min 44px**. Add `cursor-pointer` to non-buttons to ensure iOS treats them as clickable.

### Performance Techniques

1. **Strict Layer Promotion:** Add `will-change: transform` to the Hero Image in CSS, but remove it (via JS class) after the intro animation finishes to free up memory.
2. **Lenis Config:** On mobile, increase the `touchMultiplier` (e.g., `1.5` or `2`) to make scrolling feel responsive.

### Testing Checklist

- [ ] **120Hz Test:** Test on iPhone Pro or Pixel. If GSAP animations stutter here, you are blocking the main thread.
- [ ] **Low Power Mode:** Test on iOS with Low Power Mode on (throttles CPU).
- [ ] **Address Bar Jump:** Scroll up/down on mobile to ensure the address bar collapsing doesn't resize your hero section (Use `dvh` units, not `vh`).

## Summary: Key Decisions

1. **Architecture:** **Hybrid.** GSAP for the timeline/scroll "movie," Framer Motion for the UI "interactions." Use the Wrapper Pattern.
2. **Loading:** **Inline SVGs** for brushes and use a **Min-Time + Asset Promise** preloader that locks Lenis scroll.
3. **Mobile:** **Verticalize the Roadmap**. Disable 3D Tilts. Replace expensive `backdrop-blur` with solid transparency.
