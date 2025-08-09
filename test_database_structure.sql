-- ==========================================
-- SCRIPT DE TEST - STRUCTURE DES TABLES
-- ==========================================

-- Vérifier la structure de la table testimonies
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'testimonies'
ORDER BY ordinal_position;

-- Vérifier la structure de la table prayer_requests  
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'prayer_requests'
ORDER BY ordinal_position;

-- Compter les données existantes
SELECT 'testimonies' as table_name, count(*) as total_rows FROM testimonies
UNION ALL
SELECT 'prayer_requests' as table_name, count(*) as total_rows FROM prayer_requests
UNION ALL  
SELECT 'user_interactions' as table_name, count(*) as total_rows FROM user_interactions;

-- Vérifier quelques exemples de données
SELECT 'TESTIMONIES - Exemple:' as info;
SELECT id, user_name, title, status, created_at FROM testimonies LIMIT 2;

SELECT 'PRAYER_REQUESTS - Exemple:' as info;
SELECT id, user_name, title, status, is_urgent, category FROM prayer_requests LIMIT 2;

-- Vérifier les statuts disponibles
SELECT DISTINCT status, count(*) FROM testimonies GROUP BY status;
SELECT DISTINCT status, count(*) FROM prayer_requests GROUP BY status; 