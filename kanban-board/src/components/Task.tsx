import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTodoContext } from "../context/TodoContext";

const Task = ({
  id,
  title,
  completed,
}: {
  id: number;
  title: string;
  completed: boolean;
}) => {
  const { removeTodo, toggleTodo } = useTodoContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-2 bg-white shadow-sm w-3/4 rounded-md hover:shadow-xl touch-none"
    >
      <input
        type="checkbox"
        className=" cursor-pointer ml-4"
        onClick={() => toggleTodo(id)}
      />
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab flex justify-between gap-2 bg-red-200  w-full"
      >
        <h1 className={`${completed ? "line-through" : ""} font-bold pl-2`}>
          {title}
        </h1>
        <p>
          Status:<span> {completed ? "Completed" : "Running"}</span>
        </p>
      </div>

      <button
        className="bg-green-400 text-white rounded-md py-2 px-6"
        onClick={() => removeTodo(id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Task;
