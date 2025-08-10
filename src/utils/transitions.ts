// Standardized transition utilities for consistent animations across the app

export const TRANSITION_DURATIONS = {
  fast: '200ms',
  normal: '300ms', 
  slow: '500ms',
  entrance: '600ms',
  page: '400ms'
} as const;

export const TRANSITION_EASINGS = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Default smooth
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce effect
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease
} as const;

// Standard page entrance transition
export const pageEntranceTransition = (isVisible: boolean) => 
  `transition-all duration-400 ease-out ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`;

// Staggered entrance animations with delays
export const staggeredEntrance = (isVisible: boolean, delay: number = 0) =>
  `transition-all duration-400 ease-out ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
  }`;

// Button hover transitions
export const buttonTransition = () =>
  'transition-all duration-200 ease-out transform hover:scale-105 active:scale-95';

// Card hover transitions
export const cardTransition = () =>
  'transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1';

// Standard page container transition classes
export const pageContainer = (isVisible: boolean) =>
  `min-h-screen transition-opacity duration-400 ease-out ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`;

// Modal/overlay transitions
export const modalTransition = (isOpen: boolean) =>
  `transition-all duration-300 ease-out ${
    isOpen 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95 pointer-events-none'
  }`;

// Content section transitions with delays
export const contentSection = (isVisible: boolean, delayMs: number = 0) => ({
  className: `transition-all duration-500 ease-out ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`,
  style: { transitionDelay: `${delayMs}ms` }
});

// React import for the hook
import React from 'react';

// Smooth navigation transition hook
export const usePageTransition = (duration: number = 400) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return { isVisible, setIsVisible };
};