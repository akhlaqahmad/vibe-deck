import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Sparkles
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { TaskCard } from './TaskCard';
import { Column } from '@/types/kanban';

interface KanbanColumnProps {
  column: Column;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { 
    getTasksByColumn, 
    addTask, 
    updateColumn, 
    deleteColumn,
    dragState 
  } = useKanbanStore();
  
  const tasks = getTasksByColumn(column.id);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(column.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  const handleTitleSave = () => {
    if (editTitle.trim()) {
      updateColumn(column.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    updateColumn(column.id, { emoji: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const completedTasksCount = tasks.filter(task => task.completedAt).length;
  const totalTasksCount = tasks.length;

  return (
    <motion.div
      layout
      className="kanban-column w-full min-w-[280px] max-w-[320px] flex-shrink-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: column.position * 0.1 }}
    >
      <div 
        ref={setNodeRef}
        className={`h-full transition-colors duration-200 ${
          isOver && dragState.isDragging 
            ? 'bg-primary/5 border-2 border-dashed border-primary rounded-xl' 
            : ''
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 flex-1">
            {/* Emoji */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <span className="text-lg">
                    {column.emoji || '📋'}
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

            {/* Title */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className="h-8 text-h3 font-semibold border-none p-0 focus-visible:ring-1"
                  autoFocus
                />
              ) : (
                <div onClick={() => setIsEditingTitle(true)}>
                  <h3 className="text-h3 font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                    {column.title}
                  </h3>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-1">
                <p className="text-caption text-muted-foreground">
                  {totalTasksCount} tasks
                </p>
                {completedTasksCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-caption text-primary font-medium">
                      {completedTasksCount} done
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingTask(true)}
              className="hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Rename Column
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteColumn(column.id)}
                  className="text-destructive"
                  disabled={Object.keys(useKanbanStore.getState().board.columns).length <= 1}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="space-y-3 min-h-[200px] pb-4">
          {/* Quick Add Task */}
          <AnimatePresence>
            {isAddingTask && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="p-3 border-dashed border-2 border-primary/30 bg-primary/5">
                  <Input
                    placeholder="Enter task title... (Press Enter to save)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={() => {
                      if (!newTaskTitle.trim()) {
                        setIsAddingTask(false);
                      }
                    }}
                    autoFocus
                    className="border-none p-0 focus-visible:ring-0 text-body placeholder:text-muted-foreground bg-transparent"
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks List */}
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </SortableContext>

          {/* Empty State */}
          {tasks.length === 0 && !isAddingTask && (
            <motion.div 
              className="flex flex-col items-center justify-center py-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-caption text-muted-foreground mb-2">
                No tasks yet
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTask(true)}
                className="text-primary hover:bg-primary/10"
              >
                Add your first task
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}