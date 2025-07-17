# Guide de Modération - GOD × CONNECT

## 🛡️ Système de Modération Intégré

Le système de modération de GOD × CONNECT assure un contrôle qualité sur tous les contenus communautaires (témoignages et demandes de prière) avant leur publication.

## 📋 Fonctionnalités Implémentées

### 1. **Modération Préventive**
- ✅ **Statut par défaut** : Tout nouveau contenu est en statut `pending`
- ✅ **Validation requise** : Aucun contenu n'apparaît sans approbation
- ✅ **Politiques RLS** : Seuls les contenus `approved` sont visibles publiquement

### 2. **Tableau de Modération**
- ✅ **Interface dédiée** : `/admin` - Tableau de bord complet
- ✅ **Authentification** : Mot de passe temporaire `god-connect-admin-2024`
- ✅ **Gestion en temps réel** : Statistiques et actions directes
- ✅ **Tri par urgence** : Priorisation des contenus urgents

### 3. **Actions de Modération**
- ✅ **Approuver** : Publier le contenu immédiatement
- ✅ **Rejeter** : Refuser avec raison obligatoire
- ✅ **Historique** : Traçabilité complète (qui, quand, pourquoi)

### 4. **Signalement Communautaire**
- ✅ **Bouton de signalement** : Sur chaque contenu publié
- ✅ **Catégories** : 7 types de signalements définis
- ✅ **File d'attente** : Intégration dans le système de modération
- ✅ **Priorisation automatique** : Urgence élevée pour haine/violence

## 🗄️ Structure de Base de Données

### Tables Principales

```sql
-- Statuts de modération
testimonies.status: 'pending' | 'approved' | 'rejected'
prayer_requests.status: 'pending' | 'approved' | 'rejected'

-- File de modération
moderation_queue: signalements et rapports
user_interactions: likes, prières, signalements
```

### Métriques et Compteurs
- **Compteurs automatiques** : Likes et prières via triggers
- **Statistiques temps réel** : Contenus en attente
- **Historique complet** : Toutes les actions de modération

## 🚀 Accès au Système

### Pour les Administrateurs
1. **Accéder à** : `http://localhost:5173/admin`
2. **Mot de passe** : `god-connect-admin-2024`
3. **Modérer** : Approuver/Rejeter les contenus

### Pour les Utilisateurs
1. **Signaler** : Cliquer sur l'icône drapeau
2. **Choisir la raison** : 7 catégories disponibles
3. **Ajouter détails** : Description optionnelle

## ⚙️ Configuration et Sécurité

### Politiques de Sécurité (RLS)
```sql
-- Lecture : Seuls les contenus approuvés
CREATE POLICY "Allow reading approved testimonies" ON testimonies
    FOR SELECT USING (status = 'approved');

-- Écriture : Insertion libre (modération après)
CREATE POLICY "Allow inserting testimonies" ON testimonies
    FOR INSERT WITH CHECK (true);
```

### Authentification (À Améliorer)
- **Actuel** : Mot de passe simple en localStorage
- **Production** : Intégrer Supabase Auth avec rôles
- **Recommandé** : Authentification à 2 facteurs

## 📊 Métriques et Surveillance

### Indicateurs Clés
- **Contenus en attente** : Affichage temps réel
- **Temps de modération** : Moyenne de traitement
- **Taux d'approbation** : Qualité des soumissions
- **Signalements** : Volume et types

### Optimisations Futures
- **Modération automatique** : IA pour pré-filtrage
- **Notifications** : Alertes en temps réel
- **Historique utilisateur** : Réputation et confiance
- **Modération collaborative** : Plusieurs modérateurs

## 🛠️ Maintenance et Support

### Commandes Utiles

```sql
-- Voir les contenus en attente
SELECT * FROM testimonies WHERE status = 'pending';
SELECT * FROM prayer_requests WHERE status = 'pending';

-- Statistiques de modération
SELECT status, COUNT(*) FROM testimonies GROUP BY status;
SELECT status, COUNT(*) FROM prayer_requests GROUP BY status;

-- Signalements actifs
SELECT * FROM moderation_queue WHERE status = 'pending';
```

### Sauvegarde et Restauration
- **Données critiques** : Tables de contenu et modération
- **Configuration** : Politiques RLS et contraintes
- **Historique** : Logs de modération pour audit

## 🔮 Roadmap de Modération

### Phase 1 : ✅ Complétée
- Modération manuelle basique
- Interface admin
- Signalements utilisateurs

### Phase 2 : 🎯 Prochaine
- Authentification robuste
- Notifications temps réel
- Analytics avancées

### Phase 3 : 🚀 Future
- IA de modération
- Modération collaborative
- API de modération

---

**Note** : Ce système offre une base solide pour un contrôle qualité efficace tout en restant flexible pour les évolutions futures. 