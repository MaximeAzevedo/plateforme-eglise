-- Script de migration simple et sûr
-- À exécuter dans Supabase SQL Editor

-- 1. Créer la nouvelle table BDD
CREATE TABLE IF NOT EXISTS "BDD" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "Nom" TEXT NOT NULL,
  "Dénomination" TEXT NOT NULL,
  "Rue" TEXT NOT NULL,
  "Département" TEXT NOT NULL,
  "Ville" TEXT NOT NULL,
  "Code Postal" TEXT NOT NULL,
  "Horaires d'ouverture (général)" TEXT DEFAULT 'Voir horaires des célébrations',
  "Site Web" TEXT,
  "Heures des cultes et prières" JSONB NOT NULL,
  "Latitude" DECIMAL(10,7),
  "Longitude" DECIMAL(10,7),
  "Accessible" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Migrer les données une par une pour éviter les erreurs JSON
-- D'abord, insérer les données avec des horaires par défaut
INSERT INTO "BDD" (
  "Nom",
  "Dénomination", 
  "Rue",
  "Département",
  "Ville",
  "Code Postal",
  "Horaires d'ouverture (général)",
  "Site Web",
  "Heures des cultes et prières",
  "Latitude",
  "Longitude",
  "Accessible"
)
SELECT 
  -- Corriger le nom du contributeur
  CASE 
    WHEN "Nom" = 'Maxime De Azevedo' THEN 'Église de ' || "Ville"
    ELSE "Nom"
  END as "Nom",
  
  "Dénomination",
  "Rue",
  "Département",
  "Ville",
  "Code Postal",
  'Voir horaires des célébrations',
  "Site Web",
  
  -- Horaires par défaut en JSON simple
  '[{"type":"Messe/Culte principal","day":"Dimanche","startTime":"10:00","endTime":"11:00"}]'::JSONB,
  
  -- Coordonnées
  CASE 
    WHEN "Latitude" IS NOT NULL AND "Latitude" != '' THEN "Latitude"::DECIMAL(10,7)
    ELSE NULL
  END,
  
  CASE 
    WHEN "Longitude" IS NOT NULL AND "Longitude" != '' THEN "Longitude"::DECIMAL(10,7)
    ELSE NULL
  END,
  
  -- Accessibilité
  CASE 
    WHEN "Accessible" = 'true' THEN true
    ELSE false
  END

FROM "Base de donnée"
WHERE "Nom" IS NOT NULL AND "Ville" IS NOT NULL;

-- 3. Politiques de sécurité
ALTER TABLE "BDD" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON "BDD"
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON "BDD"
  FOR INSERT WITH CHECK (true);

-- 4. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_bdd_denomination ON "BDD"("Dénomination");
CREATE INDEX IF NOT EXISTS idx_bdd_ville ON "BDD"("Ville");
CREATE INDEX IF NOT EXISTS idx_bdd_departement ON "BDD"("Département");
CREATE INDEX IF NOT EXISTS idx_bdd_coordinates ON "BDD"("Latitude", "Longitude");

-- 5. Fonction et trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bdd_updated_at 
    BEFORE UPDATE ON "BDD" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 