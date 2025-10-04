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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client to query publications
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recent publications count for context
    const { count } = await supabase
      .from('publications')
      .select('*', { count: 'exact', head: true });

    console.log('AI Assistant request received, publications in DB:', count);

    const systemPrompt = `You are a NASA Space Biology Research Assistant with expertise in analyzing bioscience experiments conducted in space. You help researchers, students, and mission planners explore insights from ${count || '608+'} NASA publications.

Your capabilities:
- Explain complex space biology concepts clearly
- Identify research trends and knowledge gaps
- Suggest relevant publications and connections
- Provide actionable insights for space missions
- Answer questions about organisms, experiments, and findings

Be concise, accurate, and enthusiastic about space biology. When referencing studies, mention organism types, experiment conditions, and key findings.

**Formatting Instructions:**
- Use markdown formatting for better readability
- Use **bold** for key terms and emphasis
- Use bullet points (- or *) for lists
- Use headings (## or ###) to organize longer responses
- Use code blocks (\`\`\`) for technical terms or data
- Add relevant emojis to enhance engagement: 🚀 for space/missions, 🧬 for biology/DNA, 🔬 for experiments, 📊 for data/analysis, 💡 for insights, 🌍 for Earth, 🌌 for space, 🧪 for research, 📚 for publications, ⚗️ for chemistry
- Keep responses well-structured and easy to scan`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
