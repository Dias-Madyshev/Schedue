import { DAY_NAMES_FULL, formatDate } from '../hooks/useSchedule';
import LessonCard from './LessonCard';

export default function DayView({ date, lessons, today, onLessonClick, onAddLesson }) {
  const d = new Date(date + 'T00:00:00');
  const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
  const dayName = DAY_NAMES_FULL[dayIndex] || '';

  return (
    <div className="day-view">
      <div className={`day-view-header ${date === today ? 'today' : ''}`}>
        <h2>{dayName}</h2>
        <span className="day-view-date">{formatDate(date)}</span>
      </div>

      {lessons.length === 0 ? (
        <div className="day-empty">
          <p>Нет уроков на этот день</p>
        </div>
      ) : (
        <div className="day-lessons-list">
          {lessons.map(lesson => (
            <div key={lesson.id} className="day-lesson-row">
              <LessonCard lesson={lesson} onClick={onLessonClick} />
              {(lesson.notes || lesson.literature || lesson.links?.length > 0) && (
                <div className="day-lesson-details">
                  {lesson.literature && (
                    <div className="detail-section">
                      <span className="detail-label">Литература:</span>
                      <span>{lesson.literature}</span>
                    </div>
                  )}
                  {lesson.notes && (
                    <div className="detail-section">
                      <span className="detail-label">Заметки:</span>
                      <span>{lesson.notes}</span>
                    </div>
                  )}
                  {lesson.links?.length > 0 && (
                    <div className="detail-section">
                      <span className="detail-label">Ссылки:</span>
                      <div className="detail-links">
                        {lesson.links.map((l, i) => (
                          <a key={i} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary btn-add-day" onClick={() => onAddLesson(date, '')}>
        + Добавить урок
      </button>
    </div>
  );
}
