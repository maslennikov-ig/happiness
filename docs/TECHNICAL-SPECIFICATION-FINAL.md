# Техническое задание: Лендинг "Happiness"

> **Версия:** 2.0 (Финальная)
> **Дата:** 2024-12-09
> **Статус:** Готово к Spec-Kit

---

## 1. Общее описание проекта

### 1.1 Цель
Создание премиального лендинга для программы личностной трансформации. Сайт должен производить WOW-эффект с первой секунды, соответствовать эстетике современного искусства и премиум-сегмента.

### 1.2 Визуальная концепция
> «Представь, что мы верстаем сайт для **Музея Современного Искусства**, который открыл программу психологической поддержки для миллионеров. Это должно быть **строго, но с ярким искусством внутри**».

### 1.3 Целевая аудитория
Успешные предприниматели и топ-менеджеры (преимущественно мужчины 35-50 лет), достигшие финансового успеха, но чувствующие внутреннюю пустоту или застой.

### 1.4 Язык
Только русский.

---

## 2. Технологический стек

### 2.1 Frontend (Финальный)

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 14 LTS | Фреймворк (App Router) |
| React | 18 LTS | UI библиотека |
| TypeScript | 5.x | Типизация |
| Tailwind CSS | 3.x | Стилизация |
| Framer Motion | latest | UI анимации (hover, toggle, transitions) |
| GSAP | 3.12+ | Scroll-анимации, timelines, SVG |
| @gsap/react | 2.x | React интеграция GSAP |
| SplitType | 0.3+ | Разбиение текста (бесплатная альтернатива SplitText) |
| Lenis | 1.x | Smooth scroll |

### 2.2 Backend / Интеграции

| Технология | Назначение |
|------------|------------|
| Telegram Bot API | Получение заявок из формы |
| Cal.com | Бронирование консультаций (бесплатный, open-source) |

### 2.3 Инструменты

| Инструмент | Назначение |
|------------|------------|
| pnpm | Пакетный менеджер |
| ESLint + Prettier | Качество кода |
| Husky | Git hooks |

### 2.4 Деплой
- Собственный сервер (Docker)
- Домен: определится позже

---

## 3. Архитектура анимаций

### 3.1 Принцип "Director & Actor"

Гибридный подход с чётким разделением ответственности:

| Роль | Библиотека | Задачи |
|------|------------|--------|
| **Director** | GSAP | Scroll-анимации, pinning, timelines, SVG path animation |
| **Actor** | Framer Motion | Hover states, toggles, mount/unmount, layout transitions |

### 3.2 Wrapper Pattern

Избежание конфликтов между библиотеками:

```tsx
<div ref={gsapRef}>           {/* GSAP: scroll entrance */}
  <motion.div whileHover>     {/* Framer: interaction */}
    Content
  </motion.div>
</div>
```

### 3.3 Распределение по анимациям

| Анимация | Библиотека | Техника |
|----------|------------|---------|
| Прелоадер (brush + morph) | GSAP | Master Timeline, stroke-dashoffset |
| Hero parallax | GSAP | ScrollTrigger, scrub: true |
| Hero text reveal | GSAP + SplitType | Stagger, skewY |
| Card hover | Framer Motion | whileHover, spring |
| Card entrance | GSAP | ScrollTrigger batch |
| Table flip/reveal | GSAP | Timeline, pin: true |
| Diagnostic toggles | Framer Motion | layoutId, AnimatePresence |
| Roadmap timeline | GSAP | ScrollTrigger, pin, Draggable |
| Form reveals | Framer Motion | whileInView |

### 3.4 Обязательные практики

1. **@gsap/react** — использовать `useGSAP` hook (не useEffect)
2. **gsap.matchMedia()** — для responsive анимаций
3. **Lenis lock** — блокировать scroll во время прелоадера
4. **React 18** — useGSAP автоматически обрабатывает Strict Mode

---

## 4. Структура экранов

### Экран 0: Прелоадер

**Цель:** WOW-эффект с первой секунды, погружение в атмосферу.

**Длительность:** 2.5-3 секунды (Resource-Gated Minimum Timer)

