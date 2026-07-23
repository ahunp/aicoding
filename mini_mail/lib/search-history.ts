"use client";

const KEY = "jiongou_search_history";
const MAX = 10;

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addSearchQuery(q: string): void {
  if (!q.trim()) return;
  try {
    const list = getSearchHistory().filter((x) => x !== q);
    list.unshift(q.trim());
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch { /* noop */ }
}

export function clearSearchHistory(): void {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
