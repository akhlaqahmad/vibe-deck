import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Board, Task, Column, DragState } from '@/types/kanban';

interface KanbanStore {
  // State
  board: Board;
  dragState: DragState;
  history: Board[];
  historyIndex: number;
  
  // Actions
  addTask: (columnId: string, title: string, description?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, toColumnId: string, position?: number) => void;
  
  addColumn: (title: string, position?: number) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  
  setDragState: (state: Partial<DragState>) => void;
  clearDragState: () => void;
  
  undo: () => void;
  redo: () => void;
  
  // Utility
  getTasksByColumn: (columnId: string) => Task[];
  getTotalTasks: () => number;
}

const createInitialBoard = (): Board => ({
  id: nanoid(),
  title: 'My Aesthetic Board',
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      emoji: '📝',
      position: 0,
      color: 'from-secondary to-secondary-glow',
      taskIds: []
    },
    'inprogress': {
      id: 'inprogress',
      title: 'In Progress',
      emoji: '🚀',
      position: 1,
      color: 'from-accent to-accent-glow',
      taskIds: []
    },
    'done': {
      id: 'done',
      title: 'Done',
      emoji: '✨',
      position: 2,
      color: 'from-primary to-primary-glow',
      taskIds: []
    }
  },
  tasks: {},
  columnOrder: ['todo', 'inprogress', 'done']
});