**Визуал:**
- Фон: Rich Black (#0A0A0A)
- Brush stroke: Golden (#D4AF37) с opacity 70%
- Текст: White (#FFFFFF)

**Анимация (Timeline):**
```
0.0s - 1.0s: Golden brush stroke "рисуется" слева направо (SVG stroke-dashoffset)
1.0s - 2.0s: Текст морфирует: "КОНТРОЛЬ" → "ТРАНСФОРМАЦИЯ" → "СВОБОДА"
2.0s - 2.5s: Brush stroke масштабируется и fade out
2.5s: Reveal основного контента, Lenis unlock
```

**Технология:**
- SVG brush stroke с `stroke-dasharray: 1800; stroke-dashoffset: 1800`
- SplitType для разбиения текста
- GSAP Timeline для точной синхронизации
- CSS: `@keyframes paint-stroke { to { stroke-dashoffset: 0; } }`

**Референс:** [codepen.io/carolynmcneillie/pen/ZMpgye](https://codepen.io/carolynmcneillie/pen/ZMpgye)

**Логика загрузки:**
```typescript
Promise.all([
  new Promise(resolve => setTimeout(resolve, 2500)),  // Min time
  heroImageLoaded,                                      // Critical asset
  document.fonts.ready                                  // Fonts
]).then(() => revealContent());
```

---

### Экран 1: Hero (Манифест принятия)

**Цель:** Максимальный эмоциональный импакт, ощущение "безопасной гавани".

**Контент:**
- Надзаголовок: "ПРОЕКТ: ТВОЯ НОВАЯ РЕАЛЬНОСТЬ"
- Заголовок: "СПАСИБО, ЧТО ВЫБРАЛ СЕБЯ."
- Манифест: (см. исходный документ)
- CTA: "Сделать первый шаг к себе"
- Подпись (handwritten): "Твой Взрослый создал безопасность. Твой Ребенок готов жить."

**Визуал:**
- Фото автора (placeholder → реальное)
- Semi-transparent brush stroke overlay (mix-blend-mode: multiply)
- Много воздуха (whitespace)

**Анимации:**
| Элемент | Техника |
|---------|---------|
| Text reveal | SplitType + GSAP stagger (y: 100, opacity: 0, skewY: 7, stagger: 0.05) |
| Photo | Parallax на scroll (yPercent: -20) |
| Brush stroke | Parallax с другой скоростью (создаёт глубину) |
| CTA button | Framer Motion whileHover (scale, golden glow) |

**Mobile:**
- Отключить mouse-move parallax
- Уменьшить scroll parallax depth
- Stack layout вместо side-by-side

---

### Экран 2: Философия продукта (4 карточки)

**Заголовок:** "ПОЗВОЛЬ РЕБЕНКУ БЫТЬ СЧАСТЛИВЫМ. ПУСТЬ ВЗРОСЛЫЙ ВОЗЬМЕТ ЗА ЭТО ОТВЕТСТВЕННОСТЬ."

**Подзаголовок:** "Счастье — это когда внутри тебя нет войны."

**Карточки:**
1. **КОМПАС** — Найти ответ на "Зачем?"
2. **ЗАЩИТА** — Построить безопасные стены (PERMA)
3. **КОНТРОЛЬ** — Взять ответственность (40% = действия)
4. **ЗАБОТА** — Внедрять новое без насилия

**Desktop анимации:**
- Entrance: GSAP ScrollTrigger stagger (y: 100, opacity: 0, delay: i * 0.15)
- Hover: Framer Motion (scale: 1.05, y: -5, gradient reveal)

**Mobile:**
- Вертикальный стек
- Tap вместо hover (active state)
- Убрать 3D tilt

**CSS Gradient Hover:**
```css
.card {
  background: linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%);
  background-size: 300% 300%;
  background-position: 100% 100%;
  transition: background-position 0.6s ease;
}
.card:hover { background-position: 0% 0%; }
```

---

### Экран 3: История трансформации

**Заголовок:** "Я ПОТРАТИЛА ГОДЫ, ЧТОБЫ ПЕРЕСТАТЬ «БОРОТЬСЯ» С ЖИЗНЬЮ. И НАЧАТЬ ЕЮ НАСЛАЖДАТЬСЯ."

**Контент:** Таблица "Было → Стало" (СЕМЬЯ, ОТНОШЕНИЯ, БИЗНЕС)

**Цитата:** "Больше нет необходимости падать на дно, чтобы совершить прорыв. Рост идет через стабильность, а не через кризис."

**Анимация (Pinned Scroll):**
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.transformation-section',
    pin: true,
    start: 'top top',
    end: '+=300%',
    scrub: 1
  }
})
.to('.was-column', { opacity: 0.3, x: -50, filter: 'blur(4px)' })
.to('.arrow-icon', { scale: 1.5, rotation: 360 }, '<')
.to('.became-column', {
  opacity: 1,
  x: 0,
  background: 'linear-gradient(135deg, #D4AF37 0%, #C9B037 100%)'
});
```

**Mobile:**
- Уменьшить pin duration (end: '+=150%')
- Упростить blur эффект
- Возможно: swipe-triggered версия

---

### Экран 4: Диагностика (5 сигналов)

**Заголовок:** "ГДЕ ТЕРЯЕТСЯ ТВОЯ ЭНЕРГИЯ?"

**Стиль:** "Личный дневник", handwritten акценты

**5 сигналов:**
1. ДЕНЬ СУРКА (СКУКА)
2. ЭНЕРГОДЕФИЦИТ
3. ЖИЗНЬ НА ЧЕРНОВИК
4. СТЕКЛЯННЫЙ ПОТОЛОК
5. ЧУЖАЯ ИГРА

**Интерактивность:**
- Визуальные toggles/sliders (кликабельные)
- Данные НЕ собираются
- Эффект маркера при активации

**Технология:**
```tsx
// Framer Motion layoutId для sliding highlight
<motion.div layoutId="highlight" className="bg-gold/20" />
```

**Touch targets:** Минимум 44px

---

### Экран 5: Roadmap программы

**Задача:** Показать конкретный план трансформации по неделям.

**Контент:** *Ожидается от заказчика*

**Desktop:**
- Горизонтальный timeline
- GSAP ScrollTrigger с pin: true
- Progress bar заполняется при скролле
- Draggable для прямого взаимодействия

**Mobile (КРИТИЧНО!):**
- **Вертикальный стек** (не горизонтальный scroll!)
- Горизонтальный scroll на мобильных конфликтует с "Back" жестами
- gsap.matchMedia() для переключения layout

```javascript
useGSAP(() => {
  let mm = gsap.matchMedia();

  mm.add("(min-width: 800px)", () => {
    // Horizontal scroll with pin
    gsap.to(container, { xPercent: -100, scrollTrigger: { pin: true, scrub: 1 } });
  });

  mm.add("(max-width: 799px)", () => {
    // Vertical fade-in
    gsap.from(".roadmap-item", { y: 50, opacity: 0, stagger: 0.1 });
  });
});
```

---

### Экран 6: Запись на консультацию

**Контент:**
- Текст: "Заполни короткую анкету. Это займет 2 минуты..."
- Форма: Имя, Контакт (телефон/telegram), О ситуации
- CTA: "Записаться на знакомство"
- Блок "Что будет на встрече" (3 пункта)

**Форма → Telegram Bot:**
```typescript
// lib/telegram.ts
export async function sendToTelegram(data: FormData) {
  const message = `
🆕 Новая заявка!

👤 Имя: ${data.name}
📱 Контакт: ${data.contact}
📝 О ситуации:
${data.message}

🕐 ${new Date().toLocaleString('ru-RU')}
  `;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
}
```

**Cal.com интеграция:**
- Embed виджет или кнопка redirect
- Lazy load через next/dynamic (тяжёлый компонент)

**Анимации:**
- Sequential field reveals (Framer Motion whileInView)

---

## 5. Дизайн-система

### 5.1 Типографика

**Основной вариант (Google Fonts, Cyrillic ✓):**

| Роль | Шрифт | Размеры | Weight |
|------|-------|---------|--------|
| Заголовки | Playfair Display | Hero: 48-64px, Sections: 32-40px | 400, 700 |
| Основной текст | Montserrat | 16-18px, line-height: 1.6 | 400, 500 |
| Handwritten | Caveat | 20-24px | 400 |

**Альтернатива для лучшей кириллицы:**
- PT Serif (заголовки) + PT Sans (текст) + Caveat

**Реализация (next/font):**
```typescript
// lib/fonts.ts
import { Playfair_Display, Montserrat, Caveat } from 'next/font/google';

export const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-playfair',
});

