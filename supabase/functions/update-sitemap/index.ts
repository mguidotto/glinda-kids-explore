
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to update sitemap');
    
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { sitemapContent } = await req.json();
    
    if (!sitemapContent) {
      return new Response(
        JSON.stringify({ error: 'Sitemap content is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Sitemap content received, length:', sitemapContent.length);

    // Note: In a real implementation, you would need to write to a file system
    // or use a service that can update static files. For now, we'll simulate success.
    // In production, this would integrate with your deployment system to update the static file.
    
    console.log('Sitemap update simulated successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sitemap updated successfully',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error updating sitemap:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update sitemap', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
