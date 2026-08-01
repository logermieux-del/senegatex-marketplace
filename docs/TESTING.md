# Testing Guide - Yombal

## Unit Tests (Vitest)

Test les fonctions utilitaires, validateurs, etc.

```bash
# Run once
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage
```

## E2E Tests (Playwright)

Test le flux complet: inscription → création annonce → achat → paiement

### Installation

```bash
npm run test:e2e
```

Cela installe les navigateurs Playwright (Chromium, Firefox, WebKit).

### Lancer les tests

**Mode headless (sans UI):**
```bash
npm run test:e2e
```

**Mode UI (voir le navigateur):**
```bash
npm run test:e2e:ui
```

**Test spécifique:**
```bash
npx playwright test tests/e2e/auth.spec.ts
```

**Avec débuggage:**
```bash
npx playwright test --debug
```

### Ce que les tests vérifient

1. **auth.spec.ts** — Authentification
   - Signup avec credentials valides
   - Erreur sur email dupliqué
   - Login avec credentials valides
   - Erreur sur credentials invalides

2. **listings.spec.ts** — Annonces
   - Affichage des listings
   - Vue détail
   - Recherche
   - Filtrage par ville
   - Créer une annonce (logged in)

3. **checkout.spec.ts** — Paiements
   - Checkout avec Stripe
   - Checkout avec Wave
   - Erreur si info manquante
   - Vérification prix

4. **search-messages.spec.ts** — Recherche & Messages
   - Chercher par keyword
   - Gestion recherche vide
   - No results
   - Voir messages (logged in)
   - Envoyer message

### Structure des tests

```typescript
test('should do something', async ({ page }) => {
  // 1. Navigate
  await page.goto('http://localhost:3000');

  // 2. Interact
  await page.click('button');
  await page.fill('input', 'text');

  // 3. Assert
  await expect(page).toHaveURL('/expected-url');
  await expect(page.locator('text')).toBeVisible();
});
```

### Debugging Tips

**Pause à un point précis:**
```typescript
await page.pause();
```

**Voir les logs du navigateur:**
```typescript
page.on('console', msg => console.log(msg.text()));
```

**Prendre screenshot:**
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

**Voir traces:**
Les traces sont automatiquement prises en cas d'erreur. Ouvrez-les:
```bash
npx playwright show-trace trace.zip
```

### Avant de lancer les tests

1. **Démarrer le serveur dev:**
   ```bash
   npm run dev
   ```

2. **Seed la DB (optional, tests utilisent seed data):**
   ```bash
   npm run db:seed
   ```

3. **Lancer les tests:**
   ```bash
   npm run test:e2e
   ```

### CI/CD (GitHub Actions)

Les tests tournent automatiquement sur chaque commit:
- `.github/workflows/test.yml` — Lance lint + tests E2E

Si un test échoue → PR bloquée jusqu'à réparation.

### Ajouter des tests

Créez un fichier `tests/e2e/feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // ... test code
  });
});
```

### Performance Tests

Vérifiez les Core Web Vitals:
```bash
npm run lighthouse
```

Cibles:
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Performance ≥ 85%

---

## Troubleshooting

**Tests timeout:**
- Vérifiez que le serveur tourne: `npm run dev`
- Augmentez timeout: `test.setTimeout(60000)`

**Élément non trouvé:**
- Utilisez `page.pause()` pour déboguer
- Vérifiez les sélecteurs avec Chrome DevTools

**Base de données vide:**
- Lancez: `npm run db:seed`
- Ou utilisez les fixtures Playwright

---

**Last Updated:** 2026-07-31