export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const caveat = Caveat({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-caveat',
});
```

### 5.2 Цветовая палитра

```css
:root {
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-dark: #0A0A0A;
  --bg-muted: #F5F5F5;

  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-inverse: #FFFFFF;

  /* Accents */
  --gold-primary: #D4AF37;
  --gold-muted: #C9B037;
  --yellow-brush: #FFCF48;

  /* Semantic */
  --success: #22C55E;
  --error: #EF4444;
}
```

### 5.3 Spacing (Tailwind)

```
Section padding: py-24 (desktop) / py-16 (mobile)
Container: max-w-7xl mx-auto px-4
Card gaps: gap-8 (desktop) / gap-4 (mobile)
```

### 5.4 Breakpoints

| Название | Размер | Устройства |
|----------|--------|------------|
| Mobile | 320-767px | Смартфоны |
| Tablet | 768-1023px | Планшеты |
| Desktop | 1024-1439px | Ноутбуки |
| Large | 1440px+ | Мониторы |

---

## 6. Мобильная адаптация

### 6.1 Матрица адаптации

| Элемент | Desktop | Mobile |
|---------|---------|--------|
| Hero parallax | Mouse + Scroll | Только Scroll (уменьшенный) |
| Philosophy cards | Hover + 3D tilt | Tap + simple scale |
| Roadmap | Horizontal scroll (pin) | **Vertical stack** |
| Transformation | Pin 300% | Pin 150%, simplified blur |
| Backdrop blur | blur-xl | **Solid bg-white/95** |

### 6.2 Важные детали

1. **dvh вместо vh** — избежать "прыжков" при скрытии address bar
2. **Touch targets** — минимум 44px
3. **Lenis touchMultiplier** — увеличить до 1.5-2 для responsiveness
4. **prefers-reduced-motion** — уважать системные настройки

### 6.3 Тестирование

- [ ] iPhone Pro (120Hz) — проверка плавности
- [ ] iOS Low Power Mode — throttled CPU
- [ ] Android mid-range (2020+)
- [ ] Address bar collapse/expand

---

## 7. Производительность

### 7.1 Целевые метрики

| Метрика | Цель |
|---------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Lighthouse Performance | > 90 |

### 7.2 Оптимизации

| Область | Решение |
|---------|---------|
| Fonts | next/font, display: swap, preload critical |
| Hero image | `<Image priority loading="eager" />` |
| Brush strokes | **Inline SVG** (не img) |
| Cal.com | next/dynamic lazy load |
| Below-fold | Standard lazy loading |
| CSS | Critical inline, остальное defer |
| will-change | Только на время анимации, потом убирать |

---

## 8. Файловая структура

```
happiness/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + fonts
│   │   ├── page.tsx            # Main page
│   │   ├── globals.css
│   │   └── template.tsx        # AnimatePresence wrapper
│   ├── components/
│   │   ├── ui/                 # Atoms (Framer Motion)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toggle.tsx
│   │   │   └── Input.tsx
│   │   ├── sections/           # Page sections (GSAP + Framer)
│   │   │   ├── Preloader.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Philosophy.tsx
│   │   │   ├── Transformation.tsx
│   │   │   ├── Diagnostic.tsx
│   │   │   ├── Roadmap.tsx
│   │   │   └── Contact.tsx
│   │   └── shared/
│   │       ├── BrushStroke.tsx
│   │       ├── ScrollReveal.tsx
│   │       └── SmoothScroll.tsx
│   ├── hooks/
│   │   ├── use-initial-load.ts
│   │   ├── use-is-mobile.ts
│   │   └── use-gsap-context.ts
│   ├── lib/
│   │   ├── telegram.ts
│   │   ├── fonts.ts
│   │   └── utils.ts
│   ├── animations/
│   │   ├── variants.ts         # Framer variants
│   │   └── timelines.ts        # GSAP configs
│   └── assets/
│       └── svg/
│           └── brush-strokes/
├── public/
│   ├── images/
│   │   ├── hero-author.jpg
│   │   └── og-image.jpg
│   └── fonts/
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 9. Зависимости

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.0.0",
    "split-type": "^0.3.0",
    "lenis": "^1.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## 10. Промпты для генерации изображений

