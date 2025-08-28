# Screenshots

This folder contains UI progress shots and visual documentation for VibeDeck.

## 📸 Screenshot Guidelines

### Naming Convention
Use descriptive names with timestamps:
- `dashboard-overview-2024-08-28.png`
- `theme-switching-demo-2024-08-28.gif`
- `mobile-responsive-layout-2024-08-28.png`
- `drag-drop-interaction-2024-08-28.gif`

### Recommended Screenshots

#### Core Features
- [ ] **Main Dashboard**: Full Kanban board with all themes
- [ ] **Theme Switching**: Before/after comparison of theme changes
- [ ] **Drag & Drop**: Animated GIF showing task movement
- [ ] **Mobile View**: Responsive layout on different screen sizes
- [ ] **Task Management**: Creating, editing, and deleting tasks

#### UI Components
- [ ] **Header**: Logo, title, and theme selector
- [ ] **Kanban Columns**: Different column states and styling
- [ ] **Task Cards**: Various task card designs and states
- [ ] **Dialogs**: Add task and add column modals
- [ ] **Quick Add FAB**: Floating action button interactions

#### Themes Showcase
- [ ] **Minimal Pastel**: Light, soft aesthetic
- [ ] **Dark Academia**: Cozy, studious theme
- [ ] **Y2K Cyber**: Futuristic neon theme

#### Responsive Design
- [ ] **Desktop**: Full-width layout (1920x1080)
- [ ] **Tablet**: Medium screen layout (768x1024)
- [ ] **Mobile**: Phone layout (375x667)

### Tools for Screenshots

#### Browser Screenshots
- **Chrome DevTools**: Device simulation and responsive testing
- **Firefox Developer Tools**: Built-in screenshot functionality
- **Safari Web Inspector**: iOS device simulation

#### Screen Recording
- **macOS**: QuickTime Player or Screenshot app (Cmd+Shift+5)
- **Windows**: Xbox Game Bar (Win+G) or Snipping Tool
- **Cross-platform**: OBS Studio, Loom, or CloudApp

#### Browser Extensions
- **Full Page Screen Capture**: Capture entire page
- **Awesome Screenshot**: Annotate and edit screenshots
- **Nimbus Screenshot**: Advanced screenshot features

### Image Specifications

#### Static Screenshots
- **Format**: PNG for UI screenshots, JPG for photos
- **Resolution**: Minimum 1920x1080 for desktop views
- **Quality**: High quality, no compression artifacts
- **File Size**: Keep under 2MB per image

#### Animated GIFs
- **Format**: GIF or MP4 for animations
- **Duration**: 3-10 seconds for interactions
- **Frame Rate**: 30fps for smooth animations
- **File Size**: Keep under 5MB per GIF

### Organization Structure

```
screenshots/
├── features/
│   ├── kanban-board/
│   ├── theme-switching/
│   ├── drag-drop/
│   └── mobile-responsive/
├── themes/
│   ├── minimal-pastel/
│   ├── dark-academia/
│   └── y2k-cyber/
├── components/
│   ├── header/
│   ├── task-cards/
│   ├── columns/
│   └── dialogs/
└── marketing/
    ├── hero-shots/
    ├── feature-highlights/
    └── social-media/
```

### Usage in Documentation

#### README.md
Include hero shot and key feature demonstrations:
```markdown
![VibeDeck Dashboard](screenshots/features/kanban-board/dashboard-overview.png)
```

#### GitHub Issues
Reference specific UI elements or bugs:
```markdown
![Bug Screenshot](screenshots/bugs/drag-drop-issue-2024-08-28.png)
```

#### Pull Requests
Show before/after comparisons:
```markdown
## Before
![Before](screenshots/pr-123/before.png)

## After  
![After](screenshots/pr-123/after.png)
```

### Best Practices

#### Capture Guidelines
- **Clean State**: Remove personal data and use sample content
- **Consistent Viewport**: Use standard browser sizes
- **Good Lighting**: Ensure proper contrast and visibility
- **Focus Areas**: Highlight relevant UI elements

#### Privacy & Security
- **No Personal Data**: Use placeholder or sample data only
- **No Sensitive Info**: Avoid API keys, tokens, or credentials
- **Public Safe**: Ensure all content is appropriate for public viewing

#### Version Control
- **Git LFS**: Consider using Git Large File Storage for large images
- **Compression**: Optimize images before committing
- **Selective Commits**: Don't commit all screenshots, curate the best ones

---

## 📝 Current Status

**Last Updated**: 2024-08-28  
**Screenshots Captured**: 0  
**Priority**: Capture initial dashboard and theme switching demos

### Next Steps
1. Set up screenshot capture workflow
2. Take initial dashboard screenshots in all themes
3. Create animated GIFs of key interactions
4. Organize files according to folder structure
5. Update README.md with hero shots
