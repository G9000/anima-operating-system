import React, { forwardRef, HTMLProps } from "react";

type ScrollbarVariant = "default" | "thin" | "blue";

interface ScrollableContainerProps extends HTMLProps<HTMLDivElement> {
  variant?: ScrollbarVariant;
  autoScroll?: boolean;
  children: React.ReactNode;
}

const getScrollbarClass = (variant: ScrollbarVariant): string => {
  switch (variant) {
    case "thin":
      return "custom-scrollbar-thin";
    case "blue":
      return "custom-scrollbar-blue";
    default:
      return "custom-scrollbar";
  }
};

/**
 * A reusable scrollable container with custom scrollbar styling
 *
 * @param variant - The scrollbar style variant ('default' | 'thin' | 'blue')
 * @param autoScroll - Whether to automatically scroll to bottom when content changes
 * @param children - The content to render inside the scrollable container
 * @param className - Additional CSS classes to apply
 * @param ...props - Additional props to pass to the div element
 */
export const ScrollableContainer = forwardRef<
  HTMLDivElement,
  ScrollableContainerProps
>(
  (
    {
      variant = "default",
      autoScroll = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const scrollbarClass = getScrollbarClass(variant);
    const combinedClassName = `${scrollbarClass} ${className}`.trim();

    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={{
          scrollBehavior: autoScroll ? "smooth" : "auto",
          ...props.style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollableContainer.displayName = "ScrollableContainer";

/**
 * Utility function to scroll an element to the bottom
 */
export const scrollToBottom = (
  element: HTMLElement | null,
  behavior: ScrollBehavior = "smooth"
) => {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior,
    });
  }
};

/**
 * Utility function to scroll an element to the top
 */
export const scrollToTop = (
  element: HTMLElement | null,
  behavior: ScrollBehavior = "smooth"
) => {
  if (element) {
    element.scrollTo({
      top: 0,
      behavior,
    });
  }
};
