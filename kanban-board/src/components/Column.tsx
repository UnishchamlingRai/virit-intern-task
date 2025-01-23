import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreVertical, Plus, Trash2, X, Pencil, Check } from 'lucide-react';
import Task from './Task';
import { Column as ColumnType, Task as TaskType } from '../types/kanban';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (taskName: string) => void;
  onDeleteColumn: () => void;
  onUpdateTitle: (title: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onAddTask, 
  onDeleteColumn,
  onUpdateTitle 
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      onAddTask(newTaskName.trim());
      setNewTaskName('');
      setIsAddingTask(false);
    }
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim() && editedTitle !== column.title) {
      onUpdateTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 mr-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 px-2 py-1 text-lg font-semibold bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 text-green-600 hover:text-green-700"
                aria-label="Save title"
              >
                <Check size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingTitle(false);
                  setEditedTitle(column.title);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Cancel"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-700">{column.title}</h2>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Edit title"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Add task"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={onDeleteColumn}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Delete column"
          >
            <Trash2 size={20} />
          </button>
          <MoreVertical size={20} className="text-gray-500" />
        </div>
      </div>

      {isAddingTask && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Cancel"
            >
              <X size={20} />
            </button>
          </div>
        </form>
      )}
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-200' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} columnId={column.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;