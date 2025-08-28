import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import {
  GamificationState,
  GamificationActions,
  Achievement,
  UserStats,
  ActivityEvent,
  CelebrationConfig,
  OnboardingStep,
  ACHIEVEMENTS,
  calculateLevel,
  calculateExperienceToNextLevel
} from '@/types/gamification';

interface GamificationStore extends GamificationState, GamificationActions {}

const createInitialStats = (): UserStats => ({
  tasksCompletedToday: 0,
  tasksCompletedWeek: 0,
  tasksCompletedMonth: 0,
  tasksCompletedTotal: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: new Date(),
  totalTimeSpent: 0,
  averageTaskTime: 0,
  mostProductiveHour: 9,
  boardsShared: 0,
  collaborativeBoards: 0,
  favoriteEmojis: {},
  totalEmojisUsed: 0,
  fastestTaskCompletion: 0,
  tasksCompletedInDay: 0,
  personalBest: {
    tasksInDay: 0,
    date: new Date()
  }
});

const createInitialAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: false,
    progress: 0
  }));
};

const createInitialOnboardingSteps = (): OnboardingStep[] => [
  {
    id: 'welcome',
    title: 'Welcome to VibeDeck! ✨',
    description: 'Your aesthetic productivity journey starts here',
    component: 'welcome',
    completed: false,
    skippable: false
  },
  {
    id: 'create_task',
    title: 'Create Your First Task',
    description: 'Add a task to get started with your Kanban board',
    component: 'create_task',
    completed: false,
    skippable: false
  },
  {
    id: 'drag_drop',
    title: 'Move Tasks Around',
    description: 'Drag and drop tasks between columns',
    component: 'drag_drop',
    completed: false,
    skippable: true
  },
  {
    id: 'themes',
    title: 'Choose Your Vibe',
    description: 'Switch between aesthetic themes',
    component: 'themes',
    completed: false,
    skippable: true
  }
];

