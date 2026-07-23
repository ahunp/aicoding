"use client";

const STORAGE_KEY = "jiongou_recently_viewed";
const MAX_ITEMS = 20;

export function getViewedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addViewedId(id: string): void {
  try {
    const list = getViewedIds().filter((x) => x !== id);
    list.unshift(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {
    /* localStorage not available */
  }
}
