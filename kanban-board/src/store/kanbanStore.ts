import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanState, Task, Column, KanbanData } from '../types/kanban';

const MAX_HISTORY_LENGTH = 10;

const initialState: KanbanData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const addToHistory = (past: KanbanData[], state: KanbanData) => {
  const newPast = [...past, state];
  if (newPast.length > MAX_HISTORY_LENGTH) {
    newPast.shift();
  }
  return newPast;
};

const createStateSnapshot = (state: KanbanState): KanbanData => ({
  tasks: state.tasks,
  columns: state.columns,
  columnOrder: state.columnOrder,
});

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      ...initialState,
      history: {
        past: [],
        future: [],
      },

      addTask: (columnId: string, task: Task) => {
        const currentState = createStateSnapshot(get());
        const newState = {
          tasks: { ...currentState.tasks, [task.id]: task },
          columns: {
            ...currentState.columns,
            [columnId]: {
              ...currentState.columns[columnId],
              taskIds: [...currentState.columns[columnId].taskIds, task.id],
            },
          },
          columnOrder: [...currentState.columnOrder],
        };
        
        set((state) => ({
          ...newState,
          history: {
            past: addToHistory(state.history.past, currentState),
            future: [],
          },
        }));
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        const currentState = createStateSnapshot(get());
        set((state) => ({
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
          history: {
            past: addToHistory(state.history.past, currentState),
            future: [],
          },
        }));
      },

      deleteTask: (taskId: string, columnId: string) => {
        const currentState = createStateSnapshot(get());
        set((state) => {
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;
          const updatedColumn = {
            ...state.columns[columnId],
            taskIds: state.columns[columnId].taskIds.filter(id => id !== taskId),
          };
          
          return {
            ...state,
            tasks: remainingTasks,
            columns: {
              ...state.columns,
              [columnId]: updatedColumn,
            },
            history: {
              past: addToHistory(state.history.past, currentState),
              future: [],
            },
          };
        });
      },

      moveTask: (source: any, destination: any) => {
        const currentState = createStateSnapshot(get());
        const newState = { ...currentState };

        const sourceColumn = { ...currentState.columns[source.droppableId] };
        const [removed] = sourceColumn.taskIds.splice(source.index, 1);

        const destColumn = { ...currentState.columns[destination.droppableId] };
        destColumn.taskIds.splice(destination.index, 0, removed);

        set((state) => ({
          ...state,
          columns: {
            ...state.columns,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
          },
          history: {
            past: addToHistory(state.history.past, currentState),
            future: [],
          },
        }));
      },

      addColumn: (column: Column) => {
        const currentState = createStateSnapshot(get());
        set((state) => ({
          columns: { ...state.columns, [column.id]: column },
          columnOrder: [...state.columnOrder, column.id],
          history: {
            past: addToHistory(state.history.past, currentState),
            future: [],
          },
        }));
      },

      updateColumnTitle: (columnId: string, title: string) => {
        const currentState = createStateSnapshot(get());
        set((state) => ({
          ...state,
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              title,
            },
          },
          history: {
            past: addToHistory(state.history.past, currentState),
            future: [],
          },
        }));
      },

      deleteColumn: (columnId: string) => {
        const currentState = createStateSnapshot(get());
        set((state) => {
          const { [columnId]: deletedColumn, ...remainingColumns } = state.columns;
          return {
            columns: remainingColumns,
            columnOrder: state.columnOrder.filter((id) => id !== columnId),
            history: {
              past: addToHistory(state.history.past, currentState),
              future: [],
            },
          };
        });
      },

      undo: () => {
        set((state) => {
          const previous = state.history.past[state.history.past.length - 1];
          if (!previous) return state;

          const newPast = state.history.past.slice(0, -1);
          const currentState = createStateSnapshot(state);
          
          return {
            ...previous,
            history: {
              past: newPast,
              future: [currentState, ...state.history.future].slice(0, MAX_HISTORY_LENGTH),
            },
          };
        });
      },

      redo: () => {
        set((state) => {
          const next = state.history.future[0];
          if (!next) return state;

          const currentState = createStateSnapshot(state);
          const newFuture = state.history.future.slice(1);
          
          return {
            ...next,
            history: {
              past: addToHistory(state.history.past, currentState),
              future: newFuture,
            },
          };
        });
      },
    }),
    {
      name: 'kanban-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        columns: state.columns,
        columnOrder: state.columnOrder,
      }),
    }
  )
);