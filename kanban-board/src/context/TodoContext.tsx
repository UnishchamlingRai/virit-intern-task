import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const TodoContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", [
    { id: 1, completed: false, title: "books" },
    { id: 2, completed: false, title: "Learn js" },
    { id: 3, completed: false, title: "Learn React" },
  ]);

  // Function to add a new todo
  const addTodo = (title: string) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), title, completed: false },
    ]);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Function to remove a todo
  const removeTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    console.log("hello");
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, removeTodo, setTodos }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoContextProvider");
  }
  return context;
};

export { TodoContextProvider, useTodoContext };
