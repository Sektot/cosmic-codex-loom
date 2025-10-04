import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting publication import...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // GitHub raw content URL for the publications
    const githubUrl = 'https://raw.githubusercontent.com/jgalazka/SB_publications/main/SB_publications.csv';
    
    console.log('Fetching from:', githubUrl);
    const response = await fetch(githubUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch publications: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log('CSV Headers:', headers);
    
    const publications = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // Simple CSV parsing (handles basic cases)
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      const pub: any = {
        title: values[0] || 'Untitled',
        authors: values[1] ? values[1].split(';').map((a: string) => a.trim()) : [],
        year: values[2] ? parseInt(values[2]) : null,
        abstract: values[3] || null,
        keywords: values[4] ? values[4].split(';').map((k: string) => k.trim()) : [],
        doi: values[5] || null,
        publication_url: values[6] || null,
        organisms: values[7] ? values[7].split(';').map((o: string) => o.trim()) : [],
        experiment_type: values[8] || null,
        research_area: values[9] || null,
      };
      
      publications.push(pub);
    }

    console.log(`Parsed ${publications.length} publications`);

    // Insert in batches
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < publications.length; i += batchSize) {
      const batch = publications.slice(i, i + batchSize);
      const { error } = await supabase
        .from('publications')
        .insert(batch);
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${publications.length}`);
    }

    // Generate some basic connections based on shared keywords/organisms
    console.log('Generating knowledge graph connections...');
    const { data: allPubs, error: fetchError } = await supabase
      .from('publications')
      .select('id, keywords, organisms, research_area');
    
    if (fetchError) {
      console.error('Fetch error:', fetchError);
    } else if (allPubs) {
      const connections = [];
      
      for (let i = 0; i < allPubs.length; i++) {
        for (let j = i + 1; j < allPubs.length && j < i + 20; j++) {
          const pub1 = allPubs[i];
          const pub2 = allPubs[j];
          
          // Check for shared keywords
          const sharedKeywords = pub1.keywords.filter((k: string) => 
            pub2.keywords.includes(k)
          );
          
          if (sharedKeywords.length > 0) {
            connections.push({
              source_publication_id: pub1.id,
              target_publication_id: pub2.id,
              connection_type: 'shared_keywords',
              strength: Math.min(sharedKeywords.length / 5, 1)
            });
          }
          
          // Check for shared organisms
          const sharedOrganisms = pub1.organisms.filter((o: string) => 
            pub2.organisms.includes(o)
          );
          
          if (sharedOrganisms.length > 0) {
            connections.push({
              source_publication_id: pub1.id,
              target_publication_id: pub2.id,
              connection_type: 'shared_organism',
              strength: 0.8
            });
          }
          
          // Same research area
          if (pub1.research_area && pub1.research_area === pub2.research_area) {
            connections.push({
              source_publication_id: pub1.id,
              target_publication_id: pub2.id,
              connection_type: 'same_research_area',
              strength: 0.5
            });
          }
        }
      }
      
      console.log(`Generated ${connections.length} connections`);
      
      // Insert connections in batches
      if (connections.length > 0) {
        for (let i = 0; i < connections.length; i += batchSize) {
          const batch = connections.slice(i, i + batchSize);
          await supabase
            .from('publication_connections')
            .insert(batch)
            .select();
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      imported: publications.length,
      message: 'Publications imported successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Import error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Import failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
