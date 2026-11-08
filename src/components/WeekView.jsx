import { DAY_NAMES, DAY_NAMES_FULL, formatDate, getWeekDays } from '../hooks/useSchedule';
import LessonCard from './LessonCard';

const TIME_SLOTS = [
  '08:00','09:00','10:00','11:00','12:00','12:30','13:00','14:00',
  '15:00','16:00','17:00','18:00','18:30','19:00','20:00'
];

export default function WeekView({ monday, lessons, today, onLessonClick, onAddLesson, onDayHeaderClick }) {
  const days = getWeekDays(monday);

  function getLessonAt(date, time) {
    return lessons[date]?.filter(l => l.time === time) || [];
  }

  return (
    <div className="week-view">
      {/* Desktop grid */}
      <div className="week-grid">
        <div className="week-time-col week-header-cell" />
        {days.map((date, i) => (
          <div key={date} className={`week-day-header ${date === today ? 'today' : ''}`}>
            <span className="day-short">{DAY_NAMES[i]}</span>
            <span className="day-date">{formatDate(date)}</span>
          </div>
        ))}
        {TIME_SLOTS.map(time => (
          <div key={time} className="week-row-wrapper">
            <div className="week-time-col week-time-label">{time}</div>
            {days.map(date => {
              const cells = getLessonAt(date, time);
              return (
                <div
                  key={date}
                  className="week-cell"
                  onClick={() => cells.length === 0 && onAddLesson(date, time)}
                >
                  {cells.map(lesson => (
                    <LessonCard key={lesson.id} lesson={lesson} onClick={onLessonClick} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: stacked day cards */}
      <div className="week-mobile">
        {days.map((date, i) => {
          const dayLessons = lessons[date] || [];
          return (
            <div key={date} className={`mobile-day ${date === today ? 'today' : ''}`}>
              <div
                className="mobile-day-header"
                onClick={() => onDayHeaderClick && onDayHeaderClick(date)}
              >
                <strong>{DAY_NAMES_FULL[i]}</strong>
                <span>{formatDate(date)}</span>
              </div>
              {dayLessons.length === 0 ? (
                <div className="mobile-empty">Нет уроков</div>
              ) : (
                <div className="mobile-day-lessons">
                  {dayLessons.map(lesson => (
                    <LessonCard key={lesson.id} lesson={lesson} onClick={onLessonClick} />
                  ))}
                </div>
              )}
              <button className="btn-add-lesson-day" onClick={() => onAddLesson(date, '')}>
                + Добавить урок
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