const defaultCelebrations: CelebrationConfig = {
  confetti: true,
  sounds: true,
  emojiBurst: true,
  hapticFeedback: true,
  reducedMotion: false
};

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      // Initial State
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      achievements: createInitialAchievements(),
      unlockedAchievements: [],
      recentlyUnlocked: [],
      stats: createInitialStats(),
      activityFeed: [],
      celebrations: defaultCelebrations,
      onboardingCompleted: false,
      onboardingSteps: createInitialOnboardingSteps(),
      showStatsModal: false,
      showAchievementsModal: false,
      showOnboarding: false,
      pendingCelebrations: [],

      // Achievement System
      checkAchievements: () => {
        const state = get();
        const { stats, achievements } = state;
        const newlyUnlocked: string[] = [];

        const updatedAchievements = achievements.map(achievement => {
          if (achievement.unlocked) return achievement;

          let newProgress = achievement.progress;
          let shouldUnlock = false;

          // Check achievement conditions
          switch (achievement.id) {
            case 'first_task':
              newProgress = stats.tasksCompletedTotal > 0 ? 1 : 0;
              break;
            case 'first_completion':
              newProgress = stats.tasksCompletedTotal > 0 ? 1 : 0;
              break;
            case 'streak_7':
              newProgress = Math.min(stats.currentStreak, 7);
              break;
            case 'speed_demon':
              newProgress = Math.min(stats.tasksCompletedInDay, 10);
              break;
            case 'social_butterfly':
              newProgress = Math.min(stats.boardsShared, 1);
              break;
            case 'emoji_enthusiast':
              newProgress = Math.min(Object.keys(stats.favoriteEmojis).length, 50);
              break;
            case 'night_owl':
              // This would be tracked when tasks are completed
              break;
            case 'early_bird':
              // This would be tracked when tasks are completed
              break;
            case 'perfectionist':
              newProgress = Math.min(stats.tasksCompletedTotal, 100);
              break;
            case 'legend':
              newProgress = Math.min(stats.currentStreak, 30);
              break;
          }

          shouldUnlock = newProgress >= achievement.maxProgress;

          if (shouldUnlock && !achievement.unlocked) {
            newlyUnlocked.push(achievement.id);
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date(),
              progress: newProgress
            };
          }

          return {
            ...achievement,
            progress: newProgress
          };
        });

        if (newlyUnlocked.length > 0) {
          // Add experience for unlocked achievements
          const experienceGained = newlyUnlocked.reduce((total, achievementId) => {
            const achievement = updatedAchievements.find(a => a.id === achievementId);
            return total + (achievement?.points || 0);
          }, 0);

          const newExperience = state.experience + experienceGained;
          const newLevel = calculateLevel(newExperience);
          const newExperienceToNextLevel = calculateExperienceToNextLevel(newExperience, newLevel);

          // Add activity events for new achievements
          const newActivities: ActivityEvent[] = newlyUnlocked.map(achievementId => {
            const achievement = updatedAchievements.find(a => a.id === achievementId);
            return {
              id: nanoid(),
              type: 'achievement_unlocked',
              timestamp: new Date(),
              description: `Unlocked "${achievement?.title}"`,
              emoji: achievement?.emoji || '🏆',
              metadata: { achievementId }
            };
          });

          set({
            achievements: updatedAchievements,
            unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
            recentlyUnlocked: newlyUnlocked,
            pendingCelebrations: [...state.pendingCelebrations, ...newlyUnlocked],
            experience: newExperience,
            level: newLevel,
            experienceToNextLevel: newExperienceToNextLevel,
            activityFeed: [...newActivities, ...state.activityFeed].slice(0, 100)
          });

          // Trigger celebrations for each new achievement
          newlyUnlocked.forEach(() => {
            get().triggerCelebration('achievement');
          });
        } else {
          set({ achievements: updatedAchievements });
        }
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const updatedAchievements = state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date() }
              : achievement
          );

          return {
            achievements: updatedAchievements,
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            recentlyUnlocked: [achievementId],
            pendingCelebrations: [...state.pendingCelebrations, achievementId]
          };
        });
      },

      updateAchievementProgress: (achievementId: string, progress: number) => {
        set((state) => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, progress: Math.min(progress, achievement.maxProgress) }
              : achievement
          )
        }));
      },

      // Statistics
      updateStats: (updates: Partial<UserStats>) => {
        set((state) => ({
          stats: { ...state.stats, ...updates }
        }));
        get().checkAchievements();
      },

      incrementTasksCompleted: () => {
        const now = new Date();
        const today = now.toDateString();
        
        set((state) => {
          const lastActiveToday = state.stats.lastActiveDate.toDateString() === today;
          const newTasksToday = lastActiveToday ? state.stats.tasksCompletedInDay + 1 : 1;
          
          // Update personal best if needed
          const newPersonalBest = newTasksToday > state.stats.personalBest.tasksInDay
            ? { tasksInDay: newTasksToday, date: now }
            : state.stats.personalBest;

          const updatedStats: UserStats = {
            ...state.stats,
            tasksCompletedToday: lastActiveToday ? state.stats.tasksCompletedToday + 1 : 1,
            tasksCompletedTotal: state.stats.tasksCompletedTotal + 1,
            tasksCompletedInDay: newTasksToday,
            personalBest: newPersonalBest,
            lastActiveDate: now
          };

          return { stats: updatedStats };
        });
        
        get().updateStreak();
        get().checkAchievements();
        get().triggerCelebration('task_complete');
      },

      updateStreak: () => {
        const now = new Date();
        const today = now.toDateString();
        
        set((state) => {
          const lastActive = state.stats.lastActiveDate.toDateString();
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
          
          let newStreak = state.stats.currentStreak;
          
          if (lastActive === today) {
            // Already active today, no change
            return state;
          } else if (lastActive === yesterday) {
            // Continuing streak
            newStreak += 1;
          } else {
            // Streak broken, start new
            newStreak = 1;
          }

          const newLongestStreak = Math.max(newStreak, state.stats.longestStreak);
          
          // Trigger streak milestone celebration
          if (newStreak > state.stats.currentStreak && newStreak % 7 === 0) {
            get().addActivity({
              type: 'streak_milestone',
              description: `${newStreak}-day streak achieved! 🔥`,
              emoji: '🔥',
              metadata: { streakCount: newStreak }
            });
            get().triggerCelebration('streak');
          }

          return {
            stats: {
              ...state.stats,
              currentStreak: newStreak,
              longestStreak: newLongestStreak,
              lastActiveDate: now
            }
          };
        });
      },

      addTimeSpent: (minutes: number) => {
        set((state) => {
          const newTotalTime = state.stats.totalTimeSpent + minutes;
          const newAverageTime = newTotalTime / Math.max(state.stats.tasksCompletedTotal, 1);
          
          return {
            stats: {
              ...state.stats,
              totalTimeSpent: newTotalTime,
              averageTaskTime: newAverageTime,
              fastestTaskCompletion: state.stats.fastestTaskCompletion === 0 
                ? minutes 
                : Math.min(state.stats.fastestTaskCompletion, minutes)
            }
          };
        });
      },

      recordEmojiUsage: (emoji: string) => {
        set((state) => ({
          stats: {
            ...state.stats,
            favoriteEmojis: {
              ...state.stats.favoriteEmojis,
              [emoji]: (state.stats.favoriteEmojis[emoji] || 0) + 1
            },
            totalEmojisUsed: state.stats.totalEmojisUsed + 1
          }
        }));
        get().checkAchievements();
      },

      // Activity Feed
      addActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
        set((state) => ({
          activityFeed: [
            {
              id: nanoid(),
              timestamp: new Date(),
              ...event
            },
            ...state.activityFeed
          ].slice(0, 100) // Keep only last 100 activities
        }));
      },

      clearOldActivity: () => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        set((state) => ({
          activityFeed: state.activityFeed.filter(
            activity => activity.timestamp > oneWeekAgo
          )
        }));
      },

      // Celebrations
      triggerCelebration: (type: 'task_complete' | 'achievement' | 'streak' | 'milestone') => {
        const state = get();
        if (state.celebrations.reducedMotion) return;

        // This would trigger the actual celebration animations
        // Implementation depends on the celebration components
        console.log(`🎉 Celebration triggered: ${type}`);
      },

      updateCelebrationSettings: (settings: Partial<CelebrationConfig>) => {
        set((state) => ({
          celebrations: { ...state.celebrations, ...settings }
        }));
      },

      // Onboarding
      completeOnboardingStep: (stepId: string) => {
        set((state) => {
          const updatedSteps = state.onboardingSteps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          );
          
          const allCompleted = updatedSteps.every(step => step.completed || step.skippable);
          
          return {
            onboardingSteps: updatedSteps,
            onboardingCompleted: allCompleted,
            showOnboarding: !allCompleted
          };
        });
      },

      skipOnboarding: () => {
        set({
          onboardingCompleted: true,
          showOnboarding: false
        });
      },

      resetOnboarding: () => {
        set({
          onboardingSteps: createInitialOnboardingSteps(),
          onboardingCompleted: false,
          showOnboarding: true
        });
      },

      // UI Actions
      toggleStatsModal: () => {
        set((state) => ({ showStatsModal: !state.showStatsModal }));
      },

      toggleAchievementsModal: () => {
        set((state) => ({ showAchievementsModal: !state.showAchievementsModal }));
      },

      showOnboardingFlow: () => {
        set({ showOnboarding: true });
      },

      dismissCelebration: (achievementId: string) => {
        set((state) => ({
          pendingCelebrations: state.pendingCelebrations.filter(id => id !== achievementId),
          recentlyUnlocked: state.recentlyUnlocked.filter(id => id !== achievementId)
        }));
      },

      // Helper functions for components
      getLevel: () => {
        return get().level;
      },

      isOnboardingActive: () => {
        return get().showOnboarding;
      },

      trackActivity: (activity: { type: string; details: any; points?: number }) => {
        const activityEvent: Omit<ActivityEvent, 'id' | 'timestamp'> = {
          type: activity.type as ActivityEvent['type'],
          description: activity.details.taskTitle 
            ? `${activity.type.replace('_', ' ')} "${activity.details.taskTitle}"`
            : activity.type.replace('_', ' '),
          emoji: activity.type === 'task_moved' ? '📋' : 
                activity.type === 'task_created' ? '✨' : 
                activity.type === 'task_completed' ? '✅' : '📝',
          metadata: activity.details
        };
        
        get().addActivity(activityEvent);
        
        // Add experience points if provided
        if (activity.points) {
          const state = get();
          const newExperience = state.experience + activity.points;
          const newLevel = calculateLevel(newExperience);
          const newExperienceToNextLevel = calculateExperienceToNextLevel(newExperience, newLevel);
          
          set({
            experience: newExperience,
            level: newLevel,
            experienceToNextLevel: newExperienceToNextLevel
          });
        }
      }
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({
        level: state.level,
        experience: state.experience,
        experienceToNextLevel: state.experienceToNextLevel,
        achievements: state.achievements,
        unlockedAchievements: state.unlockedAchievements,
        stats: state.stats,
        activityFeed: state.activityFeed,
        celebrations: state.celebrations,
        onboardingCompleted: state.onboardingCompleted,
        onboardingSteps: state.onboardingSteps
      })
    }
  )
);
