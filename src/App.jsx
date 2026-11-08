import { useState, useMemo } from 'react';
import { useSchedule, getMondayOfWeek, getWeekDays, formatDate, DAY_NAMES } from './hooks/useSchedule';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import LessonModal from './components/LessonModal';
import './App.css';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const { getLessonsForDate, getLessonsForWeek, addLesson, updateLesson, deleteLesson } = useSchedule();

  const today = getTodayStr();
  const [view, setView] = useState('week');
  const [currentMonday, setCurrentMonday] = useState(() => getMondayOfWeek(today));
  const [selectedDay, setSelectedDay] = useState(today);
  const [modal, setModal] = useState(null);

  const weekDays = useMemo(() => getWeekDays(currentMonday), [currentMonday]);

  const weekLessons = useMemo(
    () => getLessonsForWeek(currentMonday),
    [currentMonday, getLessonsForDate]
  );

  const dayLessons = useMemo(
    () => getLessonsForDate(selectedDay),
    [selectedDay, getLessonsForDate]
  );

  function prevWeek() {
    const d = new Date(currentMonday + 'T00:00:00');
    d.setDate(d.getDate() - 7);
    setCurrentMonday(d.toISOString().slice(0, 10));
  }

  function nextWeek() {
    const d = new Date(currentMonday + 'T00:00:00');
    d.setDate(d.getDate() + 7);
    setCurrentMonday(d.toISOString().slice(0, 10));
  }

  function goToToday() {
    setCurrentMonday(getMondayOfWeek(today));
    setSelectedDay(today);
  }

  function openAddLesson(date, time) {
    setModal({ lesson: null, date, time });
  }

  function openEditLesson(lesson) {
    setModal({ lesson });
  }

  function handleSaveLesson(data) {
    if (modal.lesson) {
      updateLesson(modal.lesson.id, data);
    } else {
      addLesson(data);
      setSelectedDay(data.date);
      setCurrentMonday(getMondayOfWeek(data.date));
    }
    setModal(null);
  }

  function handleDeleteLesson(id) {
    deleteLesson(id);
  }

  function handleDayClick(date) {
    setSelectedDay(date);
    setView('day');
  }

  const weekLabel = (() => {
    const last = weekDays[4];
    return `${formatDate(currentMonday)} – ${formatDate(last)}`;
  })();

  function openAddForSelectedDay() {
    setModal({ lesson: null, date: selectedDay, time: '' });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📅 Расписание</h1>
        <div className="header-nav desktop-only">
          <button className={`view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
            Неделя
          </button>
          <button className={`view-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>
            День
          </button>
        </div>
        <div className="header-right">
          <button className="btn-today" onClick={goToToday}>Сегодня</button>
          <button className="btn-add desktop-only" onClick={openAddForSelectedDay}>
            + Урок
          </button>
        </div>
      </header>

      <div className="week-nav">
        <button className="nav-arrow" onClick={prevWeek}>‹</button>
        <span className="week-label">{weekLabel}</span>
        <button className="nav-arrow" onClick={nextWeek}>›</button>
      </div>

      <div className="day-tabs">
        {weekDays.map((date, i) => (
          <button
            key={date}
            className={`day-tab ${date === today ? 'today' : ''} ${date === selectedDay && view === 'day' ? 'selected' : ''}`}
            onClick={() => handleDayClick(date)}
          >
            <span className="day-tab-short">{DAY_NAMES[i]}</span>
            <span className="day-tab-date">{formatDate(date)}</span>
          </button>
        ))}
      </div>

      <div className="main-content">
        {view === 'week' && (
          <WeekView
            monday={currentMonday}
            lessons={weekLessons}
            today={today}
            onLessonClick={openEditLesson}
            onAddLesson={openAddLesson}
            onDayHeaderClick={handleDayClick}
          />
        )}

        {view === 'day' && (
          <DayView
            date={selectedDay}
            lessons={dayLessons}
            today={today}
            onLessonClick={openEditLesson}
            onAddLesson={openAddLesson}
          />
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav mobile-only">
        <button
          className={`bottom-nav-btn ${view === 'week' ? 'active' : ''}`}
          onClick={() => setView('week')}
        >
          <span className="bottom-nav-icon">📆</span>
          <span className="bottom-nav-label">Неделя</span>
        </button>
        <button
          className={`bottom-nav-btn ${view === 'day' ? 'active' : ''}`}
          onClick={() => setView('day')}
        >
          <span className="bottom-nav-icon">📋</span>
          <span className="bottom-nav-label">День</span>
        </button>
      </nav>

      {/* Mobile FAB */}
      <button className="fab mobile-only" onClick={openAddForSelectedDay} aria-label="Добавить урок">
        +
      </button>

      {modal && (
        <LessonModal
          lesson={modal.lesson}
          date={modal.date}
          time={modal.time}
          onSave={handleSaveLesson}
          onDelete={handleDeleteLesson}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