const createSampleTasks = (): Record<string, Task> => {
  const tasks: Record<string, Task> = {};
  
  const sampleTasks = [
    {
      id: nanoid(),
      title: 'Design new landing page',
      description: 'Create a modern, aesthetic design for the homepage',
      emoji: '🎨',
      labels: ['design', 'high-priority'],
      columnId: 'todo',
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: nanoid(),
      title: 'Research competitors',
      description: 'Analyze what similar apps are doing well',
      emoji: '🔍',
      labels: ['research'],
      columnId: 'todo',
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: nanoid(),
      title: 'Implement drag & drop',
      description: 'Add smooth drag and drop functionality',
      emoji: '🖱️',
      labels: ['development', 'high-priority'],
      columnId: 'inprogress',
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: nanoid(),
      title: 'Set up project structure',
      description: 'Initialize the project with all necessary dependencies',
      emoji: '📁',
      labels: ['setup'],
      columnId: 'done',
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date()
    }
  ];

  sampleTasks.forEach(task => {
    tasks[task.id] = task;
  });

  return tasks;
};

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      board: (() => {
        const initialBoard = createInitialBoard();
        const sampleTasks = createSampleTasks();
        
        // Add sample task IDs to columns
        initialBoard.tasks = sampleTasks;
        Object.values(sampleTasks).forEach(task => {
          initialBoard.columns[task.columnId].taskIds.push(task.id);
        });
        
        return initialBoard;
      })(),
      
      dragState: {
        isDragging: false
      },
      
      history: [],
      historyIndex: -1,

      addTask: (columnId, title, description) => {
        set((state) => {
          const newTask: Task = {
            id: nanoid(),
            title,
            description,
            labels: [],
            columnId,
            position: state.board.columns[columnId].taskIds.length,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const updatedBoard = {
            ...state.board,
            tasks: {
              ...state.board.tasks,
              [newTask.id]: newTask
            },
            columns: {
              ...state.board.columns,
              [columnId]: {
                ...state.board.columns[columnId],
                taskIds: [...state.board.columns[columnId].taskIds, newTask.id]
              }
            }
          };

          return {
            board: updatedBoard,
            history: [...state.history.slice(0, state.historyIndex + 1), state.board],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          const task = state.board.tasks[taskId];
          if (!task) return state;

          const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date()
          };

          return {
            board: {
              ...state.board,
              tasks: {
                ...state.board.tasks,
                [taskId]: updatedTask
              }
            }
          };
        });
      },

      deleteTask: (taskId) => {
        set((state) => {
          const task = state.board.tasks[taskId];
          if (!task) return state;

          const { [taskId]: deletedTask, ...remainingTasks } = state.board.tasks;
          const updatedColumns = {
            ...state.board.columns,
            [task.columnId]: {
              ...state.board.columns[task.columnId],
              taskIds: state.board.columns[task.columnId].taskIds.filter(id => id !== taskId)
            }
          };

          const updatedBoard = {
            ...state.board,
            tasks: remainingTasks,
            columns: updatedColumns
          };

          return {
            board: updatedBoard,
            history: [...state.history.slice(0, state.historyIndex + 1), state.board],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      moveTask: (taskId, toColumnId, position) => {
        set((state) => {
          const task = state.board.tasks[taskId];
          if (!task) return state;

          const fromColumnId = task.columnId;
          const fromColumn = state.board.columns[fromColumnId];
          const toColumn = state.board.columns[toColumnId];

          // Remove from source column
          const newFromTaskIds = fromColumn.taskIds.filter(id => id !== taskId);
          
          // Add to destination column
          const insertPosition = position ?? toColumn.taskIds.length;
          const newToTaskIds = [...toColumn.taskIds];
          newToTaskIds.splice(insertPosition, 0, taskId);

          const updatedTask = {
            ...task,
            columnId: toColumnId,
            position: insertPosition,
            updatedAt: new Date(),
            ...(toColumnId === 'done' ? { completedAt: new Date() } : { completedAt: undefined })
          };

          const updatedBoard = {
            ...state.board,
            tasks: {
              ...state.board.tasks,
              [taskId]: updatedTask
            },
            columns: {
              ...state.board.columns,
              [fromColumnId]: {
                ...fromColumn,
                taskIds: newFromTaskIds
              },
              [toColumnId]: {
                ...toColumn,
                taskIds: newToTaskIds
              }
            }
          };

          return {
            board: updatedBoard,
            history: [...state.history.slice(0, state.historyIndex + 1), state.board],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      addColumn: (title, position) => {
        set((state) => {
          if (Object.keys(state.board.columns).length >= 5) return state;

          const newColumn: Column = {
            id: nanoid(),
            title,
            position: position ?? Object.keys(state.board.columns).length,
            color: 'from-muted to-muted-foreground',
            taskIds: []
          };

          const updatedBoard = {
            ...state.board,
            columns: {
              ...state.board.columns,
              [newColumn.id]: newColumn
            },
            columnOrder: [...state.board.columnOrder, newColumn.id]
          };

          return {
            board: updatedBoard,
            history: [...state.history.slice(0, state.historyIndex + 1), state.board],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      updateColumn: (columnId, updates) => {
        set((state) => {
          const column = state.board.columns[columnId];
          if (!column) return state;

          return {
            board: {
              ...state.board,
              columns: {
                ...state.board.columns,
                [columnId]: { ...column, ...updates }
              }
            }
          };
        });
      },

      deleteColumn: (columnId) => {
        set((state) => {
          const column = state.board.columns[columnId];
          if (!column || Object.keys(state.board.columns).length <= 1) return state;

          const { [columnId]: deletedColumn, ...remainingColumns } = state.board.columns;
          
          // Move tasks to first remaining column
          const firstRemainingColumnId = Object.keys(remainingColumns)[0];
          const tasksToMove = column.taskIds;
          
          const updatedTasks = { ...state.board.tasks };
          tasksToMove.forEach(taskId => {
            if (updatedTasks[taskId]) {
              updatedTasks[taskId] = {
                ...updatedTasks[taskId],
                columnId: firstRemainingColumnId,
                updatedAt: new Date()
              };
            }
          });

          const updatedColumns = {
            ...remainingColumns,
            [firstRemainingColumnId]: {
              ...remainingColumns[firstRemainingColumnId],
              taskIds: [...remainingColumns[firstRemainingColumnId].taskIds, ...tasksToMove]
            }
          };

          const updatedBoard = {
            ...state.board,
            tasks: updatedTasks,
            columns: updatedColumns,
            columnOrder: state.board.columnOrder.filter(id => id !== columnId)
          };

          return {
            board: updatedBoard,
            history: [...state.history.slice(0, state.historyIndex + 1), state.board],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      reorderColumns: (fromIndex, toIndex) => {
        set((state) => {
          const newColumnOrder = [...state.board.columnOrder];
          const [movedColumn] = newColumnOrder.splice(fromIndex, 1);
          newColumnOrder.splice(toIndex, 0, movedColumn);

          return {
            board: {
              ...state.board,
              columnOrder: newColumnOrder
            }
          };
        });
      },

      setDragState: (newState) => {
        set((state) => ({
          dragState: { ...state.dragState, ...newState }
        }));
      },

      clearDragState: () => {
        set(() => ({
          dragState: { isDragging: false }
        }));
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;
          
          return {
            board: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          
          return {
            board: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1
          };
        });
      },

      getTasksByColumn: (columnId) => {
        const state = get();
        const column = state.board.columns[columnId];
        if (!column) return [];
        
        return column.taskIds
          .map(taskId => state.board.tasks[taskId])
          .filter(Boolean)
          .sort((a, b) => a.position - b.position);
      },

      getTotalTasks: () => {
        const state = get();
        return Object.keys(state.board.tasks).length;
      }
    }),
    {
      name: 'kanban-board-storage',
      partialize: (state) => ({
        board: state.board,
        history: state.history,
        historyIndex: state.historyIndex
      })
    }
  )
);