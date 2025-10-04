export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  abstract: string | null;
  keywords: string[];
  doi: string | null;
  publication_url: string | null;
  nasa_task_book_url: string | null;
  osdr_url: string | null;
  organisms: string[];
  experiment_type: string | null;
  research_area: string | null;
  findings: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicationConnection {
  id: string;
  source_publication_id: string;
  target_publication_id: string;
  connection_type: string;
  strength: number;
}

export interface GraphNode {
  id: string;
  title: string;
  year?: number;
  research_area?: string;
  val?: number;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength: number;
}
