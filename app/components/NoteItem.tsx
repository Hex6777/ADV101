"use client";

import type { Note } from "../page";

type NoteItemProps = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export default function NoteItem({
  note,
  onEdit,
  onDelete,
}: NoteItemProps) {
  return (
    <article className="note-card">
      <div className="note-card-top">
        <div className="note-symbol">
          📝
        </div>

        <div className="note-buttons">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(note)}
          >
            ✏ Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(note.id)}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      <div className="note-body">
        <h3>{note.title}</h3>

        <p>{note.description}</p>
      </div>

      <div className="note-date">
        Created{" "}
        {new Date(note.createdAt).toLocaleString()}
      </div>
    </article>
  );
}