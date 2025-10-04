import { ExternalLink, Calendar, Users, Beaker } from "lucide-react";
import { Publication } from "@/types/publication";
import { NecronButton } from "./NecronButton";

interface PublicationCardProps {
  publication: Publication;
  onSelect?: (id: string) => void;
}

export const PublicationCard = ({ publication, onSelect }: PublicationCardProps) => {
  return (
    <div className="circuit-frame bg-card p-6 hover:bg-card/80 transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
            {publication.title}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {publication.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{publication.year}</span>
              </div>
            )}
            
            {publication.authors.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{publication.authors.length} authors</span>
              </div>
            )}
            
            {publication.organisms.length > 0 && (
              <div className="flex items-center gap-1">
                <Beaker className="w-4 h-4" />
                <span>{publication.organisms.slice(0, 2).join(', ')}</span>
                {publication.organisms.length > 2 && <span>+{publication.organisms.length - 2}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Abstract preview */}
        {publication.abstract && (
          <p className="text-sm text-foreground/80 line-clamp-3">
            {publication.abstract}
          </p>
        )}

        {/* Keywords */}
        {publication.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {publication.keywords.slice(0, 5).map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono border border-primary/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2 pt-2">
          {publication.publication_url && (
            <a
              href={publication.publication_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NecronButton size="sm" variant="secondary">
                <ExternalLink className="w-3 h-3 mr-1" />
                Publication
              </NecronButton>
            </a>
          )}
          
          {publication.nasa_task_book_url && (
            <a
              href={publication.nasa_task_book_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NecronButton size="sm" variant="secondary">
                <ExternalLink className="w-3 h-3 mr-1" />
                Task Book
              </NecronButton>
            </a>
          )}
          
          {publication.osdr_url && (
            <a
              href={publication.osdr_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NecronButton size="sm" variant="secondary">
                <ExternalLink className="w-3 h-3 mr-1" />
                OSDR Data
              </NecronButton>
            </a>
          )}
          
          {onSelect && (
            <NecronButton
              size="sm"
              variant="ghost"
              onClick={() => onSelect(publication.id)}
            >
              View in Graph
            </NecronButton>
          )}
        </div>
      </div>
    </div>
  );
};
