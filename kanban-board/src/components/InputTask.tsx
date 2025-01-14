import React, { useState } from "react";
import { useTodoContext } from "../context/TodoContext";

const InputTask = () => {
  const { addTodo } = useTodoContext();
  const [task, setTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      addTodo(task);
      setTask("");
    }
  };

  return (
    <form
      onSubmit={handleAddTask}
      className="flex items-center w-full max-w-md p-2 border rounded-md shadow-md bg-white"
    >
      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="flex-1 p-2 text-sm border-none outline-none"
      />
      <button className="ml-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition">
        Add
      </button>
    </form>
  );
};

export default InputTask;
