import React, { useState } from "react";
import TaskData from "./components/TaskData";
import TaskForm from './pages/TaskForm';

function App() {
    const [editTask, setEditTask] = useState(null);

    const handleEdit = (task) => {
        setEditTask(task);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleTaskSaved = () => {
        setEditTask(null);
        window.location.reload();
    };

    return (
        <div className="app">

            <h1>Task Management System</h1>

            <TaskForm
                editTask={editTask}
                onTaskSaved={handleTaskSaved}
                onCancel={() => setEditTask(null)}
            />

            <TaskData onEdit={handleEdit} />

        </div>
    );
}

export default App;