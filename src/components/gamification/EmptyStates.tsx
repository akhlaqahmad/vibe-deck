import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { EmptyState } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Target, 
  Sparkles, 
  Coffee, 
  Zap,
  Trophy,
  Clock,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Rocket,
  Star,
  Heart,
  Smile
} from 'lucide-react';

// Animated Character Component
const AnimatedCharacter: React.FC<{ 
  emoji: string; 
  animation?: 'bounce' | 'float' | 'pulse' | 'wiggle' | 'spin';
}> = ({ emoji, animation = 'float' }) => {
  const animations = {
    bounce: {
      y: [0, -20, 0],
      transition: { repeat: Infinity, duration: 2 }
    },
    float: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, duration: 2 }
    },
    wiggle: {
      rotate: [0, 10, -10, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    spin: {
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 4, ease: "linear" }
    }
  };

  return (
    <motion.div
      className="text-6xl mb-4 select-none"
      animate={animations[animation]}
    >
      {emoji}
    </motion.div>
  );
};

// Motivational Quote Component
const MotivationalQuote: React.FC = () => {
  const quotes = [
    "Every expert was once a beginner! 🌱",
    "Small steps lead to big achievements! 🚀",
    "Your future self will thank you! ✨",
    "Progress, not perfection! 💪",
    "You've got this! 🎯",
    "Dream big, start small! 🌟",
    "Make it happen! ⚡",
    "Turn ideas into action! 💡"
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.p
      key={currentQuote}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-sm text-muted-foreground italic mb-4"
    >
      {currentQuote}
    </motion.p>
  );
};

// Action Button with Hover Effects
const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}> = ({ onClick, children, variant = 'primary', icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        variant={variant === 'primary' ? 'default' : 'outline'}
        size="lg"
        className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        {icon}
        {children}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

// Empty Board State
export const EmptyBoardState: React.FC<{
  onCreateTask: () => void;
  onStartTutorial?: () => void;
}> = ({ onCreateTask, onStartTutorial }) => {
  const { userStats, getLevel } = useGamificationStore();
  const isNewUser = userStats.tasksCompleted === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] p-8"
    >
      <Card className="max-w-md w-full text-center shadow-xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-8">
          <AnimatedCharacter emoji="🎯" animation="float" />
          
          <h2 className="text-2xl font-bold mb-2">
            {isNewUser ? "Welcome to VibeDeck!" : "Ready for Action!"}
          </h2>
          
          <p className="text-muted-foreground mb-4">
            {isNewUser 
              ? "Your productivity journey starts here. Create your first task and watch the magic happen!"
              : "Your board is looking clean! Time to add some new goals and keep the momentum going."
            }
          </p>

          <MotivationalQuote />

          {isNewUser && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 mb-6">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Start at Level {getLevel()}</span>
              <Badge variant="secondary" className="text-xs">
                {userStats.totalExperience} XP
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            <ActionButton
              onClick={onCreateTask}
              icon={<Plus className="w-5 h-5" />}
            >
              {isNewUser ? "Create Your First Task" : "Add New Task"}
            </ActionButton>
            
            {isNewUser && onStartTutorial && (
              <ActionButton
                onClick={onStartTutorial}
                variant="secondary"
                icon={<Lightbulb className="w-5 h-5" />}
              >
                Take the Tour
              </ActionButton>
            )}
          </div>

          {!isNewUser && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                💡 Pro tip: Use keyboard shortcut <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+N</kbd> to quickly add tasks
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Empty Column State
export const EmptyColumnState: React.FC<{
  columnTitle: string;
  onAddTask: () => void;
}> = ({ columnTitle, onAddTask }) => {
  const getColumnEmoji = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('todo') || lower.includes('backlog')) return '📝';
    if (lower.includes('progress') || lower.includes('doing')) return '⚡';
    if (lower.includes('done') || lower.includes('complete')) return '✅';
    if (lower.includes('review')) return '👀';
    return '📋';
  };

  const getColumnMessage = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('todo') || lower.includes('backlog')) 
      return "Ready to tackle some tasks?";
    if (lower.includes('progress') || lower.includes('doing')) 
      return "Time to get things moving!";
    if (lower.includes('done') || lower.includes('complete')) 
      return "Completed tasks will appear here!";
    if (lower.includes('review')) 
      return "Tasks awaiting review will show up here!";
    return "This column is waiting for tasks!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-6 text-center min-h-[200px] border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/30 transition-colors group"
    >
      <motion.div
        className="text-3xl mb-3 opacity-50 group-hover:opacity-70 transition-opacity"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        {getColumnEmoji(columnTitle)}
      </motion.div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {getColumnMessage(columnTitle)}
      </p>
      
      <Button
        onClick={onAddTask}
        variant="ghost"
        size="sm"
        className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </motion.div>
  );
};

