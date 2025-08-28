import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { StatsButton } from '@/components/gamification/StatsDashboard';
import { OnboardingHelpButton } from '@/components/gamification/OnboardingFlow';
import { CelebrationSystem } from '@/components/gamification/CelebrationSystem';

export function Header() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <>
      <motion.header 
        className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 gradient-rainbow rounded-lg flex items-center justify-center animate-glow">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-h3 font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VibeDeck
              </h1>
              <p className="text-caption text-muted-foreground -mt-1">
                Aesthetic productivity
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Gamification Stats Button */}
            <StatsButton />
            
            {/* Onboarding Help Button */}
            <OnboardingHelpButton />
            
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 hover:shadow-glow transition-all duration-300"
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-caption hidden sm:inline">Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                      theme === t.id ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex gap-1">
                        {t.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-caption font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      {theme === t.id && (
                        <motion.div
                          layoutId="activeTheme"
                          className="w-2 h-2 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>
      
      {/* Celebration System */}
      <CelebrationSystem />
    </>
  );
}