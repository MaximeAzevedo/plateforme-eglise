#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: 4173,
  timeout: 60000,
  reportsDir: './reports',
  testsDir: './tests'
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createReportsDir() {
  if (!fs.existsSync(CONFIG.reportsDir)) {
    fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
    log(`📁 Dossier ${CONFIG.reportsDir} créé`, 'green');
  }
}

function buildApp() {
  log('🔨 Construction de l\'application...', 'blue');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build terminé avec succès', 'green');
  } catch (error) {
    log('❌ Erreur lors du build', 'red');
    process.exit(1);
  }
}

function startPreviewServer() {
  log('🚀 Démarrage du serveur de preview...', 'blue');
  const server = spawn('npm', ['run', 'preview'], {
    stdio: 'pipe',
    detached: false
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.kill();
      reject(new Error('Timeout: Le serveur n\'a pas démarré dans les temps'));
    }, CONFIG.timeout);

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes(`localhost:${CONFIG.port}`) || output.includes(`127.0.0.1:${CONFIG.port}`)) {
        clearTimeout(timeout);
        log('✅ Serveur de preview démarré', 'green');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function runLighthouseTest() {
  log('🔍 Exécution du test Lighthouse...', 'blue');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(CONFIG.reportsDir, `lighthouse-${timestamp}.html`);
  const jsonPath = path.join(CONFIG.reportsDir, `lighthouse-${timestamp}.json`);
  
  try {
    const cmd = `npx lighthouse http://localhost:${CONFIG.port} --output=html,json --output-path=${CONFIG.reportsDir}/lighthouse-${timestamp} --chrome-flags="--headless" --quiet`;
    execSync(cmd, { stdio: 'inherit' });
    
    log(`📊 Rapport Lighthouse généré: ${reportPath}`, 'green');
    
    // Lire et analyser le rapport JSON
    if (fs.existsSync(`${jsonPath}`)) {
      const report = JSON.parse(fs.readFileSync(`${jsonPath}`, 'utf8'));
      displayLighthouseResults(report);
    }
  } catch (error) {
    log('❌ Erreur lors du test Lighthouse', 'red');
    console.error(error.message);
  }
}

function displayLighthouseResults(report) {
  log('\n📈 Résultats Lighthouse:', 'bright');
  
  const scores = report.lhr.categories;
  const metrics = report.lhr.audits;
  
  // Afficher les scores principaux
  Object.entries(scores).forEach(([key, category]) => {
    const score = Math.round(category.score * 100);
    const color = score >= 90 ? 'green' : score >= 50 ? 'yellow' : 'red';
    log(`  ${category.title}: ${score}/100`, color);
  });
  
  // Afficher les métriques Core Web Vitals
  log('\n🎯 Core Web Vitals:', 'bright');
  
  const coreMetrics = {
    'largest-contentful-paint': 'LCP',
    'first-input-delay': 'FID',
    'cumulative-layout-shift': 'CLS',
    'first-contentful-paint': 'FCP',
    'speed-index': 'Speed Index'
  };
  
  Object.entries(coreMetrics).forEach(([metricKey, label]) => {
    const metric = metrics[metricKey];
    if (metric) {
      const value = metric.displayValue || metric.numericValue;
      const score = metric.score;
      const color = score >= 0.9 ? 'green' : score >= 0.5 ? 'yellow' : 'red';
      log(`  ${label}: ${value}`, color);
    }
  });
}

async function runLoadTest() {
  log('⚡ Exécution du test de charge...', 'blue');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(CONFIG.reportsDir, `load-test-${timestamp}.json`);
  
  try {
    // Mettre à jour le fichier de config pour pointer vers le bon port
    const loadTestConfig = `
config:
  target: 'http://localhost:${CONFIG.port}'
  phases:
    - duration: 30
      arrivalRate: 2
      name: "Warm up"
    - duration: 60
      arrivalRate: 5
      name: "Load test"
  engines:
    http:
      timeout: 10

scenarios:
  - name: "Page load test"
    flow:
      - get:
          url: "/"
      - think: 1
      - get:
          url: "/#search-section"

expect:
  - statusCode: 200
  - maxResponseTime: 3000
`;

    fs.writeFileSync(path.join(CONFIG.testsDir, 'quick-load-test.yml'), loadTestConfig);
    
    const cmd = `npx artillery run ${CONFIG.testsDir}/quick-load-test.yml --output ${reportPath}`;
    execSync(cmd, { stdio: 'inherit' });
    
    log(`📊 Rapport de charge généré: ${reportPath}`, 'green');
    
    // Analyser les résultats
    if (fs.existsSync(reportPath)) {
      const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      displayLoadTestResults(results);
    }
  } catch (error) {
    log('❌ Erreur lors du test de charge', 'red');
    console.error(error.message);
  }
}

function displayLoadTestResults(results) {
  log('\n⚡ Résultats du test de charge:', 'bright');
  
  const summary = results.aggregate;
  
  log(`  Requêtes totales: ${summary.counters['http.requests']}`, 'cyan');
  log(`  Réponses 200: ${summary.counters['http.responses']}`, 'green');
  
  if (summary.counters['http.codes.200']) {
    log(`  Succès: ${summary.counters['http.codes.200']}`, 'green');
  }
  
  if (summary.summaries && summary.summaries['http.response_time']) {
    const responseTime = summary.summaries['http.response_time'];
    log(`  Temps de réponse moyen: ${responseTime.mean.toFixed(2)}ms`, 'cyan');
    log(`  Temps de réponse max: ${responseTime.max}ms`, 'yellow');
    log(`  P95: ${responseTime.p95}ms`, 'cyan');
    log(`  P99: ${responseTime.p99}ms`, 'cyan');
  }
  
  if (summary.rates && summary.rates['http.request_rate']) {
    log(`  Taux de requêtes: ${summary.rates['http.request_rate'].toFixed(2)} req/sec`, 'cyan');
  }
}

async function runPerformanceTests() {
  let server = null;
  
  try {
    log('🚀 Début des tests de performance pour GOD × CONNECT', 'bright');
    
    // Créer le dossier de rapports
    createReportsDir();
    
    // Build de l'application
    buildApp();
    
    // Démarrer le serveur
    server = await startPreviewServer();
    
    // Attendre que le serveur soit prêt
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tests Lighthouse
    await runLighthouseTest();
    
    // Tests de charge
    await runLoadTest();
    
    log('\n✅ Tous les tests de performance terminés!', 'green');
    log(`📁 Rapports disponibles dans: ${CONFIG.reportsDir}`, 'cyan');
    
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    if (server) {
      log('🛑 Arrêt du serveur...', 'yellow');
      server.kill();
    }
  }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--lighthouse-only')) {
  (async () => {
    createReportsDir();
    const server = await startPreviewServer();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await runLighthouseTest();
    server.kill();
  })();
} else if (args.includes('--load-only')) {
  (async () => {
    createReportsDir();
    const server = await startPreviewServer();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await runLoadTest();
    server.kill();
  })();
} else {
  runPerformanceTests();
} 