// Anti-cheat detection utilities

export type CheatEvent = 
  | 'visibility-change'
  | 'window-blur'
  | 'right-click'
  | 'copy-paste'
  | 'tab-switch'
  | 'focus-loss';

export interface CheatDetectionConfig {
  onCheatDetected: (event: CheatEvent) => void;
  enabled: boolean;
}

let listeners: (() => void)[] = [];

export function setupAntiCheat(config: CheatDetectionConfig) {
  if (!config.enabled) return;

  // Visibility change detection
  const handleVisibilityChange = () => {
    if (document.hidden) {
      config.onCheatDetected('visibility-change');
    }
  };

  // Window blur detection
  const handleWindowBlur = () => {
    config.onCheatDetected('window-blur');
  };

  // Right-click prevention
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    config.onCheatDetected('right-click');
  };

  // Copy/Paste prevention
  const handleKeyDown = (e: KeyboardEvent) => {
    // Detect Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
      e.preventDefault();
      config.onCheatDetected('copy-paste');
    }
    
    // Detect common developer tools shortcuts
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
      config.onCheatDetected('copy-paste');
    }
    
    // F12 key
    if (e.key === 'F12') {
      e.preventDefault();
      config.onCheatDetected('copy-paste');
    }
  };

  // Focus loss detection
  const handleFocusOut = (e: FocusEvent) => {
    if (!document.hasFocus()) {
      config.onCheatDetected('focus-loss');
    }
  };

  // Add event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleWindowBlur);
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('focusout', handleFocusOut);

  // Store cleanup functions
  listeners = [
    () => document.removeEventListener('visibilitychange', handleVisibilityChange),
    () => window.removeEventListener('blur', handleWindowBlur),
    () => document.removeEventListener('contextmenu', handleContextMenu),
    () => document.removeEventListener('keydown', handleKeyDown),
    () => window.removeEventListener('focusout', handleFocusOut),
  ];
}

export function cleanupAntiCheat() {
  listeners.forEach(cleanup => cleanup());
  listeners = [];
}

// Prevent text selection
export function preventTextSelection() {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
}

export function allowTextSelection() {
  document.body.style.userSelect = 'auto';
  document.body.style.webkitUserSelect = 'auto';
}