// No Search Results State
export const NoSearchResultsState: React.FC<{
  searchQuery: string;
  onClearSearch: () => void;
  onCreateTask?: () => void;
}> = ({ searchQuery, onClearSearch, onCreateTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[300px] p-8"
    >
      <Card className="max-w-sm w-full text-center">
        <CardContent className="p-6">
          <AnimatedCharacter emoji="🔍" animation="wiggle" />
          
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          
          <p className="text-muted-foreground mb-4">
            We couldn't find any tasks matching <strong>"{searchQuery}"</strong>
          </p>

          <div className="space-y-2">
            <Button onClick={onClearSearch} variant="outline" size="sm">
              Clear Search
            </Button>
            
            {onCreateTask && (
              <Button onClick={onCreateTask} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create "{searchQuery}" Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// No Achievements State
export const NoAchievementsState: React.FC<{
  onStartTasks: () => void;
}> = ({ onStartTasks }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8"
    >
      <AnimatedCharacter emoji="🏆" animation="pulse" />
      
      <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
      
      <p className="text-muted-foreground mb-4">
        Complete tasks and reach milestones to unlock awesome achievements!
      </p>

      <ActionButton
        onClick={onStartTasks}
        icon={<Target className="w-5 h-5" />}
      >
        Start Earning Achievements
      </ActionButton>
    </motion.div>
  );
};

// No Activity State
export const NoActivityState: React.FC<{
  onCreateTask: () => void;
}> = ({ onCreateTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8"
    >
      <AnimatedCharacter emoji="📊" animation="bounce" />
      
      <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
      
      <p className="text-muted-foreground mb-4">
        Your activity timeline will show up here as you work on tasks!
      </p>

      <ActionButton
        onClick={onCreateTask}
        icon={<Zap className="w-5 h-5" />}
      >
        Get Started
      </ActionButton>
    </motion.div>
  );
};

// Loading State with Personality
export const LoadingState: React.FC<{
  message?: string;
}> = ({ message = "Loading your awesome content..." }) => {
  const loadingEmojis = ['⚡', '🚀', '✨', '🎯', '💫'];
  const [currentEmoji, setCurrentEmoji] = useState(loadingEmojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(loadingEmojis[Math.floor(Math.random() * loadingEmojis.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        className="text-4xl mb-4"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {currentEmoji}
      </motion.div>
      
      <p className="text-muted-foreground">{message}</p>
      
      <motion.div
        className="flex gap-1 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Error State with Retry
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ 
  title = "Oops! Something went wrong", 
  message = "Don't worry, even the best productivity ninjas face challenges!",
  onRetry 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8"
    >
      <AnimatedCharacter emoji="😅" animation="wiggle" />
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      <p className="text-muted-foreground mb-4">{message}</p>

      {onRetry && (
        <ActionButton
          onClick={onRetry}
          icon={<Zap className="w-5 h-5" />}
        >
          Try Again
        </ActionButton>
      )}
    </motion.div>
  );
};

// Success State
export const SuccessState: React.FC<{
  title: string;
  message: string;
  onContinue?: () => void;
}> = ({ title, message, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-8"
    >
      <AnimatedCharacter emoji="🎉" animation="bounce" />
      
      <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4">{message}</p>

      {onContinue && (
        <ActionButton
          onClick={onContinue}
          icon={<CheckCircle className="w-5 h-5" />}
        >
          Continue
        </ActionButton>
      )}
    </motion.div>
  );
};
