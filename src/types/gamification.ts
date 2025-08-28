export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'productivity' | 'social' | 'streak' | 'milestone' | 'speed';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface UserStats {
  // Task Statistics
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  tasksCompletedMonth: number;
  tasksCompletedTotal: number;
  
  // Streak Statistics
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  
  // Time Statistics
  totalTimeSpent: number; // in minutes
  averageTaskTime: number; // in minutes
  mostProductiveHour: number; // 0-23
  
  // Social Statistics
  boardsShared: number;
  collaborativeBoards: number;
  
  // Emoji Statistics
  favoriteEmojis: Record<string, number>;
  totalEmojisUsed: number;
  
  // Speed Statistics
  fastestTaskCompletion: number; // in minutes
  tasksCompletedInDay: number;
  personalBest: {
    tasksInDay: number;
    date: Date;
  };
}

export interface ActivityEvent {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_moved' | 'board_created' | 'achievement_unlocked' | 'streak_milestone';
  timestamp: Date;
  description: string;
  emoji: string;
  metadata?: {
    taskTitle?: string;
    boardTitle?: string;
    achievementId?: string;
    streakCount?: number;
  };
}

export interface CelebrationConfig {
  confetti: boolean;
  sounds: boolean;
  emojiBurst: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
}

export interface ProgressRing {
  current: number;
  max: number;
  color: string;
  size: 'sm' | 'md' | 'lg';
  animated: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: 'welcome' | 'create_task' | 'drag_drop' | 'themes' | 'complete';
  completed: boolean;
  skippable: boolean;
}

export interface EmptyState {
  id: string;
  context: 'no_tasks' | 'no_columns' | 'no_boards' | 'no_activity';
  title: string;
  description: string;
  emoji: string;
  actionText: string;
  actionHandler: () => void;
  illustration?: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  category: 'achievement' | 'completion' | 'interaction' | 'notification';
}

export interface GamificationState {
  // User Progress
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: string[];
  recentlyUnlocked: string[];
  
  // Statistics
  stats: UserStats;
  
  // Activity
  activityFeed: ActivityEvent[];
  
  // Settings
  celebrations: CelebrationConfig;
  onboardingCompleted: boolean;
  onboardingSteps: OnboardingStep[];
  
  // UI State
  showStatsModal: boolean;
  showAchievementsModal: boolean;
  showOnboarding: boolean;
  pendingCelebrations: string[];
}

export interface GamificationActions {
  // Achievement System
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  
  // Statistics
  updateStats: (updates: Partial<UserStats>) => void;
  incrementTasksCompleted: () => void;
  updateStreak: () => void;
  addTimeSpent: (minutes: number) => void;
  recordEmojiUsage: (emoji: string) => void;
  
  // Activity Feed
  addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  clearOldActivity: () => void;
  
  // Celebrations
  triggerCelebration: (type: 'task_complete' | 'achievement' | 'streak' | 'milestone') => void;
  updateCelebrationSettings: (settings: Partial<CelebrationConfig>) => void;
  
  // Onboarding
  completeOnboardingStep: (stepId: string) => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  
  // UI Actions
  toggleStatsModal: () => void;
  toggleAchievementsModal: () => void;
  showOnboardingFlow: () => void;
  dismissCelebration: (achievementId: string) => void;
}

// Predefined Achievements
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_task',
    title: 'Getting Started',
    description: 'Create your very first task',
    emoji: '🌱',
    category: 'milestone',
    maxProgress: 1,
    rarity: 'common',
    points: 10
  },
  {
    id: 'first_completion',
    title: 'Task Master',
    description: 'Complete your first task',
    emoji: '✅',
    category: 'milestone',
    maxProgress: 1,
    rarity: 'common',
    points: 15
  },
  {
    id: 'streak_7',
    title: 'Streak Master',
    description: 'Maintain a 7-day productivity streak',
    emoji: '🔥',
    category: 'streak',
    maxProgress: 7,
    rarity: 'rare',
    points: 50
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 10 tasks in a single day',
    emoji: '⚡',
    category: 'speed',
    maxProgress: 10,
    rarity: 'epic',
    points: 75
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Share your first board',
    emoji: '🦋',
    category: 'social',
    maxProgress: 1,
    rarity: 'rare',
    points: 40
  },
  {
    id: 'emoji_enthusiast',
    title: 'Emoji Enthusiast',
    description: 'Use 50 different emojis',
    emoji: '🎨',
    category: 'milestone',
    maxProgress: 50,
    rarity: 'rare',
    points: 60
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete tasks after 10 PM',
    emoji: '🦉',
    category: 'productivity',
    maxProgress: 5,
    rarity: 'common',
    points: 25
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete tasks before 8 AM',
    emoji: '🐦',
    category: 'productivity',
    maxProgress: 5,
    rarity: 'common',
    points: 25
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 100 tasks total',
    emoji: '💎',
    category: 'milestone',
    maxProgress: 100,
    rarity: 'epic',
    points: 100
  },
  {
    id: 'legend',
    title: 'Productivity Legend',
    description: 'Maintain a 30-day streak',
    emoji: '👑',
    category: 'streak',
    maxProgress: 30,
    rarity: 'legendary',
    points: 200
  }
];

// Sound Effects Configuration
export const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'task_complete',
    name: 'Task Complete',
    url: '/sounds/task-complete.mp3',
    volume: 0.6,
    category: 'completion'
  },
  {
    id: 'achievement_unlock',
    name: 'Achievement Unlocked',
    url: '/sounds/achievement.mp3',
    volume: 0.8,
    category: 'achievement'
  },
  {
    id: 'streak_milestone',
    name: 'Streak Milestone',
    url: '/sounds/streak.mp3',
    volume: 0.7,
    category: 'achievement'
  },
  {
    id: 'button_click',
    name: 'Button Click',
    url: '/sounds/click.mp3',
    volume: 0.3,
    category: 'interaction'
  },
  {
    id: 'celebration',
    name: 'Celebration',
    url: '/sounds/celebration.mp3',
    volume: 0.9,
    category: 'achievement'
  }
];

// Experience and Leveling
export const EXPERIENCE_PER_LEVEL = 100;
export const LEVEL_MULTIPLIER = 1.2;

export const calculateLevel = (experience: number): number => {
  let level = 1;
  let requiredExp = EXPERIENCE_PER_LEVEL;
  
  while (experience >= requiredExp) {
    experience -= requiredExp;
    level++;
    requiredExp = Math.floor(EXPERIENCE_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }
  
  return level;
};

export const calculateExperienceToNextLevel = (experience: number, level: number): number => {
  const currentLevelExp = Math.floor(EXPERIENCE_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  const experienceInCurrentLevel = experience % currentLevelExp;
  return currentLevelExp - experienceInCurrentLevel;
};
