import React from 'react';
import { Header } from '@/components/Header';
import { KanbanBoard } from '@/components/KanbanBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-7xl">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