### 10.1 Brush Strokes (нужно 4-6 вариантов)

**Prompt 1 — Horizontal Sweep:**
```
Abstract golden brush stroke on pure white background, single horizontal sweep from left to right, watercolor texture with soft feathered edges, luxury contemporary art style, isolated element, transparent PNG format, high resolution 3000x1000 pixels, showing natural opacity variations and paint texture, museum quality aesthetic
```

**Prompt 2 — Diagonal Bold:**
```
Elegant gold paint brush mark, confident diagonal stroke from bottom-left to top-right, semi-transparent watercolor effect with visible brush hair texture, modern art gallery aesthetic, isolated on white background, PNG with full transparency, 2000x2000 pixels, rich golden color #D4AF37
```

**Prompt 3 — Organic Splash:**
```
Golden yellow paint splash, abstract organic asymmetric shape, soft watercolor texture with natural drips and splatters, luxury minimalist style, looks hand-painted by artist, isolated graphic element on white background, transparent PNG, 2000x2000 pixels, warm gold tones
```

**Prompt 4 — Subtle Wash:**
```
Soft warm yellow brush stroke, ethereal and delicate watercolor wash effect, very light opacity 30-50%, suggesting gentle movement and flow, premium design accent element, white background with full transparency, PNG format, 2500x800 pixels horizontal orientation, barely-there luxury aesthetic
```

