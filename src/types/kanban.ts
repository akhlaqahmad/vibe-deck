export interface Task {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  labels: string[];
  columnId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  emoji?: string;
  position: number;
  color: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  columnOrder: string[];
}

export interface DragState {
  isDragging: boolean;
  draggedTaskId?: string;
  draggedColumnId?: string;
  dragOverColumnId?: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Label {
  id: string;
  name: string;
  color: string;
}