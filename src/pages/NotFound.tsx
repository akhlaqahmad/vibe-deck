import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.div>
        
        <h1 className="text-h2 font-bold mb-2">Oops! Page not found</h1>
        <p className="text-body text-muted-foreground mb-6">
          Looks like you wandered into the void. Let's get you back to your aesthetic workspace!
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"} 
            className="gap-2 gradient-primary text-background hover:shadow-glow transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
