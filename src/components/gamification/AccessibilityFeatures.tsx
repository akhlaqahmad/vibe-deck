import React, { useEffect, useRef } from 'react';
import { useGamificationStore } from '@/stores/gamificationStore';
import { Achievement } from '@/types/gamification';

// Screen Reader Announcements
export const ScreenReaderAnnouncer: React.FC = () => {
  const { pendingCelebrations, achievements } = useGamificationStore();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingCelebrations.length > 0 && announcerRef.current) {
      const achievementId = pendingCelebrations[0];
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (achievement) {
        const announcement = `Achievement unlocked: ${achievement.title}. ${achievement.description}. You earned ${achievement.points} experience points.`;
        announcerRef.current.textContent = announcement;
      }
    }
  }, [pendingCelebrations, achievements]);

  return (
    <div
      ref={announcerRef}
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    />
  );
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (item: string) => void,
  isActive: boolean = true
) => {
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (items[focusedIndex]) {
            onSelect(items[focusedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setFocusedIndex(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect, isActive]);

  return { focusedIndex, setFocusedIndex };
};

// Focus Management Hook
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  const setFocusRef = (element: HTMLElement | null) => {
    focusRef.current = element;
    if (element) {
      element.focus();
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  };

  return { saveFocus, restoreFocus, setFocusRef, trapFocus };
};

// Reduced Motion Hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High Contrast Detection Hook
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Accessible Achievement Card
export const AccessibleAchievementCard: React.FC<{
  achievement: Achievement;
  onFocus?: () => void;
  tabIndex?: number;
}> = ({ achievement, onFocus, tabIndex = 0 }) => {
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();

  const rarityLabels = {
    common: 'Common achievement',
    rare: 'Rare achievement', 
    epic: 'Epic achievement',
    legendary: 'Legendary achievement'
  };

  return (
    <div
      role="article"
      tabIndex={tabIndex}
      onFocus={onFocus}
      className={`
        achievement-card p-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${achievement.unlocked ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'}
        ${prefersHighContrast ? 'border-4' : ''}
      `}
      aria-labelledby={`achievement-${achievement.id}-title`}
      aria-describedby={`achievement-${achievement.id}-description achievement-${achievement.id}-progress`}
    >
      <div className="flex items-start gap-3">
        <div 
          className="text-2xl"
          role="img"
          aria-label={`${achievement.title} emoji`}
        >
          {achievement.emoji}
        </div>
        
        <div className="flex-1">
          <h3 
            id={`achievement-${achievement.id}-title`}
            className="font-semibold text-lg"
          >
            {achievement.title}
            {achievement.unlocked && (
              <span className="sr-only"> - Completed</span>
            )}
          </h3>
          
          <p 
            id={`achievement-${achievement.id}-description`}
            className="text-sm text-muted-foreground mb-2"
          >
            {achievement.description}
          </p>
          
          <div 
            id={`achievement-${achievement.id}-progress`}
            className="flex items-center gap-2 text-xs"
          >
            <span className="sr-only">{rarityLabels[achievement.rarity]}</span>
            <span className="capitalize">{achievement.rarity}</span>
            <span aria-label={`${achievement.points} experience points`}>
              {achievement.points} XP
            </span>
            {achievement.progress !== undefined && (
              <span aria-label={`Progress: ${achievement.progress} of ${achievement.maxProgress}`}>
                {achievement.progress}/{achievement.maxProgress}
              </span>
            )}
          </div>
          
          {achievement.progress !== undefined && (
            <div className="mt-2">
              <div 
                className="w-full bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-valuenow={achievement.progress}
                aria-valuemin={0}
                aria-valuemax={achievement.maxProgress}
                aria-label={`Achievement progress: ${achievement.progress} of ${achievement.maxProgress}`}
              >
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                    transition: prefersReducedMotion ? 'none' : 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Accessible Stats Display
export const AccessibleStatsDisplay: React.FC<{
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ label, value, icon, trend }) => {
  const trendLabels = {
    up: 'increasing',
    down: 'decreasing', 
    neutral: 'stable'
  };

  return (
    <div 
      role="group"
      aria-labelledby={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
      className="stat-display p-4 rounded-lg bg-card border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && (
          <div role="img" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 
          id={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </h3>
      </div>
      
      <div className="flex items-center gap-2">
        <span 
          className="text-2xl font-bold"
          aria-label={`${label}: ${value}`}
        >
          {value}
        </span>
        
        {trend && (
          <span 
            className="sr-only"
            aria-label={`Trend: ${trendLabels[trend]}`}
          >
            {trendLabels[trend]}
          </span>
        )}
      </div>
    </div>
  );
};

// Skip Links Component
export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      <a 
        href="#gamification-stats"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to stats
      </a>
    </div>
  );
};

// Accessible Modal Wrapper
export const AccessibleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      
      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);

      // Trap focus within modal
      const cleanup = modalRef.current ? trapFocus(modalRef.current) : undefined;
      
      // Handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        if (cleanup) cleanup();
        restoreFocus();
      };
    }
  }, [isOpen, onClose, saveFocus, restoreFocus, trapFocus]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 focus:outline-none"
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-4">
          {title}
        </h2>
        
        {children}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close modal"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
};

// Color Contrast Utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsWCAGContrast = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};

// Accessible Notification
export const AccessibleNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onDismiss?: () => void;
}> = ({ message, type, onDismiss }) => {
  const typeLabels = {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    warning: 'Warning'
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`notification p-4 rounded-lg border-l-4 ${
        type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
        type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
        type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
        'bg-blue-50 border-blue-500 text-blue-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="sr-only">{typeLabels[type]}: </span>
          {message}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current"
            aria-label="Dismiss notification"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
};
