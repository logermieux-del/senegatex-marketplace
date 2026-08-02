# Afro Sport - Modern Design System v2.0

## 🎨 Concept

**Design Sportif Moderne** inspiré par les meilleures pratiques en branding sportif.
- **Bold & Énergique** : Typographie agressive, contraste maximal
- **Minimaliste** : Espace blanc stratégique, zéro ornementation
- **Performance-First** : Optimisé pour mobile, animations fluides

---

## 🎯 Palette de Couleurs

### Couleurs Primaires

```
Background:  #0a0a0a (Noir profond)
Foreground:  #ffffff (Blanc pur)
```

### Couleurs d'Accent

```
Orange (Action):     #ff6b35 ← Énergie, appels à l'action
Rouge (Dynamique):   #d32f2f ← Urgence, attention, validation
Gris (Secondaire):   #606060 ← Texte secondaire, désactivé
```

### Gradient Principal

```css
background: linear-gradient(135deg, #ff6b35 0%, #d32f2f 100%);
/* Orange → Rouge */
```

---

## 📐 Typographie

### Hiérarchie

```
H1 (72px):  Titre hero - font-weight: 900, letter-spacing: -2px
H2 (48px):  Titre section - font-weight: 900, letter-spacing: -1px
H3 (28px):  Sous-titre - font-weight: 700, letter-spacing: -0.5px
H4 (20px):  Titre carte - font-weight: 700
Body (16px): Texte par défaut - font-weight: 400
Label (12px): Uppercase, letter-spacing: 1px, font-weight: 700
```

### Font Family

```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Backup: System fonts for speed (no external CDN)
```

### Caractéristiques

- **Tous les headings**: Uppercase + Letter-spacing
- **Bold weights**: 900 pour H1/H2, 700 pour H3/H4
- **Letter-spacing négatif**: Création de tension visuelle
- **Line-height serré**: 1.1 pour headlines, 1.6 pour body

---

## 🔘 Composants

### Boutons

#### Primaire (Action)
```html
<button class="btn-primary">
  background: linear-gradient(135deg, #ff6b35, #d32f2f)
  color: white
  padding: 12px 24px
  font--weight: 700
  text-transform: uppercase
  border-radius: 6px
</button>
```

#### Secondaire (Alternatif)
```html
<button class="btn-secondary">
  border: 2px solid #ff6b35
  color: #ff6b35
  background: transparent
  padding: 12px 24px
</button>
```

#### Ghost (Léger)
```html
<button class="btn-ghost">
  border: 1px solid #1a1a1a
  color: #606060
  background: transparent
  hover: border-color: #d32f2f, color: #d32f2f
</button>
```

### Badges

- **Live**: Red background (#d32f2f) + white text
- **New**: Orange background (#ff6b35) + white text
- **Featured**: Orange border (#ff6b35) + semi-transparent background

### Alerts

- **Success**: Green (#4caf50) - Livraison confirmée
- **Error**: Red (#d32f2f) - Paiement échoué
- **Warning**: Orange (#ff9800) - Maintenance nécessaire

---

## 🎬 Animations & Transitions

```css
default: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
hover: translateY(-2px)
focus: outline none + ring effect
```

### Micro-interactions

- Boutons: Gradient shift + shadow elevation au hover
- Links: Underline animation (width: 0 → 100%)
- Badges: Pulse subtle sur les états "live"

---

## 📱 Responsive Breakpoints

```
Mobile:  0px → 100% stack
Tablet:  768px → 2 columns
Desktop: 1024px → 3+ columns
Wide:    1400px → Full layout
```

### Mobile-First Principles

1. Single column par défaut
2. Touch targets ≥ 44px
3. Font sizes larger on mobile
4. Padding/spacing généreux

---

## 🌓 Mode Sombre (Built-in)

Le design est optimisé pour le mode sombre. Tous les contrastes sont WCAG AA+.

```
Background: #0a0a0a (noir)
Text: #ffffff (blanc)
Muted: #606060 (gris)
```

---

## 📊 Composants Récurrents

### Hero Section
```
- Badges (NEW, LIVE)
- H1 + Highlight gradient
- Description texte (max 600px)
- Hero image/video
```

### Card Component
```
- Dark background (#1a1a1a)
- Border #1a1a1a (hover: #d32f2f)
- Title (H4)
- Description
- CTA button
```

### Navigation
```
- Sticky header
- Logo (gradient text)
- Links uppercase + underline animation
- CTA button primaire
```

---

## 🎯 Principes d'Utilisation

### DO ✅

- Utilisez le gradient orange→rouge pour les callouts majeurs
- Appliquez le letter-spacing négatif aux headlines
- Animez les interactions (hover, focus)
- Maintenez le contraste blanc/noir
- Typography bold et épurée

### DON'T ❌

- Évitez les couleurs pastelles
- Pas d'ornementation ou de motifs
- Pas de ombres douces (sauf sur CTA)
- Pas de transitions > 300ms
- Ne pas diluer le contraste

---

## 📦 Tailwind Configuration

```typescript
colors: {
  primary: { 500: '#ff6b35', /* ... */ },
  accent: { 500: '#d32f2f', /* ... */ },
  secondary: { 500: '#606060', /* ... */ },
}

fontSize: {
  xs: ['12px', { fontWeight: '700', letterSpacing: '0.5px' }],
  '5xl': ['72px', { fontWeight: '900', letterSpacing: '-2px' }],
  /* ... */
}
```

---

## 🔍 Checklist d'Implémentation

- [ ] Tous les headings uppercase avec letter-spacing
- [ ] Boutons avec gradient ou outline, pas solid
- [ ] Animations smooth (200-300ms)
- [ ] Contraste blanc/noir maintenu partout
- [ ] Badges uniquement sur live/new/featured
- [ ] Typo system respecté (H1-H4, body-lg/body/body-sm)
- [ ] Responsive testé (375px, 768px, 1024px)
- [ ] Focus states visibles (outline ou ring)
- [ ] Images optimisées (next/image)
- [ ] Pas de fonts externes (system fonts uniquement)

---

## 📚 Références

- Inspiré par: SportNews, Formula 1, Nike, Adidas design systems
- Colorimetry: WCAG AA+ contrast ratios
- Typography: Modern sportive branding trends
- Responsive: Mobile-first methodology

---

**Version**: 2.0  
**Updated**: 2026-08-02  
**Status**: Production Ready
