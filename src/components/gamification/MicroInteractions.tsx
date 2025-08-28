import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

// Ripple Effect Component
export const RippleEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = 'rgba(255, 255, 255, 0.6)' }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 300, 
            height: 300, 
            opacity: 0,
            x: -150,
            y: -150
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Magnetic Button Effect
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}> = ({ children, className = '', strength = 0.3, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Floating Action Button with Pulse
export const FloatingActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  tooltip?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
}> = ({ 
  onClick, 
  icon, 
  tooltip, 
  position = 'bottom-right',
  color = 'bg-primary'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <motion.button
        className={`w-14 h-14 ${color} text-white rounded-full shadow-lg flex items-center justify-center relative`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        animate={{
          boxShadow: isHovered 
            ? '0 10px 25px rgba(0,0,0,0.3)' 
            : '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        {/* Pulse Ring */}
        <motion.div
          className={`absolute inset-0 ${color} rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>

        {/* Tooltip */}
        {tooltip && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

// Animated Counter
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const difference = endValue - startValue;

    if (difference === 0) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + difference * easeOutCubic);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      animate={{ scale: displayValue !== value ? [1, 1.2, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
};

// Shake Animation Hook
export const useShakeAnimation = () => {
  const controls = useAnimation();

  const shake = () => {
    controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    });
  };

  return { controls, shake };
};

// Bounce Animation Hook
export const useBounceAnimation = () => {
  const controls = useAnimation();

  const bounce = () => {
    controls.start({
      y: [0, -20, 0],
      transition: { duration: 0.6, type: "spring", stiffness: 300 }
    });
  };

  return { controls, bounce };
};

// Glow Effect Component
export const GlowEffect: React.FC<{
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}> = ({ children, color = '#4ECDC4', intensity = 0.5, className = '' }) => {
  const [isGlowing, setIsGlowing] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsGlowing(true)}
      onMouseLeave={() => setIsGlowing(false)}
      animate={{
        boxShadow: isGlowing 
          ? `0 0 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`
          : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Progress Bar with Animation
export const AnimatedProgressBar: React.FC<{
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
}> = ({ 
  progress, 
  height = 8, 
  color = '#4ECDC4', 
  backgroundColor = '#E5E7EB',
  showPercentage = false,
  className = ''
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {showPercentage && (
        <motion.div
          className="absolute top-0 right-0 text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(displayProgress)}%
        </motion.div>
      )}
    </div>
  );
};

// Stagger Animation Container
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Particle System for Celebrations
export const ParticleSystem: React.FC<{
  isActive: boolean;
  particleCount?: number;
  colors?: string[];
  duration?: number;
}> = ({ 
  isActive, 
  particleCount = 20, 
  colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  duration = 3
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: '50%',
            top: '50%'
          }}
          initial={{ 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{
            scale: [0, 1, 0],
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 600,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: duration,
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
};

// Hover Scale Effect
export const HoverScale: React.FC<{
  children: React.ReactNode;
  scale?: number;
  className?: string;
}> = ({ children, scale = 1.05, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Typing Animation
export const TypingAnimation: React.FC<{
  text: string;
  speed?: number;
  className?: string;
}> = ({ text, speed = 50, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="inline-block"
      >
        |
      </motion.span>
    </span>
  );
};