**Prompt 5 — Impasto Bold:**
```
Bold confident golden brush stroke, thick impasto texture showing paint volume and depth, single dramatic sweeping gesture, contemporary art museum piece quality, isolated on white with transparency, PNG format 2000x1500 pixels, rich saturated gold #C9B037, visible brush marks and texture
```

### 10.2 OG Image (Social Sharing)

```
Minimalist premium social media banner for luxury coaching brand, clean white background with subtle golden brush stroke accent in upper right corner, elegant black serif typography word 'HAPPINESS' centered in Playfair Display style, modern art museum aesthetic, sophisticated and professional, exact dimensions 1200x630 pixels, no people, abstract art feel
```

### 10.3 Author Photo Placeholder

```
Professional woman portrait photography, age 35-45, confident genuine warm smile showing in eyes, direct eye contact with camera creating connection, soft natural window lighting from left side, neutral warm beige or cream solid background, high-end editorial magazine style, visible from shoulders up, authentic and approachable expression, premium portrait quality, sharp focus on eyes
```

---

## 11. Задания для заказчика

### 11.1 Критические (блокируют разработку)

| # | Задание | Описание | Формат |
|---|---------|----------|--------|
| 1 | **Фото автора** | Профессиональное фото: живое, тёплое, полуулыбка, прямой взгляд. Минимум 2000px по большей стороне | JPG/PNG |
| 2 | **Контент Roadmap** | Программа по неделям для Экрана 5 | Markdown (см. шаблон ниже) |
| 3 | **Telegram Bot** | Создать через @BotFather, получить токен | Токен + Chat ID |
| 4 | **Cal.com аккаунт** | Настроить событие "Знакомство" 30-60 мин, подключить Google Calendar | Ссылка на бронирование |

### 11.2 Средний приоритет

| # | Задание | Описание |
|---|---------|----------|
| 5 | Домен | Выбрать и зарегистрировать |
| 6 | SSL | Подготовить для сервера |
| 7 | Финальные тексты | Проверить/утвердить все тексты на лендинге |

### 11.3 Шаблон для Roadmap контента

