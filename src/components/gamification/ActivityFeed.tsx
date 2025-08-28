import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { ActivityEvent } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Check, 
  Edit, 
  Trash2, 
  Move, 
  Share2, 
  Trophy,
  Clock,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday, startOfDay } from 'date-fns';

// Activity Icon Mapping
const getActivityIcon = (type: ActivityEvent['type']) => {
  const iconMap = {
    task_created: Plus,
    task_completed: Check,
    task_updated: Edit,
    task_deleted: Trash2,
    task_moved: Move,
    board_shared: Share2,
    achievement_unlocked: Trophy
  };
  
  return iconMap[type] || Clock;
};

// Activity Color Mapping
const getActivityColor = (type: ActivityEvent['type']) => {
  const colorMap = {
    task_created: '#4ECDC4',
    task_completed: '#96CEB4',
    task_updated: '#45B7D1',
    task_deleted: '#FF6B9D',
    task_moved: '#FFEAA7',
    board_shared: '#DDA0DD',
    achievement_unlocked: '#FFD700'
  };
  
  return colorMap[type] || '#6B7280';
};

// Format Activity Description
const formatActivityDescription = (event: ActivityEvent) => {
  switch (event.type) {
    case 'task_created':
      return `Created task "${event.details.taskTitle}"`;
    case 'task_completed':
      return `Completed task "${event.details.taskTitle}"`;
    case 'task_updated':
      return `Updated task "${event.details.taskTitle}"`;
    case 'task_deleted':
      return `Deleted task "${event.details.taskTitle}"`;
    case 'task_moved':
      return `Moved task "${event.details.taskTitle}" to ${event.details.toColumn}`;
    case 'board_shared':
      return `Shared board with others`;
    case 'achievement_unlocked':
      return `Unlocked achievement "${event.details.achievementTitle}"`;
    default:
      return 'Unknown activity';
  }
};

// Time Formatting
const formatEventTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM d, HH:mm');
  }
};

// Activity Item Component
const ActivityItem: React.FC<{ 
  event: ActivityEvent; 
  index: number;
  isLast: boolean;
}> = ({ event, index, isLast }) => {
  const Icon = getActivityIcon(event.type);
  const color = getActivityColor(event.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative flex gap-3 pb-4"
    >
      {/* Timeline Line */}
      {!isLast && (
        <div 
          className="absolute left-4 top-8 w-0.5 h-full bg-border"
          style={{ marginLeft: '0.5rem' }}
        />
      )}
      
      {/* Activity Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.1 }}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 border-background"
        style={{ backgroundColor: `${color}20`, borderColor: color }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </motion.div>
      
      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {formatActivityDescription(event)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatEventTime(event.timestamp)}
              </span>
              {event.points && (
                <Badge variant="secondary" className="text-xs">
                  +{event.points} XP
                </Badge>
              )}
            </div>
          </div>
          
          {/* Achievement Badge */}
          {event.type === 'achievement_unlocked' && event.details.achievementEmoji && (
            <span className="text-lg">{event.details.achievementEmoji}</span>
          )}
        </div>
        
        {/* Additional Details */}
        {event.details.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {event.details.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Activity Group Component (for grouping by date)
const ActivityGroup: React.FC<{ 
  date: string; 
  events: ActivityEvent[];
  startIndex: number;
}> = ({ date, events, startIndex }) => {
  const groupDate = new Date(date);
  const dateLabel = isToday(groupDate) 
    ? 'Today' 
    : isYesterday(groupDate) 
    ? 'Yesterday' 
    : format(groupDate, 'MMMM d, yyyy');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Calendar className="w-4 h-4" />
        {dateLabel}
      </div>
      
      <div className="space-y-0">
        {events.map((event, index) => (
          <ActivityItem
            key={event.id}
            event={event}
            index={startIndex + index}
            isLast={index === events.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// Activity Filter Component
const ActivityFilter: React.FC<{
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ selectedTypes, onTypeToggle, isOpen, onToggle }) => {
  const filterOptions = [
    { type: 'task_created', label: 'Tasks Created', color: '#4ECDC4' },
    { type: 'task_completed', label: 'Tasks Completed', color: '#96CEB4' },
    { type: 'task_updated', label: 'Tasks Updated', color: '#45B7D1' },
    { type: 'task_moved', label: 'Tasks Moved', color: '#FFEAA7' },
    { type: 'achievement_unlocked', label: 'Achievements', color: '#FFD700' },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filter
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-10 p-2"
          >
            <div className="space-y-1">
              {filterOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => onTypeToggle(option.type)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors ${
                    selectedTypes.includes(option.type) ? 'bg-muted' : ''
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="flex-1 text-left">{option.label}</span>
                  {selectedTypes.includes(option.type) && (
                    <Check className="w-3 h-3 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Activity Feed Component
export const ActivityFeed: React.FC<{ 
  limit?: number;
  showHeader?: boolean;
  className?: string;
}> = ({ 
  limit = 20, 
  showHeader = true,
  className = ''
}) => {
  const { activityFeed } = useGamificationStore();
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([
    'task_created', 'task_completed', 'task_updated', 'task_moved', 'achievement_unlocked'
  ]);
  const [filterOpen, setFilterOpen] = React.useState(false);

  // Filter and group activities
  const { groupedActivities, totalCount } = useMemo(() => {
    const filtered = activityFeed
      .filter(event => selectedTypes.includes(event.type))
      .slice(0, limit);

    // Group by date
    const grouped = filtered.reduce((acc, event) => {
      const dateKey = format(startOfDay(new Date(event.timestamp)), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, ActivityEvent[]>);

    return {
      groupedActivities: grouped,
      totalCount: filtered.length
    };
  }, [activityFeed, selectedTypes, limit]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (totalCount === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start creating tasks to see your activity here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  let itemIndex = 0;

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Activity
              <Badge variant="secondary" className="text-xs">
                {totalCount}
              </Badge>
            </CardTitle>
            
            <ActivityFilter
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
              isOpen={filterOpen}
              onToggle={() => setFilterOpen(!filterOpen)}
            />
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedActivities)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, events]) => {
              const groupStartIndex = itemIndex;
              itemIndex += events.length;
              
              return (
                <ActivityGroup
                  key={date}
                  date={date}
                  events={events}
                  startIndex={groupStartIndex}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

// Compact Activity Feed for Sidebar
export const CompactActivityFeed: React.FC = () => {
  const { activityFeed } = useGamificationStore();
  const recentActivities = activityFeed.slice(0, 5);

  if (recentActivities.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-1 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentActivities.map((event, index) => {
        const Icon = getActivityIcon(event.type);
        const color = getActivityColor(event.type);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {formatActivityDescription(event)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatEventTime(event.timestamp)}
              </p>
            </div>
            
            {event.points && (
              <Badge variant="secondary" className="text-xs">
                +{event.points}
              </Badge>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
