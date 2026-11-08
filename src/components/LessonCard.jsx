export default function LessonCard({ lesson, onClick }) {
  const isBreak = lesson.title.toLowerCase().includes('обед');

  return (
    <div
      className={`lesson-card ${isBreak ? 'lesson-break' : ''}`}
      onClick={() => onClick(lesson)}
      title={lesson.title}
    >
      <div className="lesson-time">{lesson.time}</div>
      <div className="lesson-title">{lesson.title}</div>
      {(lesson.notes || lesson.literature || lesson.links?.length > 0) && (
        <div className="lesson-has-data" title="Есть заметки/литература">●</div>
      )}
    </div>
  );
}
