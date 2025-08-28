import React from 'react';
import { Header } from '@/components/Header';
import { Board } from '@/components/Board';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl">
        <Board />
      </main>
    </div>
  );
};

export default Index;
