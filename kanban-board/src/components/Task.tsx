import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from '../types/kanban';
import { GripVertical, Pencil, Trash2, X, Check } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';

interface TaskProps {
  task: TaskType;
  index: number;
  columnId: string;
}

const Task: React.FC<TaskProps> = ({ task, index, columnId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const { updateTask, deleteTask } = useKanbanStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id, columnId);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-200 ${
            snapshot.isDragging ? 'shadow-lg' : ''
          } transition-shadow`}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={16} className="text-gray-400" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 text-green-600 hover:text-green-700"
                    aria-label="Save"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTitle(task.title);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    aria-label="Cancel"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      aria-label="Edit task"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1 text-red-500 hover:text-red-700"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;