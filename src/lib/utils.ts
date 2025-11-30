import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArray(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function formatLocation(suburb?: string | null, state?: string | null) {
  if (suburb && state) return `${suburb}, ${state}`;
  if (suburb) return suburb;
  if (state) return state;
  return "Across Australia";
}
