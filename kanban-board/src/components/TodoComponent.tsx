import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import InputTask from "./InputTask";
import Colum from "./Colum";
import { useTodoContext } from "../context/TodoContext";

const TodoComponent = () => {
  const { todos, setTodos } = useTodoContext();

  function getTaskPosition(id: number) {
    return todos.findIndex((todo) => todo.id === id);
  }
  function handelDragEnd(event) {
    const { active, over } = event;
    if (active.id === over.id) return;
    setTodos((todo) => {
      const orginalPosition = getTaskPosition(active.id);
      const newPosition = getTaskPosition(over.id);
      return arrayMove(todo, orginalPosition, newPosition);
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  return (
    <div className="flex justify-center items-center w-2/4 m-auto flex-col mt-24">
      <DndContext
        sensors={sensors}
        onDragEnd={handelDragEnd}
        collisionDetection={closestCorners}
      >
        <InputTask />

        <Colum />
      </DndContext>
    </div>
  );
};

export default TodoComponent;
