import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Column from '../components/Column';
import { DragDropContext } from '@hello-pangea/dnd';

const mockColumn = {
  id: 'column-1',
  title: 'Test Column',
  taskIds: ['task-1', 'task-2'],
};

const mockTasks = [
  {
    id: 'task-1',
    title: 'Task 1',
    description: 'Description 1',
    createdAt: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Task 2',
    description: 'Description 2',
    createdAt: '2024-03-15T11:00:00.000Z',
  },
];

const renderWithDragDrop = (component: React.ReactNode) => {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      {component}
    </DragDropContext>
  );
};

describe('Column Component', () => {
  const mockProps = {
    column: mockColumn,
    tasks: mockTasks,
    onAddTask: vi.fn(),
    onDeleteColumn: vi.fn(),
    onUpdateTitle: vi.fn(),
  };

  it('renders column title and tasks', () => {
    renderWithDragDrop(<Column {...mockProps} />);
    
    expect(screen.getByText('Test Column')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows add task form when add button is clicked', async () => {
    renderWithDragDrop(<Column {...mockProps} />);

    await userEvent.click(screen.getByLabelText('Add task'));
    
    expect(screen.getByPlaceholderText('Enter task name...')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel')).toBeInTheDocument();
  });

  it('calls onAddTask when submitting new task', async () => {
    renderWithDragDrop(<Column {...mockProps} />);

    await userEvent.click(screen.getByLabelText('Add task'));
    const input = screen.getByPlaceholderText('Enter task name...');
    await userEvent.type(input, 'New Task');
    await userEvent.type(input, '{enter}');

    expect(mockProps.onAddTask).toHaveBeenCalledWith('New Task');
  });

  it('shows edit title form when edit button is clicked', async () => {
    renderWithDragDrop(<Column {...mockProps} />);

    await userEvent.click(screen.getByLabelText('Edit title'));
    
    expect(screen.getByDisplayValue('Test Column')).toBeInTheDocument();
    expect(screen.getByLabelText('Save title')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel')).toBeInTheDocument();
  });

  it('calls onUpdateTitle when submitting edited title', async () => {
    renderWithDragDrop(<Column {...mockProps} />);

    await userEvent.click(screen.getByLabelText('Edit title'));
    const input = screen.getByDisplayValue('Test Column');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Column');
    await userEvent.click(screen.getByLabelText('Save title'));

    expect(mockProps.onUpdateTitle).toHaveBeenCalledWith('Updated Column');
  });

  it('calls onDeleteColumn when delete button is clicked', async () => {
    renderWithDragDrop(<Column {...mockProps} />);

    await userEvent.click(screen.getByLabelText('Delete column'));
    
    expect(mockProps.onDeleteColumn).toHaveBeenCalled();
  });
});