```markdown
## Неделя 1: [Название этапа]
**Фокус:** [Одно предложение]
**Что делаем:**
- Пункт 1
- Пункт 2
**Результат:** [Что получит участник]

## Неделя 2: [Название этапа]
...
```

---

## 12. План разработки

### Неделя 1: Фундамент + Вход
- [ ] Настройка проекта (Next.js 14, Tailwind, ESLint, Prettier)
- [ ] Установка зависимостей (GSAP, Framer Motion, SplitType, Lenis)
- [ ] Дизайн-система (шрифты, цвета, базовые компоненты)
- [ ] Прелоадер (brush stroke + text morph)
- [ ] Hero секция (parallax, text reveal, photo integration)

### Неделя 2: Основные секции
- [ ] Философия (4 карточки с анимациями)
- [ ] Трансформация (pinned scroll, blur-to-focus)
- [ ] Responsive адаптация для Недели 1-2

### Неделя 3: Интерактивные секции
- [ ] Диагностика (toggles с highlight эффектом)
- [ ] Roadmap (horizontal/vertical с matchMedia)
- [ ] Responsive адаптация

### Неделя 4: Интеграции + Полировка
- [ ] Контактная форма + Telegram Bot
- [ ] Cal.com интеграция
- [ ] SEO (meta, OG tags)
- [ ] Мобильное тестирование
- [ ] Performance оптимизация
- [ ] Баг-фиксы и полировка

---

## 13. Приложения

### A. Исходные документы
- `docs/Счастье Инд.md` — Исходное видение
- `docs/requirements-questions.md` — Требования

### B. Результаты исследований
- `docs/research/deepresearch-results.md` — Дизайн референсы
- `docs/research/deepthink-results.md` — Архитектурные решения

