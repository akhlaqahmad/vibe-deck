import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar, 
  CheckCircle2,
  GripVertical
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useKanbanStore } from '@/stores/kanbanStore';
import { Task } from '@/types/kanban';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(({ task }, ref) => {
  const isMobile = useIsMobile();
  const { updateTask, deleteTask } = useKanbanStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task-${task.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const combinedRef = (node: HTMLDivElement) => {
    setNodeRef(node);
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

  const handleSave = () => {
    updateTask(task.id, {
      title: editTitle.trim() || task.title,
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    updateTask(task.id, { emoji: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleComplete = () => {
    const isCompleted = task.completedAt;
    updateTask(task.id, {
      completedAt: isCompleted ? undefined : new Date(),
    });
  };

  const priorityColor = task.labels.includes('high-priority') 
    ? 'border-destructive bg-destructive/10' 
    : task.labels.includes('medium-priority')
    ? 'border-accent bg-accent/10'
    : 'border-muted bg-muted/10';

  if (isDragging) {
    return (
      <div
        ref={combinedRef}
        style={style}
        className="opacity-50"
      >
        <Card className="kanban-card">
          <CardContent className="p-3">
            <div className="h-16 bg-muted/20 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      ref={combinedRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className={`kanban-card group cursor-pointer ${priorityColor} border-l-4`}>
        <CardContent className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Emoji */}
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                  >
                    <span className="text-sm">
                      {task.emoji || '➕'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={280}
                    height={350}
                    previewConfig={{ showPreview: false }}
                  />
                </PopoverContent>
              </Popover>

              {/* Completion checkbox */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/10"
                onClick={handleComplete}
              >
                <CheckCircle2 
                  className={`h-4 w-4 ${
                    task.completedAt 
                      ? 'text-primary fill-primary/20' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </Button>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Drag handle */}
              <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground" />
              </div>

              {/* More options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-body font-medium"
                placeholder="Task title..."
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-caption resize-none"
                placeholder="Add description..."
                rows={2}
              />
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleSave} className="h-6 px-2 text-xs">
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 px-2 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div onClick={() => setIsEditing(true)}>
              <h4 className={`text-body font-medium mb-1 ${
                task.completedAt ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h4>
              
              {task.description && (
                <p className="text-caption text-muted-foreground mb-2">
                  {task.description}
                </p>
              )}
            </div>
          )}

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs px-1 py-0">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="h-3 w-3" />
                <span>Done</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});