import type { Route } from "next";

export function asRoute(path: string) {
  return path as Route;
}
