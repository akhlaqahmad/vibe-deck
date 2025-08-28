import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Achievement } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, X, Volume2, VolumeX } from 'lucide-react';

// Confetti Component
const ConfettiPiece: React.FC<{ delay: number }> = ({ delay }) => {
  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: -10,
        rotate: 0,
        scale: 1
      }}
      animate={{
        y: window.innerHeight + 10,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        scale: [1, 0.8, 0.6, 0.4, 0.2, 0],
        x: Math.random() * window.innerWidth
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
};

const ConfettiExplosion: React.FC<{ show: boolean; onComplete: () => void }> = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.1} />
      ))}
    </div>
  );
};

// Emoji Burst Component
const EmojiBurst: React.FC<{ emoji: string; show: boolean; onComplete: () => void }> = ({ 
  emoji, 
  show, 
  onComplete 
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
            x: [0, (Math.cos(i * 45 * Math.PI / 180) * 200)],
            y: [0, (Math.sin(i * 45 * Math.PI / 180) * 200)]
          }}
          transition={{
            duration: 2,
            ease: "easeOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Achievement Notification Component
const AchievementNotification: React.FC<{ 
  achievement: Achievement; 
  onDismiss: () => void;
  onSoundToggle: () => void;
  soundEnabled: boolean;
}> = ({ achievement, onDismiss, onSoundToggle, soundEnabled }) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-yellow-600'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/25',
    rare: 'shadow-blue-500/25',
    epic: 'shadow-purple-500/25',
    legendary: 'shadow-yellow-500/25'
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 10, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className={`p-6 max-w-sm bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white shadow-2xl ${rarityGlow[achievement.rarity]}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              <Trophy className="w-8 h-8" />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
              <p className="text-sm opacity-90 capitalize">{achievement.rarity} • {achievement.points} XP</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSoundToggle}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl"
          >
            {achievement.emoji}
          </motion.span>
          <div>
            <h4 className="font-semibold text-lg">{achievement.title}</h4>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        </div>

        <motion.div
          className="w-full bg-white/20 rounded-full h-2 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
};

// Sound Manager Hook
const useSoundManager = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const { celebrations } = useGamificationStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && celebrations.sounds) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      
      return () => {
        ctx.close();
      };
    }
  }, [celebrations.sounds]);

  const playSound = useCallback(async (soundId: string) => {
    if (!audioContext || !celebrations.sounds) return;

    try {
      // In a real implementation, you'd load and cache audio files
      // For now, we'll create simple synthesized sounds
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different sounds for different events
      switch (soundId) {
        case 'achievement':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          break;
        case 'task_complete':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#5
          break;
        case 'streak':
          oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
          oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.1); // E4
          oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.2); // G4
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.3); // C5
          break;
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [audioContext, celebrations.sounds]);

  return { playSound };
};

// Main Celebration System Component
export const CelebrationSystem: React.FC = () => {
  const {
    pendingCelebrations,
    achievements,
    celebrations,
    dismissCelebration,
    updateCelebrationSettings
  } = useGamificationStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmojiBurst, setShowEmojiBurst] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('🎉');
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  const { playSound } = useSoundManager();

  // Handle pending celebrations
  useEffect(() => {
    if (pendingCelebrations.length > 0) {
      const achievementId = pendingCelebrations[0];
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (achievement && !activeNotifications.includes(achievementId)) {
        setActiveNotifications(prev => [...prev, achievementId]);
        
        // Trigger visual effects
        if (celebrations.confetti && !celebrations.reducedMotion) {
          setShowConfetti(true);
        }
        
        if (celebrations.emojiBurst && !celebrations.reducedMotion) {
          setCurrentEmoji(achievement.emoji);
          setShowEmojiBurst(true);
        }
        
        // Play sound
        if (celebrations.sounds) {
          playSound('achievement');
        }
        
        // Haptic feedback
        if (celebrations.hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }
  }, [pendingCelebrations, achievements, celebrations, activeNotifications, playSound]);

  const handleDismissNotification = (achievementId: string) => {
    setActiveNotifications(prev => prev.filter(id => id !== achievementId));
    dismissCelebration(achievementId);
  };

  const handleSoundToggle = () => {
    updateCelebrationSettings({ sounds: !celebrations.sounds });
  };

  return (
    <>
      {/* Confetti Effect */}
      <ConfettiExplosion
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      
      {/* Emoji Burst Effect */}
      <EmojiBurst
        emoji={currentEmoji}
        show={showEmojiBurst}
        onComplete={() => setShowEmojiBurst(false)}
      />
      
      {/* Achievement Notifications */}
      <AnimatePresence>
        {activeNotifications.map((achievementId, index) => {
          const achievement = achievements.find(a => a.id === achievementId);
          if (!achievement) return null;
          
          return (
            <motion.div
              key={achievementId}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ delay: index * 0.2 }}
              style={{ top: `${1 + index * 12}rem` }}
              className="fixed right-4 z-50"
            >
              <AchievementNotification
                achievement={achievement}
                onDismiss={() => handleDismissNotification(achievementId)}
                onSoundToggle={handleSoundToggle}
                soundEnabled={celebrations.sounds}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
};

// Task Completion Celebration Hook
export const useTaskCelebration = () => {
  const { celebrations } = useGamificationStore();
  const { playSound } = useSoundManager();
  const [showMiniCelebration, setShowMiniCelebration] = useState(false);

  const celebrateTaskCompletion = useCallback(() => {
    if (celebrations.reducedMotion) return;

    setShowMiniCelebration(true);
    
    if (celebrations.sounds) {
      playSound('task_complete');
    }
    
    if (celebrations.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setShowMiniCelebration(false), 1000);
  }, [celebrations, playSound]);

  const MiniCelebration = () => (
    <AnimatePresence>
      {showMiniCelebration && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5 }}
            className="text-2xl"
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { celebrateTaskCompletion, MiniCelebration };
};
