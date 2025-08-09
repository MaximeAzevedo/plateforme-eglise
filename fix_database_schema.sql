-- ==========================================
-- CORRECTIFS BASE DE DONNÉES COMMUNAUTAIRE
-- Applique les ajustements nécessaires aux tables existantes
-- ==========================================

-- 1. CORRIGER LA CONTRAINTE user_email (permettre NULL)
ALTER TABLE testimonies ALTER COLUMN user_email DROP NOT NULL;
ALTER TABLE prayer_requests ALTER COLUMN user_email DROP NOT NULL;

-- 2. AJOUTER LES COLONNES MANQUANTES dans testimonies
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'transformation';
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS before_situation TEXT;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS after_situation TEXT;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS timeframe TEXT;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS denomination TEXT;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE testimonies ADD COLUMN IF NOT EXISTS verified_by TEXT;

-- 3. AJOUTER LES COLONNES MANQUANTES dans prayer_requests  
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'normal';
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '7days';
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 4. CRÉER LA TABLE user_interactions (manquante)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('testimony', 'prayer')),
  item_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('like', 'pray', 'share')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRÉER LA TABLE comments (manquante)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('testimony', 'prayer')),
  item_id UUID NOT NULL,
  user_session TEXT NOT NULL,
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AJOUTER LES INDEX MANQUANTS
CREATE INDEX IF NOT EXISTS idx_testimonies_type ON testimonies(type);
CREATE INDEX IF NOT EXISTS idx_testimonies_status ON testimonies(status);
CREATE INDEX IF NOT EXISTS idx_testimonies_created_at ON testimonies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayer_requests(category);
CREATE INDEX IF NOT EXISTS idx_prayers_urgent ON prayer_requests(is_urgent);
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayer_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_interactions_item ON user_interactions(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session ON user_interactions(user_session);

-- 7. ACTIVER RLS sur les nouvelles tables
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 8. POLITIQUES RLS pour les nouvelles tables
CREATE POLICY "Public read access on user_interactions" ON user_interactions FOR SELECT USING (true);
CREATE POLICY "Public insert access on user_interactions" ON user_interactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access on comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public insert access on comments" ON comments FOR INSERT WITH CHECK (true);

-- 9. METTRE À JOUR LES TRIGGERS
CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. SYNCHRONISER les données existantes
-- Mettre à jour likes_count vers likes si nécessaire
UPDATE testimonies SET likes = COALESCE(likes_count, 0) WHERE likes IS NULL;

-- 11. DONNÉES DE TEST SUPPLÉMENTAIRES
INSERT INTO testimonies (user_name, title, content, type, status, is_verified) VALUES
('Jean Testimoine', 'Transformation de vie', 'Ma vie a complètement changé grâce à la prière.', 'transformation', 'approved', true),
('Marie Guérison', 'Guérison miraculeuse', 'Guérison inattendue après une longue maladie.', 'healing', 'approved', true),
('Paul Provision', 'Provision divine', 'Aide financière reçue dans un moment difficile.', 'provision', 'pending', false);

INSERT INTO prayer_requests (user_name, title, content, category, is_urgent, status) VALUES
('Pierre Prière', 'Prière pour ma famille', 'Ma famille traverse une période difficile.', 'family', true, 'approved'),
('Sophie Santé', 'Guérison de mon père', 'Mon père est hospitalisé, prions pour lui.', 'health', true, 'approved'),
('Anonyme', 'Direction spirituelle', 'Je cherche la volonté de Dieu pour ma carrière.', 'guidance', false, 'pending');

-- Message de confirmation
SELECT '✅ Base de données corrigée avec succès !' as message;
SELECT '📊 Tables testimonies et prayer_requests mises à jour' as info;
SELECT '🔧 Nouvelles tables user_interactions et comments créées' as info2;
SELECT '🛡️ Politiques RLS appliquées' as info3; 