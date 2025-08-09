-- ==========================================
-- SCRIPT SQL CORRIGÉ POUR CORRESPONDRE AU CODE REACT
-- GOD × CONNECT - Tables Communautaires
-- ==========================================

-- Table des témoignages (corrigée pour matcher le code)
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Le code utilise 'content', pas 'description'
  type TEXT DEFAULT 'transformation',
  location TEXT,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_by TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes de prière (corrigée pour matcher le code)
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Le code utilise 'content', pas 'description'
  category TEXT DEFAULT 'general', -- Le code utilise 'category', pas 'type'
  is_urgent BOOLEAN DEFAULT false, -- Le code utilise 'is_urgent', pas 'urgency'
  is_anonymous BOOLEAN DEFAULT false,
  prayer_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  date_requested TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Le code PrayerWall utilise ce champ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interactions utilisateur
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('testimony', 'prayer')),
  item_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('like', 'pray', 'share')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commentaires (préparée pour plus tard)
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

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_testimonies_status ON testimonies(status);
CREATE INDEX IF NOT EXISTS idx_testimonies_created_at ON testimonies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonies_verified ON testimonies(is_verified);

CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayer_requests(category);
CREATE INDEX IF NOT EXISTS idx_prayers_urgent ON prayer_requests(is_urgent);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayer_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayers_date_requested ON prayer_requests(date_requested DESC);

-- Fonction pour mise à jour automatique du timestamp
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

-- Activer RLS (Row Level Security)
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (lecture publique, insertion publique pour commencer)
CREATE POLICY "Public read access on testimonies" ON testimonies FOR SELECT USING (true);
CREATE POLICY "Public read access on prayer_requests" ON prayer_requests FOR SELECT USING (true);

CREATE POLICY "Public insert access on testimonies" ON testimonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access on prayer_requests" ON prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access on user_interactions" ON user_interactions FOR INSERT WITH CHECK (true);

-- Politiques de mise à jour pour la modération
CREATE POLICY "Admin update access on testimonies" ON testimonies FOR UPDATE USING (true);
CREATE POLICY "Admin update access on prayer_requests" ON prayer_requests FOR UPDATE USING (true);

-- Données de démonstration pour tester
INSERT INTO testimonies (user_name, user_email, title, content, type, location, status, is_verified) VALUES
('Marie Dupont', 'marie@exemple.com', 'Guérison miraculeuse', 'Ma fille était très malade, après beaucoup de prières elle va mieux.', 'healing', 'Metz, France', 'approved', true),
('Jean Martin', 'jean@exemple.com', 'Transformation de vie', 'Ma vie a complètement changé grâce à la foi.', 'transformation', 'Nancy, France', 'approved', true),
('Anonyme', null, 'Provision financière', 'Dans une période difficile, j''ai reçu une aide inattendue.', 'provision', 'Moselle, France', 'pending', false);

INSERT INTO prayer_requests (user_name, user_email, title, content, category, is_urgent, is_anonymous, prayer_count, status) VALUES
('Paul Durand', 'paul@exemple.com', 'Prière pour ma famille', 'Ma famille traverse une période difficile, merci de prier.', 'family', true, false, 15, 'approved'),
('Marie Claire', 'marie@exemple.com', 'Guérison pour mon père', 'Mon père est hospitalisé, prions pour sa guérison.', 'health', true, false, 23, 'approved'),
('Anonyme', null, 'Direction spirituelle', 'Je cherche la volonté de Dieu pour ma vie.', 'spiritual', false, true, 8, 'pending');

-- Message de confirmation
SELECT 'Tables créées avec succès ! Vous pouvez maintenant tester l''application.' as message; 