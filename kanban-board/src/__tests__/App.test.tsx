import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the store
vi.mock('../store/kanbanStore', () => ({
  useKanbanStore: () => ({
    tasks: {},
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        taskIds: [],
      },
    },
    columnOrder: ['column-1'],
    moveTask: vi.fn(),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    addColumn: vi.fn(),
    updateColumnTitle: vi.fn(),
    deleteColumn: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the kanban board title', () => {
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
  });

  it('shows search input', () => {
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('shows undo/redo buttons', () => {
    expect(screen.getByLabelText('Undo')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo')).toBeInTheDocument();
  });

  it('shows add column button', () => {
    expect(screen.getByText('Add Column')).toBeInTheDocument();
  });

  it('shows column input form when add column is clicked', async () => {
    await userEvent.click(screen.getByText('Add Column'));
    expect(screen.getByPlaceholderText('Enter column name...')).toBeInTheDocument();
  });

  it('allows searching tasks', async () => {
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await userEvent.type(searchInput, 'test task');
    expect(searchInput).toHaveValue('test task');
  });
});