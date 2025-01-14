import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Task from "./Task";
import { useTodoContext } from "../context/TodoContext";
import { useState } from "react";

const Colum = () => {
  const { todos } = useTodoContext();
  const [text, setText] = useState("");
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(text.toLowerCase())
  );
  return (
    <div className="p-6 flex w-full flex-col gap-4 justify-center items-center rounded-lg bg-slate-300 mt-4">
      <input
        type="text"
        placeholder="Search Todos..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 py-2 px-10 w-full mt-4 outline-none text-sm border-2 rounded-lg"
      />
      {todos.length === 0 ? (
        <h1>No todos here Please Add your Todo list.</h1>
      ) : (
        <SortableContext items={todos} strategy={verticalListSortingStrategy}>
          {filteredTodos.length === 0 ? (
            <>
              <h1>
                No Todos found with <span className="text-red-500">{text}</span>{" "}
                search
              </h1>
            </>
          ) : (
            <>
              {filteredTodos.map((todo) => {
                return (
                  <Task
                    id={todo.id}
                    title={todo.title}
                    key={todo.id}
                    completed={todo.completed}
                  />
                );
              })}
            </>
          )}
        </SortableContext>
      )}
    </div>
  );
};

export default Colum;
