-- Create publications table to store NASA bioscience research data
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  year INTEGER,
  abstract TEXT,
  keywords TEXT[] DEFAULT '{}',
  doi TEXT,
  publication_url TEXT,
  nasa_task_book_url TEXT,
  osdr_url TEXT,
  organisms TEXT[] DEFAULT '{}',
  experiment_type TEXT,
  research_area TEXT,
  findings TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_publications_title ON public.publications USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_publications_abstract ON public.publications USING gin(to_tsvector('english', abstract));
CREATE INDEX IF NOT EXISTS idx_publications_keywords ON public.publications USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_publications_year ON public.publications(year);
CREATE INDEX IF NOT EXISTS idx_publications_research_area ON public.publications(research_area);

-- Create publication_connections table for knowledge graph
CREATE TABLE IF NOT EXISTS public.publication_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  target_publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  connection_type TEXT, -- 'related_topic', 'same_organism', 'cited_by', etc.
  strength DECIMAL DEFAULT 1.0, -- connection strength for graph visualization
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_publication_id, target_publication_id, connection_type)
);

-- Create index for graph queries
CREATE INDEX IF NOT EXISTS idx_connections_source ON public.publication_connections(source_publication_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON public.publication_connections(target_publication_id);

-- Enable RLS (data is public, so allow read access to everyone)
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_connections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to publications
CREATE POLICY "Publications are viewable by everyone"
  ON public.publications
  FOR SELECT
  USING (true);

-- Allow public read access to connections
CREATE POLICY "Connections are viewable by everyone"
  ON public.publication_connections
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add trigger for publications
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();