import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { OnboardingStep } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Target, 
  Zap,
  Trophy,
  X,
  Play,
  MousePointer,
  Keyboard,
  Eye
} from 'lucide-react';

// Animated Step Indicator
const StepIndicator: React.FC<{
  steps: OnboardingStep[];
  currentStep: number;
}> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              className={`w-8 h-0.5 transition-colors ${
                index < currentStep ? 'bg-green-500' : 'bg-muted'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: index < currentStep ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Interactive Tutorial Overlay
const TutorialOverlay: React.FC<{
  step: OnboardingStep;
  onNext: () => void;
  onSkip: () => void;
}> = ({ step, onNext, onSkip }) => {
  const [showPointer, setShowPointer] = useState(false);

  useEffect(() => {
    if (step.targetElement) {
      const timer = setTimeout(() => setShowPointer(true), 500);
      return () => clearTimeout(timer);
    }
  }, [step.targetElement]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 z-40"
      />
      
      {/* Spotlight Effect */}
      {step.targetElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 pointer-events-none"
          style={{
            top: step.targetElement.top - 10,
            left: step.targetElement.left - 10,
            width: step.targetElement.width + 20,
            height: step.targetElement.height + 20,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            borderRadius: '12px'
          }}
        />
      )}
      
      {/* Animated Pointer */}
      {showPointer && step.targetElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{
            scale: { duration: 0.3 },
            x: { repeat: Infinity, duration: 2 },
            y: { repeat: Infinity, duration: 2 }
          }}
          className="fixed z-50 pointer-events-none text-primary"
          style={{
            top: step.targetElement.top + step.targetElement.height + 10,
            left: step.targetElement.left + step.targetElement.width / 2 - 12
          }}
        >
          <MousePointer className="w-6 h-6" />
        </motion.div>
      )}
      
      {/* Tutorial Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="fixed z-50 max-w-sm"
        style={{
          top: step.targetElement 
            ? step.targetElement.top + step.targetElement.height + 60
            : '50%',
          left: step.targetElement 
            ? Math.max(20, step.targetElement.left - 100)
            : '50%',
          transform: step.targetElement ? 'none' : 'translate(-50%, -50%)'
        }}
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            
            {step.actionText && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-4">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{step.actionText}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tutorial
              </Button>
              
              <Button onClick={onNext} size="sm" className="gap-2">
                {step.actionRequired ? 'Try it!' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

// Welcome Screen
const WelcomeScreen: React.FC<{
  onStart: () => void;
  onSkip: () => void;
}> = ({ onStart, onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="max-w-lg w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
            className="text-6xl mb-6"
          >
            🎯
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to VibeDeck!
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Get ready to supercharge your productivity with our aesthetic Kanban board. 
            Let's take a quick tour to get you started!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium">Organize Tasks</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium">Level Up</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-sm font-medium">Earn Rewards</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onSkip}>
              Skip for now
            </Button>
            <Button onClick={onStart} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Start Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Completion Screen
const CompletionScreen: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="max-w-lg w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4 text-primary">
            You're All Set!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Congratulations! You've completed the tutorial and earned your first achievement. 
            Now you're ready to organize your tasks and level up your productivity!
          </p>
          
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">Achievement Unlocked:</span>
            <Badge variant="secondary">Getting Started +50 XP</Badge>
          </div>
          
          <Button onClick={onComplete} size="lg" className="gap-2">
            <Target className="w-5 h-5" />
            Start Creating Tasks
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Onboarding Flow Component
export const OnboardingFlow: React.FC = () => {
  const {
    onboarding,
    completeOnboardingStep,
    skipOnboarding,
    isOnboardingActive
  } = useGamificationStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentStep = onboarding.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / onboarding.steps.length) * 100;

  // Don't render if onboarding is not active
  if (!isOnboardingActive()) {
    return null;
  }

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (currentStep) {
      completeOnboardingStep(currentStep.id);
    }
    
    if (currentStepIndex < onboarding.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const handleComplete = () => {
    setShowCompletion(false);
    skipOnboarding(); // This will mark onboarding as completed
  };

  // Welcome Screen
  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} onSkip={handleSkip} />;
  }

  // Completion Screen
  if (showCompletion) {
    return <CompletionScreen onComplete={handleComplete} />;
  }

  // Tutorial Steps
  if (currentStep) {
    return (
      <>
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-80 max-w-[90vw]"
        >
          <Card className="p-4 shadow-lg border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tutorial Progress</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {onboarding.steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </Card>
        </motion.div>

        {/* Tutorial Overlay */}
        <TutorialOverlay
          step={currentStep}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </>
    );
  }

  return null;
};

// Onboarding Trigger Hook
export const useOnboardingTrigger = () => {
  const { startOnboarding, isOnboardingActive } = useGamificationStore();

  const triggerOnboarding = () => {
    if (!isOnboardingActive()) {
      startOnboarding();
    }
  };

  return { triggerOnboarding, isOnboardingActive: isOnboardingActive() };
};

// Help Button Component
export const OnboardingHelpButton: React.FC = () => {
  const { triggerOnboarding } = useOnboardingTrigger();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={triggerOnboarding}
      className="gap-2 hover:bg-primary/10"
    >
      <Eye className="w-4 h-4" />
      <span className="hidden sm:inline">Tutorial</span>
    </Button>
  );
};
