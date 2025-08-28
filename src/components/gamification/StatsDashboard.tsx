import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Flame, 
  Calendar, 
  Clock, 
  TrendingUp,
  Star,
  Zap,
  Award,
  ChevronRight,
  X
} from 'lucide-react';

// Animated Progress Ring Component
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#4ECDC4',
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Level Progress Component
const LevelProgress: React.FC = () => {
  const { stats, experience, getLevel, getExperienceForNextLevel } = useGamificationStore();
  const currentLevel = getLevel();
  const expForNext = getExperienceForNextLevel();
  const expProgress = expForNext > 0 ? ((experience % 1000) / expForNext) * 100 : 100;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentLevel}</div>
            <div className="text-xs text-muted-foreground">Current Level</div>
          </div>
          
          <ProgressRing 
            progress={expProgress} 
            size={80} 
            strokeWidth={6}
            color="hsl(var(--primary))"
          >
            <div className="text-center">
              <div className="text-sm font-semibold">{Math.round(expProgress)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
          </ProgressRing>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentLevel + 1}</div>
            <div className="text-xs text-muted-foreground">Next Level</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experience</span>
            <span>{experience} XP</span>
          </div>
          <Progress value={expProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{expForNext > 0 ? experience % 1000 : experience} XP</span>
            <span>{expForNext > 0 ? expForNext : 'Max Level'} XP needed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Achievement Progress Component
const AchievementProgress: React.FC = () => {
  const { achievements, stats } = useGamificationStore();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  const rarityCount = achievements.reduce((acc, achievement) => {
    if (achievement.unlocked) {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <ProgressRing progress={progressPercent} color="#FF6B9D">
            <div className="text-center">
              <div className="text-2xl font-bold">{unlockedCount}</div>
              <div className="text-xs text-muted-foreground">of {totalCount}</div>
            </div>
          </ProgressRing>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(rarityCount).map(([rarity, count]) => (
            <motion.div
              key={rarity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <span className="text-sm capitalize">{rarity}</span>
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Activity Stats Component
const ActivityStats: React.FC = () => {
  const { stats } = useGamificationStore();
  
  const statsData = [
    {
      icon: Target,
      label: 'Tasks Completed',
      value: stats.tasksCompleted,
      color: '#4ECDC4'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: '#FF6B9D'
    },
    {
      icon: Calendar,
      label: 'Best Streak',
      value: `${stats.longestStreak} days`,
      color: '#45B7D1'
    },
    {
      icon: Clock,
      label: 'Active Days',
      value: stats.activeDays,
      color: '#96CEB4'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon 
                    className="w-5 h-5" 
                    style={{ color: stat.color }}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-2xl font-bold"
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Recent Achievements Component
const RecentAchievements: React.FC = () => {
  const { achievements } = useGamificationStore();
  const recentAchievements = achievements
    .filter(a => a.unlocked && a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  if (recentAchievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Complete tasks to unlock achievements!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <span className="text-2xl">{achievement.emoji}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                +{achievement.points} XP
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Stats Dashboard Component
export const StatsDashboard: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Dashboard Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Your Progress</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Level Progress */}
              <LevelProgress />

              {/* Activity Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Activity Stats
                </h3>
                <ActivityStats />
              </div>

              {/* Achievement Progress */}
              <AchievementProgress />

              {/* Recent Achievements */}
              <RecentAchievements />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Stats Button Component for Header
export const StatsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { stats, getLevel } = useGamificationStore();
  const currentLevel = getLevel();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative group hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Level {currentLevel}</span>
          <Badge variant="secondary" className="text-xs">
            {stats.experience} XP
          </Badge>
        </div>
        <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </Button>
      
      <StatsDashboard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
