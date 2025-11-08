"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = "", title }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

