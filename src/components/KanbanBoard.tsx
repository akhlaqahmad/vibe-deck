import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Circle, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  color: string;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    icon: <Circle className="w-5 h-5" />,
    tasks: [
      {
        id: '1',
        title: 'Design new landing page',
        description: 'Create a modern, aesthetic design for the homepage',
        priority: 'high',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Research competitors',
        description: 'Analyze what similar apps are doing well',
        priority: 'medium',
        createdAt: new Date()
      }
    ],
    color: 'from-secondary to-secondary-glow'
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    icon: <AlertCircle className="w-5 h-5" />,
    tasks: [
      {
        id: '3',
        title: 'Implement drag & drop',
        description: 'Add smooth drag and drop functionality',
        priority: 'high',
        createdAt: new Date()
      }
    ],
    color: 'from-accent to-accent-glow'
  },
  {
    id: 'done',
    title: 'Done',
    icon: <CheckCircle className="w-5 h-5" />,
    tasks: [
      {
        id: '4',
        title: 'Set up project structure',
        description: 'Initialize the project with all necessary dependencies',
        priority: 'medium',
        createdAt: new Date()
      }
    ],
    color: 'from-primary to-primary-glow'
  }
];

function TaskCard({ task, columnId, onTaskClick }: { 
  task: Task; 
  columnId: string; 
  onTaskClick: (task: Task) => void; 
}) {
  const priorityColors = {
    low: 'bg-muted',
    medium: 'bg-accent/20',
    high: 'bg-destructive/20'
  };

  const priorityBorders = {
    low: 'border-muted-foreground/20',
    medium: 'border-accent',
    high: 'border-destructive'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card 
        className={`kanban-card cursor-pointer group ${priorityColors[task.priority]} border-l-4 ${priorityBorders[task.priority]}`}
        onClick={() => onTaskClick(task)}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-body font-medium text-card-foreground group-hover:text-primary transition-colors">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-caption text-muted-foreground mb-3">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]} ${priorityBorders[task.priority]} border`}>
              {task.priority}
            </span>
            <span className="text-xs text-muted-foreground">
              {task.createdAt.toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function KanbanColumn({ column, onAddTask }: { 
  column: Column; 
  onAddTask: (columnId: string, title: string) => void; 
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim());
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

  return (
    <motion.div
      layout
      className="kanban-column w-full min-w-[280px] max-w-[320px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${column.color}`}>
            {column.icon}
          </div>
          <div>
            <h3 className="text-h3 font-semibold text-foreground">
              {column.title}
            </h3>
            <p className="text-caption text-muted-foreground">
              {column.tasks.length} tasks
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingTask(true)}
          className="hover:shadow-glow transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onTaskClick={() => {}}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="p-3 border-dashed border-2 border-primary/30">
                <Input
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={() => {
                    if (!newTaskTitle.trim()) {
                      setIsAddingTask(false);
                    }
                  }}
                  autoFocus
                  className="border-none p-0 focus-visible:ring-0 text-body placeholder:text-muted-foreground"
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const handleAddTask = (columnId: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority: 'medium',
      createdAt: new Date()
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-h2 font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Aesthetic Workspace
        </h2>
        <p className="text-body text-muted-foreground">
          Organize your tasks with style and get things done ✨
        </p>
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddTask={handleAddTask}
          />
        ))}
      </div>
    </div>
  );
}