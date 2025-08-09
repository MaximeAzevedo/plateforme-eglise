#!/usr/bin/env node

// Script de diagnostic de la base de données Supabase
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 === DIAGNOSTIC SUPABASE ===');
console.log('📍 URL:', supabaseUrl ? '✅ Présente' : '❌ Manquante');
console.log('🔑 Key:', supabaseKey ? '✅ Présente' : '❌ Manquante');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\n📊 === TEST DES TABLES ===');
    
    // Test de la table BDD (lieux de culte)
    try {
        const { data: bddData, error: bddError } = await supabase
            .from('BDD')
            .select('count(*)', { count: 'exact', head: true });
        
        if (bddError) {
            console.log('❌ Table BDD:', bddError.message);
        } else {
            console.log('✅ Table BDD: OK -', bddData?.length || 'nombreux', 'enregistrements');
        }
    } catch (e) {
        console.log('❌ Table BDD: Erreur -', e.message);
    }

    // Test de la table testimonies
    try {
        const { data: testimoniesData, error: testimoniesError } = await supabase
            .from('testimonies')
            .select('*')
            .limit(1);
        
        if (testimoniesError) {
            console.log('❌ Table testimonies:', testimoniesError.message);
            console.log('   💡 La table testimonies n\'existe pas - il faut l\'exécuter le script SQL');
        } else {
            console.log('✅ Table testimonies: OK -', testimoniesData?.length || 0, 'enregistrements');
            if (testimoniesData && testimoniesData.length > 0) {
                console.log('   📋 Colonnes disponibles:', Object.keys(testimoniesData[0]));
            }
        }
    } catch (e) {
        console.log('❌ Table testimonies: Erreur -', e.message);
    }

    // Test de la table prayer_requests
    try {
        const { data: prayersData, error: prayersError } = await supabase
            .from('prayer_requests')
            .select('*')
            .limit(1);
        
        if (prayersError) {
            console.log('❌ Table prayer_requests:', prayersError.message);
            console.log('   💡 La table prayer_requests n\'existe pas - il faut exécuter le script SQL');
        } else {
            console.log('✅ Table prayer_requests: OK -', prayersData?.length || 0, 'enregistrements');
            if (prayersData && prayersData.length > 0) {
                console.log('   📋 Colonnes disponibles:', Object.keys(prayersData[0]));
            }
        }
    } catch (e) {
        console.log('❌ Table prayer_requests: Erreur -', e.message);
    }

    // Test des autres tables
    const otherTables = ['user_interactions', 'moderation_queue', 'profiles'];
    
    for (const table of otherTables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('count(*)', { count: 'exact', head: true });
            
            if (error) {
                console.log(`❌ Table ${table}:`, error.message);
            } else {
                console.log(`✅ Table ${table}: OK`);
            }
        } catch (e) {
            console.log(`❌ Table ${table}: Erreur -`, e.message);
        }
    }

    console.log('\n🎯 === RECOMMANDATIONS ===');
    
    // Test d'insertion dans testimonies (si la table existe)
    try {
        const testData = {
            user_name: 'Test User',
            title: 'Test Témoignage',
            content: 'Ceci est un test',
            status: 'pending'
        };
        
        const { data, error } = await supabase
            .from('testimonies')
            .insert([testData])
            .select();
        
        if (error) {
            console.log('❌ Test d\'insertion testimonies:', error.message);
        } else {
            console.log('✅ Test d\'insertion testimonies: OK');
            // Nettoyer le test
            await supabase.from('testimonies').delete().eq('title', 'Test Témoignage');
        }
    } catch (e) {
        console.log('❌ Test d\'insertion testimonies: Erreur -', e.message);
    }
}

testConnection().catch(console.error); 