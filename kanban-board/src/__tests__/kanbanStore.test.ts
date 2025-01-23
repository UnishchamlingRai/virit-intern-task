import { describe, it, expect, beforeEach } from 'vitest';
import { useKanbanStore } from '../store/kanbanStore';

describe('Kanban Store', () => {
  beforeEach(() => {
    const store = useKanbanStore.getState();
    useKanbanStore.setState({
      tasks: {},
      columns: {
        'column-1': {
          id: 'column-1',
          title: 'Test Column',
          taskIds: [],
        },
      },
      columnOrder: ['column-1'],
      history: {
        past: [],
        future: [],
      },
    });
  });

  it('adds a task', () => {
    const store = useKanbanStore.getState();
    const newTask = {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test Description',
      createdAt: new Date().toISOString(),
    };

    store.addTask('column-1', newTask);
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.tasks['task-1']).toEqual(newTask);
    expect(updatedStore.columns['column-1'].taskIds).toContain('task-1');
  });

  it('updates a task', () => {
    const store = useKanbanStore.getState();
    const task = {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test Description',
      createdAt: new Date().toISOString(),
    };

    store.addTask('column-1', task);
    store.updateTask('task-1', { title: 'Updated Task' });
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.tasks['task-1'].title).toBe('Updated Task');
  });

  it('deletes a task', () => {
    const store = useKanbanStore.getState();
    const task = {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test Description',
      createdAt: new Date().toISOString(),
    };

    store.addTask('column-1', task);
    store.deleteTask('task-1', 'column-1');
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.tasks['task-1']).toBeUndefined();
    expect(updatedStore.columns['column-1'].taskIds).not.toContain('task-1');
  });

  it('adds a column', () => {
    const store = useKanbanStore.getState();
    const newColumn = {
      id: 'column-2',
      title: 'New Column',
      taskIds: [],
    };

    store.addColumn(newColumn);
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.columns['column-2']).toEqual(newColumn);
    expect(updatedStore.columnOrder).toContain('column-2');
  });

  it('updates a column title', () => {
    const store = useKanbanStore.getState();
    store.updateColumnTitle('column-1', 'Updated Column');
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.columns['column-1'].title).toBe('Updated Column');
  });

  it('deletes a column', () => {
    const store = useKanbanStore.getState();
    store.deleteColumn('column-1');
    
    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.columns['column-1']).toBeUndefined();
    expect(updatedStore.columnOrder).not.toContain('column-1');
  });

  it('supports undo/redo operations', () => {
    const store = useKanbanStore.getState();
    const initialTitle = store.columns['column-1'].title;
    
    store.updateColumnTitle('column-1', 'Updated Column');
    store.undo();
    
    let updatedStore = useKanbanStore.getState();
    expect(updatedStore.columns['column-1'].title).toBe(initialTitle);
    
    store.redo();
    updatedStore = useKanbanStore.getState();
    expect(updatedStore.columns['column-1'].title).toBe('Updated Column');
  });
});