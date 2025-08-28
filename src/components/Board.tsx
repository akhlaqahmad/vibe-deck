import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  horizontalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Plus, 
  Undo2, 
  Redo2, 
  BarChart3,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useKanbanStore } from '@/stores/kanbanStore';
import { KanbanColumn } from './KanbanColumn';
import { QuickAdd } from './QuickAdd';
import { useIsMobile } from '@/hooks/use-mobile';

export function Board() {
  const isMobile = useIsMobile();
  const {
    board,
    dragState,
    setDragState,
    clearDragState,
    moveTask,
    addColumn,
    reorderColumns,
    undo,
    redo,
    history,
    historyIndex,
    getTotalTasks
  } = useKanbanStore();

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDragState({
      isDragging: true,
      draggedTaskId: active.id as string,
    });
  }, [setDragState]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTaskId = active.id as string;
    const overId = over.id as string;

    // Check if we're hovering over a column
    if (board.columns[overId]) {
      setDragState({ dragOverColumnId: overId });
    }
  }, [board.columns, setDragState]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    clearDragState();

    if (!over) return;

    const draggedTaskId = active.id as string;
    const overId = over.id as string;
    const draggedTask = board.tasks[draggedTaskId];

    if (!draggedTask) return;

    // If dropped on a column
    if (board.columns[overId]) {
      const targetColumnId = overId;
      if (draggedTask.columnId !== targetColumnId) {
        moveTask(draggedTaskId, targetColumnId);
      }
      return;
    }

    // If dropped on another task
    const targetTask = board.tasks[overId];
    if (targetTask && targetTask.columnId !== draggedTask.columnId) {
      const targetColumn = board.columns[targetTask.columnId];
      const targetPosition = targetColumn.taskIds.indexOf(overId);
      moveTask(draggedTaskId, targetTask.columnId, targetPosition);
    }
  }, [board, moveTask, clearDragState]);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setShowAddColumn(false);
    }
  };

  const handleColumnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      setShowAddColumn(false);
      setNewColumnTitle('');
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const orderedColumns = board.columnOrder.map(id => board.columns[id]).filter(Boolean);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const totalTasks = getTotalTasks();
  const canAddColumns = Object.keys(board.columns).length < 5;

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4 md:px-6"
      >
        <div>
          <h2 className="text-h2 font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {board.title}
          </h2>
          <div className="flex items-center gap-4 text-caption text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>{totalTasks} total tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{orderedColumns.length} columns</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="h-7 w-7 p-0"
            >
              <Undo2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="h-7 w-7 p-0"
            >
              <Redo2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Add Column */}
          {canAddColumns && (
            <Dialog open={showAddColumn} onOpenChange={setShowAddColumn}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-3 w-3" />
                  {isMobile ? '' : 'Add Column'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Column</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input
                    placeholder="Column title..."
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={handleColumnKeyDown}
                    autoFocus
                  />
                  <Button onClick={handleAddColumn} disabled={!newColumnTitle.trim()}>
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {/* Board Content */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-6 h-full">
            <SortableContext
              items={orderedColumns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {orderedColumns.map((column, index) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                />
              ))}
            </SortableContext>

            {/* Add Column Quick Button */}
            {canAddColumns && (
              <motion.div
                className="min-w-[280px] flex-shrink-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: orderedColumns.length * 0.1 + 0.2 }}
              >
                <Card 
                  className="kanban-column border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                  onClick={() => setShowAddColumn(true)}
                >
                  <div className="text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-body font-medium text-muted-foreground">
                      Add Column
                    </p>
                    <p className="text-caption text-muted-foreground">
                      Create a new workflow stage
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </DndContext>
      </div>

      {/* Quick Add FAB */}
      <QuickAdd />
    </div>
  );
}