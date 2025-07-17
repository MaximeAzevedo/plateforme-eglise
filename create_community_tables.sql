-- ==========================================
-- CRÉATION DES TABLES COMMUNAUTAIRES
-- GOD × CONNECT - Fonctionnalités Témoignages & Prières
-- ==========================================

-- Table des témoignages
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('healing', 'transformation', 'provision', 'guidance', 'protection', 'breakthrough', 'salvation', 'deliverance', 'restoration', 'calling', 'miracle')),
  description TEXT NOT NULL,
  before_situation TEXT NOT NULL,
  after_situation TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  denomination TEXT,
  location TEXT,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes de prière
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('health', 'family', 'work', 'guidance', 'protection', 'gratitude', 'spiritual-growth', 'relationships', 'breakthrough', 'provision', 'salvation')),
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'ongoing')),
  duration TEXT DEFAULT '7days' CHECK (duration IN ('7days', '30days', '90days', 'ongoing')),
  is_anonymous BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  first_name TEXT,
  location TEXT,
  prayer_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interactions utilisateur (likes, prières, etc.)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session TEXT NOT NULL, -- Pour l'instant on utilise un ID de session
  item_type TEXT NOT NULL CHECK (item_type IN ('testimony', 'prayer')),
  item_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('like', 'pray', 'share')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commentaires (pour plus tard)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('testimony', 'prayer')),
  item_id UUID NOT NULL,
  user_session TEXT NOT NULL,
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_testimonies_type ON testimonies(type);
CREATE INDEX IF NOT EXISTS idx_testimonies_created_at ON testimonies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonies_verified ON testimonies(is_verified);

CREATE INDEX IF NOT EXISTS idx_prayers_type ON prayer_requests(type);
CREATE INDEX IF NOT EXISTS idx_prayers_urgency ON prayer_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_prayers_active ON prayer_requests(is_active);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayer_requests(created_at DESC);

-- Fonctions pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_testimonies_updated_at 
    BEFORE UPDATE ON testimonies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at 
    BEFORE UPDATE ON prayer_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données de démonstration pour testimonies
INSERT INTO testimonies (title, type, description, before_situation, after_situation, timeframe, is_anonymous, tags, denomination, location, likes, is_verified, verified_by) VALUES
('Guérison miraculeuse de ma fille', 'healing', 'Ma fille de 8 ans était dans le coma après un accident. Après 3 semaines de prières intensives de toute notre communauté, elle s''est réveillée sans séquelles. Les médecins parlent de miracle médical.', 'Ma fille était dans le coma, les médecins avaient perdu espoir', 'Elle est complètement rétablie, plus joyeuse que jamais', '3 semaines', false, ARRAY['famille', 'enfant', 'hôpital', 'miracle'], 'Catholic', 'Metz, France', 234, true, 'Père Michel - Paroisse Saint-Pierre'),

('Restauration de mon mariage', 'restoration', 'Après 15 ans de mariage, nous étions au bord du divorce. Grâce aux prières de notre groupe de couple et un travail spirituel profond, notre amour s''est renouvelé.', 'Couple en crise, procédure de divorce entamée', 'Mariage restauré, plus fort qu''avant', '8 mois', false, ARRAY['mariage', 'couple', 'restauration'], 'Protestant', 'Nancy, France', 156, true, 'Pasteur David - Église Évangélique'),

('Provision financière inattendue', 'provision', 'Entrepreneur en difficulté, j''étais sur le point de fermer mon entreprise. Après avoir confié mes soucis au Seigneur, j''ai reçu un contrat qui a tout changé.', 'Entreprise en faillite, dettes importantes', 'Entreprise prospère, dettes remboursées', '6 mois', true, ARRAY['travail', 'finances', 'entreprise'], null, 'Moselle, France', 89, false, null);

-- Données de démonstration pour prayer_requests
INSERT INTO prayer_requests (title, type, description, urgency, duration, is_anonymous, tags, first_name, location, prayer_count, is_active) VALUES
('Prière pour ma famille', 'family', 'Ma famille traverse une période difficile. Merci de prier pour la réconciliation et la paix.', 'urgent', '30days', false, ARRAY['famille', 'réconciliation'], 'Marie', 'Metz', 47, true),

('Guérison pour mon père', 'health', 'Mon père est hospitalisé. Prions ensemble pour sa guérison complète.', 'urgent', 'ongoing', false, ARRAY['santé', 'famille', 'hôpital'], 'Jean', 'Nancy', 156, true),

('Direction pour ma carrière', 'guidance', 'Je dois prendre une décision importante concernant mon avenir professionnel. Merci de prier pour la sagesse.', 'normal', '7days', true, ARRAY['travail', 'décision'], null, 'Moselle', 23, true),

('Protection pour mon voyage missionnaire', 'protection', 'Je pars en mission humanitaire dans une zone à risque. Prions pour la protection divine.', 'normal', '90days', false, ARRAY['mission', 'voyage', 'protection'], 'Paul', 'Thionville', 34, true);

-- Activer RLS (Row Level Security) pour la sécurité
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (pour l'instant tout en lecture publique)
CREATE POLICY "Public read access on testimonies" ON testimonies FOR SELECT USING (true);
CREATE POLICY "Public read access on prayer_requests" ON prayer_requests FOR SELECT USING (true);

-- Pour l'insertion, on accepte tout pour l'instant (à sécuriser plus tard)
CREATE POLICY "Public insert access on testimonies" ON testimonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access on prayer_requests" ON prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access on user_interactions" ON user_interactions FOR INSERT WITH CHECK (true); 