import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NecronButton } from "@/components/NecronButton";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center circuit-frame bg-card p-12">
        <h1 className="mb-4 text-6xl font-bold font-mono glow-text">404</h1>
        <p className="mb-8 text-xl text-muted-foreground font-mono">Page not found in the database</p>
        <NecronButton onClick={() => navigate("/")}>
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </NecronButton>
      </div>
    </div>
  );
};

export default NotFound;
