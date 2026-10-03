"use client";

import { useEffect, useState } from "react";
import NoteItem from "./components/NoteItem";

export type Note = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type HistoryItem = {
  id: string;
  type: "created" | "updated" | "deleted";
  title: string;
  date: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    const savedHistory = localStorage.getItem("note-history");

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch {
        setNotes([]);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      "note-history",
      JSON.stringify(history)
    );
  }, [history]);

  useEffect(() => {
    if (!title.trim()) {
      return;
    }

    const exists = notes.some(
      (note) =>
        note.title.toLowerCase().trim() ===
          title.toLowerCase().trim() &&
        note.id !== editingId
    );

    if (exists) {
      setMessage(
        "A note with this title already exists."
      );
    }
  }, [title, notes, editingId]);

  const saveNote = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setMessage("Please enter a note title.");
      return;
    }

    if (!cleanDescription) {
      setMessage("Please enter a note description.");
      return;
    }

    const duplicate = notes.some(
      (note) =>
        note.title.toLowerCase().trim() ===
          cleanTitle.toLowerCase() &&
        note.id !== editingId
    );

    if (duplicate) {
      setMessage(
        "A note with this title already exists."
      );
      return;
    }

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: cleanTitle,
                description: cleanDescription,
              }
            : note
        )
      );

      setHistory((currentHistory) => [
        {
          id: `${Date.now()}-updated`,
          type: "updated",
          title: cleanTitle,
          date: new Date().toISOString(),
        },
        ...currentHistory,
      ]);

      setEditingId(null);
      setTitle("");
      setDescription("");
      setMessage(
        `"${cleanTitle}" was updated successfully.`
      );

      return;
    }

    const newNote: Note = {
      id: `${Date.now()}`,
      title: cleanTitle,
      description: cleanDescription,
      createdAt: new Date().toISOString(),
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setHistory((currentHistory) => [
      {
        id: `${Date.now()}-created`,
        type: "created",
        title: cleanTitle,
        date: new Date().toISOString(),
      },
      ...currentHistory,
    ]);

    setTitle("");
    setDescription("");
    setMessage(
      `"${cleanTitle}" was added successfully!`
    );
  };

  const editNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    setMessage(`Editing "${note.title}"`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNote = (id: string) => {
    const note = notes.find(
      (item) => item.id === id
    );

    if (!note) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.filter(
        (item) => item.id !== id
      )
    );

    setHistory((currentHistory) => [
      {
        id: `${Date.now()}-deleted`,
        type: "deleted",
        title: note.title,
        date: new Date().toISOString(),
      },
      ...currentHistory,
    ]);

    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setDescription("");
    }

    setMessage(
      `"${note.title}" was deleted.`
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setMessage("");
  };

  const clearHistory = () => {
    setHistory([]);
    setMessage("History cleared.");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <main className="app">
      <div className="container">

        <header className="header">
          <div className="brand">
            <div className="logo">
              📝
            </div>

            <div>
              <p className="brand-label">
                NOTE APP
              </p>

              <h1>
                My Notes
              </h1>
            </div>
          </div>

          <div className="note-counter">
            <span>
              Total Notes
            </span>

            <strong>
              {notes.length}
            </strong>
          </div>
        </header>

        <section className="create-card">
          <div className="card-title">
            <div className="title-icon">
              {editingId ? "✏️" : "➕"}
            </div>

            <div>
              <h2>
                {editingId
                  ? "Update Note"
                  : "Create New Note"}
              </h2>

              <p>
                {editingId
                  ? "Update your note information."
                  : "Add a title and description to create a note."}
              </p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="note-title">
              Note Title
            </label>

            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Enter your note title..."
            />
          </div>

          <div className="field">
            <label htmlFor="note-description">
              Description
            </label>

            <textarea
              id="note-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Write your note description..."
              rows={5}
            />
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <div className="actions">
            <button
              type="button"
              className="add-button"
              onClick={saveNote}
            >
              {editingId
                ? "✓ Update Note"
                : "+ Add Note"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <span className="section-label">
                NOTES
              </span>

              <h2>
                All Notes
              </h2>

              <p>
                View and manage all your notes.
              </p>
            </div>

            <div className="section-count">
              {notes.length}
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                📋
              </div>

              <h3>
                No notes yet
              </h3>

              <p>
                Create your first note using the
                form above.
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onEdit={editNote}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          )}
        </section>

        <section className="section history-section">
          <div className="section-header">
            <div>
              <span className="section-label">
                ACTIVITY
              </span>

              <h2>
                Note History
              </h2>

              <p>
                Track everything that happens to
                your notes.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                className="clear-button"
                onClick={clearHistory}
              >
                Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                🕘
              </div>

              <h3>
                No activity yet
              </h3>

              <p>
                When you create, update or delete
                a note, it will appear here.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div
                    className={`history-icon ${item.type}`}
                  >
                    {item.type === "created"
                      ? "+"
                      : item.type === "updated"
                      ? "✏"
                      : "×"}
                  </div>

                  <div className="history-content">
                    <strong>
                      {item.type === "created"
                        ? "Note Created"
                        : item.type === "updated"
                        ? "Note Updated"
                        : "Note Deleted"}
                    </strong>

                    <span>
                      {item.title}
                    </span>
                  </div>

                  <time>
                    {formatDate(item.date)}
                  </time>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer>
          <p>
            Built with Next.js • React • TypeScript
          </p>
        </footer>

      </div>
    </main>
  );
}

