-- Script de migration corrigé pour adapter la base de données au nouveau formulaire
-- À exécuter dans Supabase SQL Editor

-- 1. Créer une nouvelle table avec la structure correcte
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

-- 2. Migrer les données existantes de "Base de donnée" vers "BDD"
INSERT INTO "BDD" (
  "id",
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
  CASE 
    WHEN "id" IS NULL OR "id" = '' THEN gen_random_uuid()
    ELSE "id"::UUID
  END as "id",
  
  -- Corriger le problème du nom du contributeur
  CASE 
    WHEN "Nom" = 'Maxime De Azevedo' THEN 
      CASE 
        WHEN "Dénomination" = 'Catholique' AND "Rue" = '14 rue mozart' THEN 'Église Saint-Pierre'
        ELSE "Dénomination" || ' de ' || "Ville"
      END
    ELSE "Nom"
  END as "Nom",
  
  "Dénomination",
  "Rue",
  "Département",
  "Ville",
  "Code Postal",
  
  COALESCE("Horaires d'ouverture (général)", 'Voir horaires des célébrations') as "Horaires d'ouverture (général)",
  
  "Site Web",
  
  -- Convertir les horaires existants en format JSON (syntaxe corrigée)
  CASE 
    WHEN "Heures des cultes et prières" IS NULL OR "Heures des cultes et prières" = '' THEN 
      '[{"type":"Messe/Culte principal","day":"Dimanche","startTime":"10:00","endTime":"11:00"}]'::JSONB
    WHEN "Heures des cultes et prières"::TEXT LIKE '[%' THEN 
      -- Déjà en format JSON, on garde tel quel mais on nettoie les échappements
      REPLACE(REPLACE("Heures des cultes et prières"::TEXT, '\"', '"'), '\\', '')::JSONB
    ELSE 
      -- Convertir le texte en format JSON
      CASE 
        WHEN "Heures des cultes et prières" LIKE '%Dimanche%' THEN
          '[{"type":"Messe/Culte principal","day":"Dimanche","startTime":"10:00","endTime":"11:00"}]'::JSONB
        WHEN "Heures des cultes et prières" LIKE '%quotidienne%' OR "Heures des cultes et prières" LIKE '%semaine%' THEN
          '[{"type":"Messe en semaine","day":"Lundi","startTime":"08:00","endTime":"09:00"},{"type":"Messe/Culte principal","day":"Dimanche","startTime":"10:00","endTime":"11:00"}]'::JSONB
        ELSE 
          '[{"type":"Messe/Culte principal","day":"Dimanche","startTime":"10:00","endTime":"11:00"}]'::JSONB
      END
  END as "Heures des cultes et prières",
  
  -- Convertir les coordonnées
  CASE 
    WHEN "Latitude" IS NULL OR "Latitude" = '' THEN NULL
    ELSE "Latitude"::DECIMAL(10,7)
  END as "Latitude",
  
  CASE 
    WHEN "Longitude" IS NULL OR "Longitude" = '' THEN NULL
    ELSE "Longitude"::DECIMAL(10,7)
  END as "Longitude",
  
  -- Convertir l'accessibilité
  CASE 
    WHEN "Accessible" = 'true' OR "Accessible" = 'Oui' THEN true
    WHEN "Accessible" = 'false' OR "Accessible" = 'Non' THEN false
    ELSE false
  END as "Accessible"

FROM "Base de donnée"
WHERE "Nom" IS NOT NULL AND "Ville" IS NOT NULL;

-- 3. Ajouter des politiques RLS (Row Level Security) si nécessaire
ALTER TABLE "BDD" ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access" ON "BDD"
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion à tous (pour le formulaire)
CREATE POLICY "Allow public insert access" ON "BDD"
  FOR INSERT WITH CHECK (true);

-- 4. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_bdd_denomination ON "BDD"("Dénomination");
CREATE INDEX IF NOT EXISTS idx_bdd_ville ON "BDD"("Ville");
CREATE INDEX IF NOT EXISTS idx_bdd_departement ON "BDD"("Département");
CREATE INDEX IF NOT EXISTS idx_bdd_coordinates ON "BDD"("Latitude", "Longitude");

-- 5. Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Créer le trigger pour updated_at
CREATE TRIGGER update_bdd_updated_at 
    BEFORE UPDATE ON "BDD" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 