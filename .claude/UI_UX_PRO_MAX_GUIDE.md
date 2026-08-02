# UI/UX Pro Max Skill - Guide Complet

## ✅ Installation Complète

Le skill `UI/UX Pro Max` v2.11.0 est maintenant installé et configuré pour le projet Afro Sport.

```
.claude/skills/ui-ux-pro-max/
├── data/                          # 7+ CSV databases (styles, colors, typography, etc.)
├── scripts/                        # Python search engine & utilities
├── templates/                      # Platform configs
├── skill.json                      # Metadata
├── LICENSE                         # MIT
└── README.md                       # Full documentation
```

---

## 🎨 Ce que tu Peux Faire Avec

### Base de Données Incluse

| Type | Quantité | Exemples |
|------|----------|----------|
| **UI Styles** | 84 | Glassmorphism, Minimalism, Brutalism, Neumorphism |
| **Color Palettes** | 192 | Par type de produit (SaaS, e-commerce, portfolio) |
| **Font Pairings** | 74 | Google Fonts optimisées |
| **UX Guidelines** | 98 | Best practices et anti-patterns |
| **Chart Types** | 25 | Bar, Line, Pie, Area, Scatter, etc. |
| **Tech Stacks** | 22 | React, Next.js, Vue, Svelte, Flutter, SwiftUI, etc. |

---

## 🔍 Utilisation Basique

### Commande Python

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
```

### Domaines Disponibles

```
product      → SaaS, e-commerce, portfolio, blog, documentation, admin, marketplace
style        → UI styles (glassmorphism, minimalism, etc.) + CSS keywords
typography  → Font pairings avec Google Fonts imports
color        → Palettes par type de produit
landing      → Page structure et CTA strategies
chart        → Chart types et library recommendations
ux           → Best practices et anti-patterns
icons        → Icon recommendations (Phosphor, Heroicons, Lucide)
react        → React/Next.js performance patterns
web          → iOS/Android/React Native guidelines
google-fonts → Lookup individual Google Fonts
gsap         → GSAP animation skeletons (hover, scroll, stagger, etc.)
```

---

## 💡 Exemples d'Utilisation

### 1. **Chercher une Palette de Couleurs pour Afro Sport**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "delivery transport logistics" --domain color
```

**Retour** : Palettes de couleurs optimisées pour un marketplace de livraison

### 2. **Trouver des Pairings de Fonts**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "modern bold sports" --domain typography
```

**Retour** : Font pairings Google Fonts avec imports CSS

### 3. **Chercher un UI Style**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "modern sportive energy" --domain style
```

**Retour** : UI styles recommandés + CSS keywords + AI prompts

### 4. **React Performance Patterns**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "Next.js image optimization" --domain react
```

**Retour** : Patterns et code snippets optimisés

### 5. **Chart Types pour Dashboard**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "statistics KPI metrics" --domain chart
```

**Retour** : Types de charts recommandés + library code

---

## 🎛️ Utilisation Avancée - Design System Mode

### Avec Dials de Design

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" \
  --design-system \
  --variance 8 \
  --motion 7 \
  --density 5
```

### Dials Expliqués

| Dial | Valeur | Effet |
|------|--------|-------|
| **variance** | 1-10 | Centered/minimal (1) → Bold/asymmetric (10) |
| **motion** | 1-10 | Attache GSAP snippet (hover, scroll, stagger, etc.) |
| **density** | 1-10 | Spacious (1) → Dense/dashboard (10) |

### Exemple : Design Sportif Énergique

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "Afro Sport delivery" \
  --design-system \
  --variance 9 \
  --motion 8 \
  --density 6
```

Cela retournera un design :
- **Variance 9** : Asymétrique, audacieux, distinctive
- **Motion 8** : Animations énergiques (GSAP inclus)
- **Density 6** : Spacing équilibré, pas trop compact

---

## 📚 Recherche par Tech Stack

### Chercher des Patterns pour Next.js

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "real-time tracking GPS" --stack nextjs
```

### Stacks Disponibles

```
html-tailwind, react, nextjs, astro, vue, nuxtjs, nuxt-ui, svelte,
swiftui, react-native, flutter, shadcn, jetpack-compose, threejs,
angular, laravel, javafx, wpf, winui, avalonia, uno, uwp
```

---

## 🚀 Exemples Concrets pour Afro Sport

### Palette de Couleurs Delivery

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "logistics delivery fast reliable" --domain color
```

### Fonts Modernes Sportives

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "bold headlines modern athletic" --domain typography
```

### Homepage Structure

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "marketplace homepage featured listings" --domain landing
```

### Animation Patterns

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "smooth scroll reveal hover effects" --domain gsap --stack nextjs
```

### Stats Dashboard

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "KPI metrics statistics tracking" --domain chart
```

---

## 📊 Architecture du Skill

### Data (CSV Databases)

```
data/
├── products.csv          # Product type definitions
├── styles.csv            # 84 UI styles + CSS keywords
├── colors.csv            # 192 color palettes
├── typography.csv        # 74 font pairings
├── landing.csv           # Page structures
├── chart.csv             # 25 chart types
├── ux.csv                # 98 UX guidelines
├── icons.csv             # Icon libraries
├── motion.csv            # GSAP animation patterns
├── react.csv             # React patterns
├── google-fonts.csv      # Google Fonts library
└── stacks/               # Stack-specific guidelines
    ├── nextjs.csv
    ├── react.csv
    └── ... (20+ more)
```

### Scripts (Python)

```
scripts/
├── search.py             # Main CLI entry point (BM25 + regex search)
├── core.py               # Search engine implementation
└── design_system.py      # Design system generation
```

---

## 🔧 Cas d'Usage Courants

### Créer une Nouvelle Page

```bash
# 1. Chercher une structure de landing
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "transporteur profile showcase" --domain landing

# 2. Chercher une palette de couleurs
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "profile portfolio showcase" --domain color

# 3. Chercher fonts et animations
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "modern professional" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "card hover reveal" --domain gsap --stack nextjs
```

### Améliorer un Composant

```bash
# Pour une card de livraison
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "delivery card status tracking" --domain style --stack nextjs
```

### Créer un Dashboard Stats

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "delivery statistics real-time metrics" --domain chart --stack nextjs
```

---

## 📖 Integration avec Afro Sport

La base de données contient déjà :
- **Marketplace patterns** (SaaS, e-commerce)
- **Delivery/logistics suggestions**
- **Real-time tracking UI patterns**
- **Performance optimizations** (Next.js specific)
- **Animation patterns** pour user engagement

---

## ✨ Avantages

✅ **84 UI Styles** prêts à l'emploi  
✅ **192 Color Palettes** testées  
✅ **74 Font Pairings** Google Fonts  
✅ **98 UX Guidelines** + best practices  
✅ **25 Chart Types** pour dashboards  
✅ **22 Tech Stacks** supportés (React, Next.js, Vue, etc.)  
✅ **GSAP Animations** prêtes à copier-coller  
✅ **Search Engine** (BM25 + regex)  
✅ **Design System Mode** avec dials (variance, motion, density)  

---

## 📍 Intégration Complète

Ces deux skills ensemble offrent :

1. **frontend-design** : Guidance philosophique + principes
2. **ui-ux-pro-max** : Database + patterns + code prêt à utiliser

**Usage** :
- Utilise `frontend-design` pour décider du concept
- Utilise `ui-ux-pro-max` pour implémenter + chercher patterns

---

**Version** : 2.11.0  
**License** : MIT  
**Repository** : https://github.com/nextlevelbuilder/ui-ux-pro-max-skill  
**Status** : ✅ Installé et prêt
