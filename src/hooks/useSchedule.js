import { useState, useEffect } from 'react';
import { initialLessons } from '../data/initialSchedule';

const STORAGE_KEY = 'schedule_lessons';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(lessons) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  } catch {}
}

export function useSchedule() {
  const [lessons, setLessons] = useState(() => {
    const stored = loadFromStorage();
    return stored || initialLessons;
  });

  useEffect(() => {
    saveToStorage(lessons);
  }, [lessons]);

  function getLessonsForDate(date) {
    return Object.values(lessons)
      .filter(l => l.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  function getLessonsForWeek(mondayDate) {
    const days = getWeekDays(mondayDate);
    const result = {};
    days.forEach(d => { result[d] = getLessonsForDate(d); });
    return result;
  }

  function addLesson(lesson) {
    const id = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setLessons(prev => ({ ...prev, [id]: { ...lesson, id, notes: '', links: [], literature: '' } }));
    return id;
  }

  function updateLesson(id, updates) {
    setLessons(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  }

  function deleteLesson(id) {
    setLessons(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function resetToInitial() {
    setLessons(initialLessons);
  }

  return { lessons, getLessonsForDate, getLessonsForWeek, addLesson, updateLesson, deleteLesson, resetToInitial };
}

export function getWeekDays(mondayStr) {
  const days = [];
  const base = new Date(mondayStr + 'T00:00:00');
  for (let i = 0; i < 6; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function getMondayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=sun,1=mon,...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export const DAY_NAMES_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
