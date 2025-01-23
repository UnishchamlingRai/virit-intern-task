import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useKanbanStore } from './store/kanbanStore';
import Column from './components/Column';
import { Plus, Undo2, Redo2, X } from 'lucide-react';
import { Column as ColumnType } from './types/kanban';

function App() {
  const {
    tasks,
    columns,
    columnOrder,
    moveTask,
    addTask,
    addColumn,
    updateColumnTitle,
    deleteColumn,
    undo,
    redo,
  } = useKanbanStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveTask(source, destination);
  };

  const handleAddTask = (columnId: string, taskName: string) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskName,
      description: 'Add description here',
      createdAt: new Date().toISOString(),
    };
    addTask(columnId, newTask);
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnName.trim()) {
      const newColumn: ColumnType = {
        id: `column-${Date.now()}`,
        title: newColumnName.trim(),
        taskIds: [],
      };
      addColumn(newColumn);
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  // Filter tasks while preserving the task map structure
  const filteredTasks = searchTerm
    ? Object.entries(tasks).reduce((acc, [id, task]) => {
        if (
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc[id] = task;
        }
        return acc;
      }, {} as typeof tasks)
    : tasks;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={undo}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Undo"
            >
              <Undo2 size={20} />
            </button>
            <button
              onClick={redo}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Redo"
            >
              <Redo2 size={20} />
            </button>
            {isAddingColumn ? (
              <form onSubmit={handleAddColumn} className="flex gap-2">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsAddingColumn(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Cancel"
                >
                  <X size={20} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Column
              </button>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              const columnTasks = column.taskIds
                .map((taskId) => filteredTasks[taskId])
                .filter(Boolean);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onAddTask={(taskName) => handleAddTask(column.id, taskName)}
                  onDeleteColumn={() => deleteColumn(column.id)}
                  onUpdateTitle={(title) => updateColumnTitle(column.id, title)}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;