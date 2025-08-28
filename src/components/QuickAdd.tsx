import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useKanbanStore } from '@/stores/kanbanStore';
import { useIsMobile } from '@/hooks/use-mobile';

export function QuickAdd() {
  const isMobile = useIsMobile();
  const { board, addTask } = useKanbanStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const orderedColumns = board.columnOrder.map(id => board.columns[id]).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && selectedColumn) {
      addTask(selectedColumn, title.trim(), description.trim() || undefined);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedColumn('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Quick keyboard shortcut to open
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedColumn(orderedColumns[0]?.id || '');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [orderedColumns]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.5 
        }}
      >
        <Button
          onClick={() => {
            setIsOpen(true);
            setSelectedColumn(orderedColumns[0]?.id || '');
          }}
          className="w-14 h-14 rounded-full shadow-elevated gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <Plus className="w-6 h-6 text-background" />
        </Button>
      </motion.div>

      {/* Quick Add Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Add Task
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Column Selection */}
            <div>
              <label className="text-caption font-medium text-foreground mb-2 block">
                Column
              </label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column..." />
                </SelectTrigger>
                <SelectContent>
                  {orderedColumns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      <div className="flex items-center gap-2">
                        <span>{column.emoji || '📋'}</span>
                        <span>{column.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Title */}
            <div>
              <label className="text-caption font-medium text-foreground mb-2 block">
                Task Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                className="w-full"
                autoFocus
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="text-caption font-medium text-foreground mb-2 block">
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add more details..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={!title.trim() || !selectedColumn}
                className="flex-1 gap-2"
              >
                <Send className="w-4 h-4" />
                Add Task
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>

            {/* Keyboard Hint */}
            <p className="text-xs text-muted-foreground text-center">
              Press {isMobile ? 'Enter' : 'Cmd/Ctrl + Enter'} to add task, Esc to cancel
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}