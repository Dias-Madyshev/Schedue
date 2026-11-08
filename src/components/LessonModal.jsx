import { useState, useEffect } from 'react';

export default function LessonModal({ lesson, date, time, onSave, onDelete, onClose }) {
  const isNew = !lesson;
  const [title, setTitle] = useState(lesson?.title || '');
  const [lessonDate, setLessonDate] = useState(lesson?.date || date || '');
  const [lessonTime, setLessonTime] = useState(lesson?.time || time || '');
  const [notes, setNotes] = useState(lesson?.notes || '');
  const [literature, setLiterature] = useState(lesson?.literature || '');
  const [linkInput, setLinkInput] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [links, setLinks] = useState(lesson?.links || []);

  function handleSave() {
    if (!title.trim() || !lessonDate || !lessonTime) return;
    onSave({ title: title.trim(), date: lessonDate, time: lessonTime, notes, literature, links });
  }

  function addLink() {
    if (!linkInput.trim()) return;
    setLinks(prev => [...prev, { url: linkInput.trim(), label: linkLabel.trim() || linkInput.trim() }]);
    setLinkInput('');
    setLinkLabel('');
  }

  function removeLink(i) {
    setLinks(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isNew ? 'Новый урок' : 'Редактировать урок'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label>Название *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Starters 3, Beginner..."
              autoFocus
            />
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>Дата *</label>
              <input type="date" value={lessonDate} onChange={e => setLessonDate(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Время *</label>
              <input type="time" value={lessonTime} onChange={e => setLessonTime(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <label>Литература</label>
            <textarea
              value={literature}
              onChange={e => setLiterature(e.target.value)}
              placeholder="Учебники, страницы, упражнения..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <label>Заметки</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Дополнительные заметки к уроку..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <label>Ссылки</label>
            <div className="link-add-row">
              <input
                type="text"
                value={linkLabel}
                onChange={e => setLinkLabel(e.target.value)}
                placeholder="Название (необязательно)"
                className="link-label-input"
              />
              <input
                type="url"
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                placeholder="https://..."
                className="link-url-input"
                onKeyDown={e => e.key === 'Enter' && addLink()}
              />
              <button className="btn-secondary btn-sm" onClick={addLink}>+</button>
            </div>
            {links.length > 0 && (
              <ul className="links-list">
                {links.map((l, i) => (
                  <li key={i}>
                    <a href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
                    <button className="btn-icon btn-danger-sm" onClick={() => removeLink(i)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {!isNew && (
            <button className="btn-danger" onClick={() => { onDelete(lesson.id); onClose(); }}>
              Удалить
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn-secondary" onClick={onClose}>Отмена</button>
            <button className="btn-primary" onClick={handleSave} disabled={!title.trim() || !lessonDate || !lessonTime}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
