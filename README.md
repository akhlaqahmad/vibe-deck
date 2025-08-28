# VibeDeck 

> An aesthetic Kanban board application that transforms productivity into a visual experience

VibeDeck is a modern, beautifully designed Kanban board application built with React and TypeScript. It combines powerful project management features with stunning visual aesthetics, offering multiple themes and smooth animations to make task management a delightful experience.

## Features

- **Multiple Aesthetic Themes**
  - Minimal Pastel: Soft, dreamy vibes
  - Dark Academia: Cozy, studious aesthetic  
  - Y2K Cyber: Futuristic neon dreams

- **Smooth Drag & Drop**
  - Intuitive task management with @dnd-kit
  - Mobile-friendly touch interactions
  - Visual feedback during dragging

- **Advanced Functionality**
  - Undo/Redo operations (Ctrl+Z / Ctrl+Y)
  - Persistent storage with Zustand
  - Real-time task statistics
  - Quick task addition with floating action button

- **Responsive Design**
  - Mobile-optimized interface
  - Adaptive layouts for all screen sizes
  - Touch-friendly interactions

- **Task Management**
  - Create, edit, and delete tasks
  - Add emojis and labels to tasks
  - Track task completion with timestamps
  - Organize tasks across customizable columns

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── Board.tsx        # Main Kanban board component
│   ├── Header.tsx       # Application header with theme selector
│   ├── KanbanColumn.tsx # Individual column component
│   ├── TaskCard.tsx     # Task card component
│   └── QuickAdd.tsx     # Quick task addition component
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Theme management context
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notification hook
├── lib/                 # Utility libraries
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── Index.tsx        # Main application page
│   └── NotFound.tsx     # 404 error page
├── stores/              # State management
│   └── kanbanStore.ts   # Zustand store for Kanban functionality
├── types/               # TypeScript type definitions
│   └── kanban.ts        # Kanban-related types
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd vibe-deck
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## Usage

### Basic Operations

- **Create Tasks**: Use the "+" button in any column or the floating action button
- **Move Tasks**: Drag and drop tasks between columns
- **Edit Tasks**: Click on a task to edit its details
- **Delete Tasks**: Use the delete option in the task menu
- **Undo/Redo**: Use Ctrl+Z and Ctrl+Y (or Cmd+Z/Cmd+Y on Mac)

### Theme Switching

Click the theme selector in the header to switch between:
- **Minimal Pastel**: Light, soft colors perfect for a calming workflow
- **Dark Academia**: Rich, warm tones for focused work sessions
- **Y2K Cyber**: Vibrant neon colors for energetic productivity

### Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo last action
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo action
- `Escape`: Close dialogs and cancel operations

## Architecture

### State Management

The application uses Zustand for state management with the following key features:

- **Persistent Storage**: Board state is automatically saved to localStorage
- **History Management**: Full undo/redo functionality with action history
- **Optimistic Updates**: Immediate UI updates with rollback capability

### Component Architecture

- **Compound Components**: Complex UI elements are broken into smaller, reusable components
- **Custom Hooks**: Business logic is extracted into custom hooks for reusability
- **Context API**: Theme management is handled through React Context

### Styling System

- **Design Tokens**: Consistent spacing, colors, and typography through CSS custom properties
- **Component Variants**: shadcn/ui components with custom styling variants
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [@dnd-kit](https://dndkit.com/) for drag and drop functionality

---

**Made with ❤️ and aesthetic vibes**
