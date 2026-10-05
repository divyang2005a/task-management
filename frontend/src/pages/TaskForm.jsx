import React, { useEffect, useState } from "react";

function TaskForm({ editTask, onTaskSaved, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description || "");
            setStatus(editTask.status);
        } else {
            setTitle("");
            setDescription("");
            setStatus("Pending");
        }

        setMessage("");
        setError("");
    }, [editTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setLoading(true);

        try {
            const url = editTask
                ? `http://localhost:5000/api/tasks/${editTask.id}`
                : "http://localhost:5000/api/tasks";

            const method = editTask ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);

            setTitle("");
            setDescription("");
            setStatus("Pending");

            onTaskSaved();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-form">
            <h2>{editTask ? "Edit Task" : "Add Task"}</h2>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter task description"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Status</label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="form-buttons">

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Saving..."
                            : editTask
                            ? "Update Task"
                            : "Add Task"}
                    </button>

                    {editTask && (
                        <button
                            type="button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </form>
        </div>
    );
}

export default TaskForm;