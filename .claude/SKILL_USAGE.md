# Frontend Design Skill - Mode d'Emploi

## ✅ Installation Complète

Le skill `frontend-design` d'Anthropic est maintenant installé et configuré pour le projet Afro Sport.

```
.claude/
├── settings.json                    # Configuration du skill
└── skills/
    └── frontend-design/
        ├── SKILL.md                 # Skill complet
        └── LICENSE.txt
```

---

## 🎨 Utilisation du Skill

### Pour des changements de design frontend

Quand tu besoin de refaire un design, améliorer l'UI, ou créer une nouvelle page, utilise :

```
/frontend-design
```

Puis décris ce que tu veux :
- **Sujet** : Le type de page/composant (homepage, formulaire, dashboard, etc.)
- **Audience** : Qui va utiliser (transporteurs, clients, admin)
- **Objectif** : Qu'est-ce que la page doit faire/montrer
- **Contraintes** : Technologies, couleurs, références

### Exemple d'utilisation

```
/frontend-design

Créer une page de détail de livraison avec:
- Sujet: Tracking de colis en temps réel
- Audience: Clients qui attendent leur livraison
- Objectif: Montrer le GPS, ETA, informations du transporteur
- Style: Utiliser la palette Afro Sport (noir/orange/red)
- Références: Design sportif moderne, Eurosport
```

---

## 🧠 Principe du Skill

Le skill guide les décisions de design selon ces principes :

### 1. **Ground it in the Subject**
- Comprendre le sujet (livraison, transport)
- Utiliser le langage du domaine
- Faire des choix intentionnels basés sur le contexte

### 2. **Design Principles**
- **Hero = Thesis** : La partie la plus importante en premier
- **Typography carries personality** : Font choices définissent l'identité
- **Structure is information** : Pas de décoration gratuite
- **Lever motion deliberately** : Animations au service de la UX
- **Match complexity to vision** : Élégance dans l'exécution

### 3. **Process**
```
Brainstorm → Explore → Plan → Critique → Build → Critique Again
```

### 4. **Avoid Defaults**
Pas de:
- Cream background (#F4F1EA) + serif display + terracotta
- Near-black + acid-green accent
- Broadsheet hairline rules + dense columns

À moins que ce soit intentionnel pour TON projet.

### 5. **Spend Boldness in One Place**
- 1 signature element mémorable
- Tout autour: quiet et discipliné
- Couper les décorations inutiles

---

## 🎯 Checklist Design (du Skill)

- [ ] Palette définie (4-6 couleurs nommées)
- [ ] Typographie choisie (display + body + utility faces)
- [ ] Layout concept en 1-2 phrases
- [ ] Signature element identifié (ce qui rend unique)
- [ ] Plan review : Pas de defaults ?
- [ ] Hero = Thesis (élément le plus caractéristique)
- [ ] Structure is information (rien de purement décoratif)
- [ ] Copy intentionnel (pas de placeholder)
- [ ] Responsive testé (mobile → tablet → desktop)
- [ ] Accessibility (keyboard focus, reduced motion)

---

## 📚 Configuration Actuelle (Afro Sport)

Basée sur le work fait précédemment :

**Palette** : Noir (#0a0a0a), Blanc, Orange (#ff6b35), Red (#d32f2f)

**Typography** : 
- Display: Headings bold (H1: 72px, 900-weight, -2px letter-spacing)
- Body: System fonts, 16px default
- Utility: 12px caps for labels

**Layout** : 
- Grid responsive (1 → 2 → 3 → 4 colonnes)
- Max-width: 1400px
- Padding stratégique (32px desktop, 16px mobile)

**Signature** : 
- Gradient orange→red sur boutons/accents
- Typography agressive (uppercase, negative letter-spacing)
- Bold contrasts (noir/blanc dominant)

---

## 🚀 Intégration avec le Projet

Le skill est maintenant disponible pour :
1. Valider les choix de design existants
2. Guider les nouvelles pages/features
3. Améliorer la cohérence visuelle
4. Prendre des risques esthétiques calculés

Pour utiliser, invoke simplement : `/frontend-design`

---

**Status** : ✅ Skill installé et prêt  
**Version** : Anthropic Official  
**License** : Voir LICENSE.txt
