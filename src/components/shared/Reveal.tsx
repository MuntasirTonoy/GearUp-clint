"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "scale-in";
  delay?: number;
  threshold?: number;
}

export default function Reveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.05,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        animation === "fade-up" ? "reveal-fade-up" : "reveal-scale-in",
        isVisible && "reveal-visible",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