### C. Референсы и ресурсы
- [SplitType](https://github.com/lukePeavey/SplitType) — Text splitting
- [Brush Stroke SVG](https://codepen.io/carolynmcneillie/pen/ZMpgye) — Preloader reference
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Cal.com](https://cal.com/) — Scheduling
- [Lenis](https://github.com/darkroomengineering/lenis) — Smooth scroll

---

## 14. Чеклист готовности к разработке

- [ ] Фото автора получено
- [ ] Контент Roadmap готов
- [ ] Telegram Bot создан (токен + chat_id)
- [ ] Cal.com настроен
- [ ] Brush stroke изображения сгенерированы
- [ ] OG image сгенерирован
- [ ] Домен определён (опционально)

---

## 15. Дополнения и уточнения

### 15.1 Недостающие UI элементы

#### Header / Навигация
**Статус:** Требует уточнения у заказчика

**Варианты:**
1. **Без header** — чистый storytelling scroll (рекомендуется для иммерсивности)
2. **Minimal header** — только логотип + CTA кнопка (появляется после Hero)
3. **Full navigation** — sticky меню с якорями на секции

**Рекомендация:** Вариант 2 — минимальный header, появляющийся после скролла Hero секции.

#### Footer
**Статус:** Требует уточнения у заказчика

**Минимальный footer должен содержать:**
- Копирайт: "© 2024 Happiness. Все права защищены."
- Ссылка на политику конфиденциальности
- Контактный email или Telegram

**Опционально:**
- Ссылки на соцсети (если есть)
- Повтор CTA кнопки

#### Scroll Indicator
На Hero секции добавить анимированный индикатор "scroll down":
- Минималистичная стрелка или линия
- Subtle bounce анимация
- Исчезает при начале скролла

#### Back to Top
Кнопка возврата наверх:
- Появляется после скролла 50vh
- Плавная анимация появления
- Иконка стрелки вверх

### 15.2 Иконки

**Источник:** [Lucide Icons](https://lucide.dev/) (MIT license, React ready)

| Карточка | Иконка Lucide |
|----------|---------------|
| КОМПАС | `<Compass />` |
| ЗАЩИТА | `<Shield />` |
| КОНТРОЛЬ | `<Gauge />` или `<Target />` |
| ЗАБОТА | `<Heart />` или `<HandHeart />` |

**Установка:**
```bash
pnpm add lucide-react
```

### 15.3 Form States (Контактная форма)

#### Loading State
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="animate-spin mr-2" />
      Отправляем...
    </>
  ) : (
    'Отправить заявку'
  )}
</Button>
```

#### Success State
После успешной отправки:
- Форма заменяется на сообщение благодарности
- Текст: "Спасибо! Мы свяжемся с вами в ближайшее время."
- Кнопка: "Выбрать время встречи" → Cal.com

#### Error State
При ошибке отправки:
- Toast notification или inline error
- Текст: "Не удалось отправить. Попробуйте ещё раз или напишите напрямую в Telegram."
- Кнопка retry
- Fallback ссылка на Telegram автора

### 15.4 Технические детали

#### Lenis + ScrollTrigger интеграция

**Проблема:** ScrollTrigger может конфликтовать с custom scroll библиотеками.

**Решение:** Использовать `scrollerProxy`:

```typescript
// hooks/use-smooth-scroll.ts
import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}
```

#### Safari iOS Specifics

```css
/* Smooth scroll на iOS */
html {
  -webkit-overflow-scrolling: touch;
}

/* Prefix для SVG анимаций */
.brush-stroke {
  -webkit-stroke-dasharray: 1800;
  -webkit-stroke-dashoffset: 1800;
  stroke-dasharray: 1800;
  stroke-dashoffset: 1800;
}
```

#### Preloader Timeout

Если ресурсы грузятся слишком долго:

```typescript
const MAX_PRELOADER_TIME = 5000; // 5 seconds max

Promise.race([
  Promise.all([minTimer, assetLoad, fontLoad]),
  new Promise(resolve => setTimeout(resolve, MAX_PRELOADER_TIME))
]).then(() => revealContent());
```

### 15.5 Accessibility (A11y)

#### Prefers Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```typescript
// hooks/use-reduced-motion.ts
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
```

#### Color Contrast

**Проблема:** Gold (#D4AF37) на белом фоне может не пройти WCAG AA (4.5:1).

**Решение:**
- Для текста использовать более тёмный gold: `#9A7B0A`
- Gold (#D4AF37) использовать только для декоративных элементов
- Проверить на [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

#### ARIA Labels

```tsx
// Прелоадер
<div role="status" aria-live="polite" aria-label="Загрузка сайта">
  <span className="sr-only">Загрузка...</span>
</div>

// Skip to content (для screen readers)
<a href="#main-content" className="sr-only focus:not-sr-only">
  Перейти к содержимому
</a>

// Main content
<main id="main-content" tabIndex={-1}>
  ...
</main>
```

#### Heading Hierarchy

```
h1: "СПАСИБО, ЧТО ВЫБРАЛ СЕБЯ." (Hero - только один h1)
h2: Заголовки секций (Философия, Трансформация, и т.д.)
h3: Заголовки карточек, подразделов
```

### 15.6 Security

#### Form Validation

**Client-side (Zod + React Hook Form):**
```typescript
const formSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(100),
  contact: z.string().min(5, 'Введите телефон или Telegram'),
  message: z.string().max(1000, 'Максимум 1000 символов').optional(),
});
```

**Server-side:** Повторная валидация в API route.

#### Honeypot Anti-Spam

```tsx
// Скрытое поле, которое боты заполняют
<input
  type="text"
  name="website"
  className="hidden"
  tabIndex={-1}
  autoComplete="off"
/>

// В API: если website заполнен — это бот
if (formData.website) {
  return Response.json({ success: true }); // Fake success
}
```

#### Rate Limiting

```typescript
// Простой in-memory rate limiter
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3;

  const timestamps = submissions.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) return true;

  submissions.set(ip, [...recent, now]);
  return false;
}
```

### 15.7 Environment Variables

```bash
# .env.example

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Cal.com
NEXT_PUBLIC_CALCOM_LINK=https://cal.com/username/event

# Site URL (for OG tags)
NEXT_PUBLIC_SITE_URL=https://happiness.example.com

# Optional: Analytics (для будущего)
# NEXT_PUBLIC_YM_ID=
# NEXT_PUBLIC_GA_ID=
```

### 15.8 SEO Files

#### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://happiness.example.com/sitemap.xml
```

#### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://happiness.example.com/</loc>
    <lastmod>2024-12-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

#### Favicon Set
Сгенерировать через [RealFaviconGenerator](https://realfavicongenerator.net/):
- favicon.ico (16x16, 32x32)
- apple-touch-icon.png (180x180)
- favicon-32x32.png
- favicon-16x16.png
- site.webmanifest

### 15.9 Политика конфиденциальности

**Требуется** для соответствия 152-ФЗ (РФ) при сборе персональных данных.

**Минимальное содержание:**
- Какие данные собираются (имя, контакт)
- Цель сбора (связь для консультации)
- Как хранятся (Telegram)
- Срок хранения
- Права пользователя

**Реализация:** Отдельная страница `/privacy` или модальное окно.

---

## 16. Открытые вопросы для заказчика

| # | Вопрос | Варианты | Рекомендация |
|---|--------|----------|--------------|
| 1 | Header с навигацией? | Нет / Минимальный / Полный | Минимальный (появляется после Hero) |
| 2 | Footer? | Нет / Минимальный / Полный | Минимальный (копирайт + privacy) |
| 3 | Ссылки на соцсети? | Telegram / Instagram / Нет | Указать если есть |
| 4 | Cal.com интеграция? | Inline embed / Popup / Redirect | Redirect (проще, надёжнее) |
| 5 | Политика конфиденциальности? | Страница / Модальное окно | Страница /privacy |
| 6 | Иконки для карточек? | Lucide (готовые) / Кастомные | Lucide Icons |
| 7 | Допустимо использовать эмодзи? | Да / Нет / Заменить на иконки | Заменить на иконки |

---

## 17. Полные тексты контента

### Экран 1: Манифест (Hero)

**Надзаголовок:** ПРОЕКТ: ТВОЯ НОВАЯ РЕАЛЬНОСТЬ

**Заголовок:** СПАСИБО, ЧТО ВЫБРАЛ СЕБЯ.

**Манифест:**
> «Ты выбрал быть Счастливым, Стабильным и в Благополучии.
>
> Ты привык быть сильным для всех. Привык держать удар. Но здесь тебе не нужно бороться. Выдыхай. Самое сложное позади.
>
> Главное решение уже принято. Ты перестал откладывать жизнь на потом. Всё остальное — это просто путь, и тебе не придется идти по нему в одиночку.
>
> **Теперь я рядом.**»

**CTA:** Сделать первый шаг к себе

**Подпись (handwritten):** Твой Взрослый создал безопасность. Твой Ребенок готов жить.

### Экран 6: Что будет на встрече

**Пункт 1:** СВЕРИМ КООРДИНАТЫ
> Ты расскажешь свою текущую ситуацию (без прикрас), а я скажу честно: подходит ли тебе моя методика. Если я увижу, что тебе нужен другой специалист (например, психотерапевт), я прямо об этом скажу.

**Пункт 2:** ПРОВЕРИМ "ХИМИЮ"
> Наставник — это партнер на 3 месяца. Нам должно быть легко общаться. Мы поймем, совпадаем ли мы по ценностям и темпу.

**Пункт 3:** НАМЕТИМ ПЕРВЫЕ ШАГИ
> Даже если мы не пойдем в длительную работу, ты уйдешь с ясностью: что с тобой происходит и куда двигаться дальше.

---

## 18. Финальный чеклист готовности

### От заказчика (блокирующие):
- [ ] Фото автора (высокое качество)
- [ ] Контент Roadmap по неделям
- [ ] Telegram Bot (токен + chat_id)
- [ ] Cal.com настроен
- [ ] Ответы на вопросы из раздела 16

### Ассеты (можно параллельно):
- [ ] Brush stroke изображения сгенерированы (5 шт)
- [ ] OG image сгенерирован
- [ ] Favicon set подготовлен

### Опциональные:
- [ ] Домен зарегистрирован
- [ ] SSL сертификат готов
- [ ] Текст политики конфиденциальности

---

*Документ готов к преобразованию в Spec-Kit спецификацию.*
