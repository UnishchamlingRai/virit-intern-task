import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Task from '../components/Task';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

// Mock the store
vi.mock('../store/kanbanStore', () => ({
  useKanbanStore: () => ({
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}));

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  createdAt: '2024-03-15T10:00:00.000Z',
};

const renderWithDragDrop = (component: React.ReactNode) => {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="test-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {component}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

describe('Task Component', () => {
  it('renders task title and date', () => {
    renderWithDragDrop(
      <Task task={mockTask} index={0} columnId="column-1" />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(new Date(mockTask.createdAt).toLocaleDateString())).toBeInTheDocument();
  });

  it('shows edit form when edit button is clicked', async () => {
    renderWithDragDrop(
      <Task task={mockTask} index={0} columnId="column-1" />
    );

    const editButton = screen.getByLabelText('Edit task');
    await userEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Save')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel')).toBeInTheDocument();
  });

  it('cancels editing when cancel button is clicked', async () => {
    renderWithDragDrop(
      <Task task={mockTask} index={0} columnId="column-1" />
    );

    await userEvent.click(screen.getByLabelText('Edit task'));
    await userEvent.click(screen.getByLabelText('Cancel'));

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test Task')).not.toBeInTheDocument();
  });

  it('has delete button', () => {
    renderWithDragDrop(
      <Task task={mockTask} index={0} columnId="column-1" />
    );
    
    expect(screen.getByLabelText('Delete task')).toBeInTheDocument();
  });
});