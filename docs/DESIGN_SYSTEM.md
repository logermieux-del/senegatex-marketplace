# Design System - Yombal

## 🎨 Palette de Couleurs

### Primaire (Orange - Sénégal)
```
Primary-50:   #fff7ed
Primary-100:  #ffedd5
Primary-300:  #fdba74
Primary-500:  #f97316 ← Main
Primary-600:  #ea580c
Primary-700:  #c2410c
Primary-900:  #7c2d12
```

### Secondaire (Bleu)
```
Secondary-50:   #f0f4f8
Secondary-500:  #3b82f6 ← Accent
Secondary-900:  #1e3a8a
```

### Neutral (Gris)
```
Gray-50:    #f9fafb
Gray-100:   #f3f4f6
Gray-200:   #e5e7eb
Gray-400:   #9ca3af
Gray-600:   #4b5563
Gray-900:   #111827
```

### État
```
Success:  #10b981 (vert)
Warning:  #f59e0b (ambre)
Error:    #ef4444 (rouge)
Info:     #3b82f6 (bleu)
```

---

## 📐 Typographie

### Headings
```
H1: 48px / 700 / line-height 1.2  (Hero)
H2: 36px / 700 / line-height 1.3  (Section)
H3: 28px / 700 / line-height 1.4  (Subsection)
H4: 20px / 600 / line-height 1.5  (Card title)
```

### Body
```
Large:   18px / 400 / line-height 1.6
Normal:  16px / 400 / line-height 1.6 ← Default
Small:   14px / 400 / line-height 1.5
Tiny:    12px / 400 / line-height 1.4
```

### Font Family
```
- Headings: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto"
- Body:     Same (system fonts for fast load)
```

---

## 🧩 Composants Core

### Buttons

```html
<!-- Primary -->
<button class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
  Action
</button>

<!-- Secondary -->
<button class="border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50">
  Secondary
</button>

<!-- Outline -->
<button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
  Outline
</button>

<!-- Disabled -->
<button disabled class="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

### Cards

```html
<div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
  <h3 class="text-lg font-bold mb-2">Title</h3>
  <p class="text-gray-600 mb-4">Description</p>
  <button class="text-orange-500 hover:underline">Learn more →</button>
</div>
```

### Input Fields

```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
    placeholder="you@example.com"
  />
</div>
```

### Forms

```html
<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Full Name</label>
    <input type="text" class="w-full px-3 py-2 border rounded-lg" />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Category</label>
    <select class="w-full px-3 py-2 border rounded-lg">
      <option>Choose category</option>
    </select>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Description</label>
    <textarea class="w-full px-3 py-2 border rounded-lg h-24"></textarea>
  </div>

  <button type="submit" class="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600">
    Submit
  </button>
</form>
```

---

## 🎯 Layout & Spacing

### Container
```
Max-width: 1280px (7xl)
Padding: 16px (mobile) → 32px (desktop)
```

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px ← Default gap
lg: 24px
xl: 32px
2xl: 48px
```

### Common Patterns
```html
<!-- Section padding -->
<section class="py-16 px-4 max-w-7xl mx-auto">

<!-- Grid (responsive) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Stack (vertical) -->
<div class="space-y-4">

<!-- Stack (horizontal) -->
<div class="flex gap-4">
```

---

## 📱 Breakpoints

```
Mobile:    0px (default)
Tablet:    768px (md:)
Desktop:   1024px (lg:)
Wide:      1280px (xl:)
```

### Responsive Pattern
```
Mobile first, then enhance:
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 column → 2 columns → 3 columns -->
</div>
```

---

## ✨ Interactions

### Hover States
```css
.transition: all 200ms ease-in-out
.hover\:scale-105: scale(1.05)
.hover\:shadow-lg: box-shadow elevated
.hover\:opacity-80: opacity 80%
```

### Loading State
```html
<div class="flex items-center gap-2">
  <div class="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
  <span>Loading...</span>
</div>
```

### Error State
```html
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
  ❌ Error message
</div>
```

### Success State
```html
<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
  ✓ Success message
</div>
```

---

## 🔄 Navigation

### Header
```html
<header class="border-b border-gray-200 sticky top-0 bg-white z-50">
  <nav class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <!-- Logo -->
    <!-- Links -->
    <!-- Auth buttons -->
  </nav>
</header>
```

### Footer
```html
<footer class="bg-gray-900 text-white py-12 mt-16">
  <div class="max-w-7xl mx-auto px-4">
    <!-- Logo -->
    <!-- Links -->
    <!-- Social -->
    <!-- Copyright -->
  </div>
</footer>
```

---

## 📦 Tailwind CSS Config

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    colors: {
      orange: { /* Primary */ },
      blue: { /* Secondary */ },
      gray: { /* Neutral */ },
      green: { /* Success */ },
      red: { /* Error */ },
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'],
    },
    extend: {
      maxWidth: {
        '7xl': '1280px',
      },
    },
  },
};
```

---

## 🎯 Implementation Checklist

- [ ] All buttons use primary/secondary styles
- [ ] Forms have proper labels + spacing
- [ ] Cards have consistent shadows
- [ ] Mobile layouts tested (375px width)
- [ ] Loading states visible everywhere
- [ ] Error messages accessible + clear
- [ ] Hover/focus states on all interactive elements
- [ ] Color contrast WCAG AA compliant
- [ ] Icons consistent (size: 20px default)
- [ ] Animations smooth (200-300ms)

---

**Version:** 1.0  
**Last Updated:** 2026-07-31
