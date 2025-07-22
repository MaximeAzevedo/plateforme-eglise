# 📊 Tests de Performance - GOD × CONNECT

## 🎯 Vue d'ensemble

Ce projet inclut un système complet de tests de performance pour assurer une expérience utilisateur optimale.

## 🧪 Types de Tests Disponibles

### 1. **Core Web Vitals (Lighthouse)**
- **LCP** (Largest Contentful Paint) - Temps de chargement
- **FID** (First Input Delay) - Réactivité
- **CLS** (Cumulative Layout Shift) - Stabilité visuelle

### 2. **Tests de Charge (Artillery)**
- Simulation d'utilisateurs simultanés
- Montée en charge progressive
- Mesure des temps de réponse

### 3. **Analyse du Bundle**
- Taille des fichiers
- Optimisation des imports
- Détection de code mort

## 🚀 Commandes Rapides

```bash
# Test complet (build + lighthouse + charge)
node scripts/performance-test.mjs

# Lighthouse uniquement
node scripts/performance-test.mjs --lighthouse-only

# Test de charge uniquement
node scripts/performance-test.mjs --load-only

# Analyse du bundle
npm run perf:bundle-analyze
```

## 📈 Derniers Résultats (Référence)

### Build Performance
- **Temps de build** : 1.68s
- **Taille totale** : ~700KB
- **Compression gzip** : ~60% de réduction

### Tests de Charge
- **Requêtes testées** : 720
- **Taux de succès** : 100%
- **Temps de réponse moyen** : 0.8ms
- **P95** : 2ms | **P99** : 4ms

### Monitoring Intégré
- Web Vitals en temps réel (mode dev)
- Scores automatiques dans la console
- Métriques détaillées dans les rapports

## 📁 Fichiers Importants

```
├── scripts/performance-test.mjs    # Script principal
├── src/utils/performance.ts        # Monitoring intégré
├── tests/load-test.yml            # Config tests de charge
└── reports/                       # Rapports générés
    ├── lighthouse-*.html          # Rapports visuels
    ├── lighthouse-*.json          # Données brutes
    └── load-test-*.json          # Résultats de charge
```

## 🛠️ Configuration

### Monitoring Automatique
Le monitoring des Core Web Vitals est activé automatiquement en mode développement. Consultez la console du navigateur pour voir les métriques en temps réel.

### Seuils de Performance
```typescript
const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },     // ms
  fid: { good: 100, poor: 300 },       // ms  
  cls: { good: 0.1, poor: 0.25 },      // score
  fcp: { good: 1800, poor: 3000 },     // ms
  ttfb: { good: 800, poor: 1800 }      // ms
}
```

## 🎯 Bonnes Pratiques

1. **Testez régulièrement** - Notamment après ajout de nouvelles features
2. **Surveillez les régressions** - Comparez avec les rapports précédents
3. **Optimisez en continu** - Utilisez les suggestions Lighthouse
4. **Mesurez l'impact** - Avant/après chaque optimisation

## 🔧 Dépendances

### Packages de Test
- `lighthouse` - Audit de performance
- `artillery` - Tests de charge
- `web-vitals` - Monitoring temps réel
- `vite-bundle-analyzer` - Analyse du bundle

### Installation
```bash
npm install -D lighthouse artillery web-vitals vite-bundle-analyzer
```

## 📞 Support

Pour toute question sur les tests de performance, consultez :
- Les rapports dans `/reports/`
- La console du navigateur (mode dev)
- Ce fichier de documentation

---

**Dernière mise à jour** : Janvier 2025
**Version du système** : 1.0.0 