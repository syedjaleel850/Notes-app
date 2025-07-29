import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to load notes. Please try again."
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [navigate, token]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/notes",
        { title: title.trim(), description: description.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prevNotes) => [response.data, ...prevNotes]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`http://localhost:8080/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete note");
    }
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditDescription("");
    setError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editTitle.trim() && !editDescription.trim()) {
      setError("Please enter title or description to update");
      return;
    }

    setIsEditingSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/notes/${editingNoteId}`,
        {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingNoteId ? response.data : note
        )
      );
      handleCancelEdit();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update note");
    } finally {
      setIsEditingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Notes</h1>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Add Note Form */}
        <form
          onSubmit={handleAddNote}
          className="mb-8 bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Create New Note
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
            aria-label="Note title"
          />
          <textarea
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
            aria-label="Note description"
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-semibold rounded-md transition-colors duration-200 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Adding…" : "Add Note"}
          </button>
        </form>

        {/* Notes List */}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-600">No notes found.</p>
        ) : (
          <ul className="space-y-4" aria-live="polite">
            {notes.map(({ _id, title, description, createdAt }) => (
              <li
                key={_id}
                className="bg-white p-6 rounded shadow border border-gray-200"
              >
                {/* Edit mode vs View mode */}
                {editingNoteId === _id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Title"
                      disabled={isEditingSubmitting}
                      aria-label="Edit note title"
                    />
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description"
                      disabled={isEditingSubmitting}
                      aria-label="Edit note description"
                    ></textarea>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isEditingSubmitting}
                        className={`py-2 px-4 bg-blue-600 text-white rounded-md font-semibold transition-colors ${
                          isEditingSubmitting
                            ? "cursor-not-allowed bg-blue-400"
                            : "hover:bg-blue-700"
                        }`}
                      >
                        {isEditingSubmitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="py-2 px-4 border border-gray-400 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {title}
                    </h3>
                    <p className="mb-2 text-gray-700">{description}</p>
                    <small className="text-gray-500">
                      Created on {new Date(createdAt).toLocaleString()}
                    </small>
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() =>
                          handleEditClick({ _id, title, description })
                        }
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(_id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notes;
