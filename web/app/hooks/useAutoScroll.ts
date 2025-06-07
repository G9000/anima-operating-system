import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-scrolling to bottom when content changes
 * @param dependencies - Array of dependencies that trigger scroll
 * @param behavior - Scroll behavior ('auto' | 'smooth')
 * @returns ref to attach to scrollable container
 */
export function useAutoScroll<T extends HTMLElement>(
  dependencies: any[] = [],
  behavior: ScrollBehavior = 'auto'
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    }
  }, dependencies);

  return containerRef;
}

/**
 * Custom hook for managing scrollable containers with custom scrollbar
 * @param scrollVariant - Type of custom scrollbar to use
 * @param autoScroll - Whether to auto-scroll on content changes
 * @param dependencies - Dependencies for auto-scroll
 * @returns object with ref and utility functions
 */
export function useCustomScrollbar<T extends HTMLElement>(
  scrollVariant: 'default' | 'thin' | 'blue' = 'default',
  autoScroll: boolean = false,
  dependencies: any[] = []
) {
  const containerRef = useRef<T>(null);

  // Auto-scroll to bottom when dependencies change
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, dependencies);

  // Get the appropriate CSS class for the scrollbar variant
  const getScrollbarClass = () => {
    switch (scrollVariant) {
      case 'thin':
        return 'custom-scrollbar-thin';
      case 'blue':
        return 'custom-scrollbar-blue';
      default:
        return 'custom-scrollbar';
    }
  };

  // Utility functions
  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    containerRef.current?.scrollTo({ top: 0, behavior });
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const scrollToElement = (selector: string, behavior: ScrollBehavior = 'smooth') => {
    if (containerRef.current) {
      const element = containerRef.current.querySelector(selector);
      element?.scrollIntoView({ behavior, block: 'nearest' });
    }
  };

  return {
    ref: containerRef,
    className: getScrollbarClass(),
    scrollToTop,
    scrollToBottom,
    scrollToElement,
  };
}
