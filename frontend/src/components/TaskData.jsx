import React, { useEffect, useState } from "react";

function TaskData({ onEdit }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/tasks"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch tasks");
            }

            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // DELETE
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete task");
            }

            // Deleted task ko screen se remove karo
            setTasks(tasks.filter((task) => task.id !== id));

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="task-data">
            <h2>Task Data</h2>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.id}</td>

                                <td>{task.title}</td>

                                <td>
                                    {task.description || "No description"}
                                </td>

                                <td>{task.status}</td>

                                <td>
                                    {new Date(
                                        task.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    <button
                                        onClick={() => onEdit(task)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(task.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TaskData;