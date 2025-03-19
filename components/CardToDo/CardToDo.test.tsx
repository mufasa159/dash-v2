import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardToDo from './CardToDo';
import moment from 'moment';


jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        return <img {...props} />;
    },
}));


jest.mock('@/app/assets/circle.svg', () => ({
    src: '/mock-circle.svg',
    height: 12,
    width: 12,
}));


describe('CardToDo', () => {
    const mockTasks = [
        {
            id: 1,
            title: 'Task 1',
            completed: false,
            created_at: '2023-03-01T12:00:00Z',
            updated_at: '2023-03-01T12:00:00Z',
        },
        {
            id: 2,
            title: 'Task 2',
            completed: true,
            created_at: '2023-03-02T12:00:00Z',
            updated_at: '2023-03-03T12:00:00Z',
        },
    ];

    beforeEach(() => {
        global.fetch = jest.fn();
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component with header', async () => {
        render(<CardToDo />);
        expect(screen.getByText('Tasks To Do')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });

    test('shows loading state when fetching tasks', async () => {
        render(<CardToDo />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });

    test('displays fetched tasks', async () => {
        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });

        const task2 = screen.getByText('Task 2');
        expect(task2).toHaveClass('todoCompleted');
    });

    test('handles error when fetching tasks fails', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to fetch' }),
            })
        );

        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch tasks.')).toBeInTheDocument();
        });
    });

    test('adds a new task', async () => {
        // const newTask = {
        //     id: 3,
        //     title: 'New Task',
        //     completed: false,
        //     created_at: '2023-03-10T12:00:00Z',
        //     updated_at: '2023-03-10T12:00:00Z',
        // };

        // (global.fetch as jest.Mock)
        //     .mockImplementationOnce(() => Promise.resolve({
        //         ok: true,
        //         json: () => Promise.resolve(mockTasks),
        //     }))
        //     .mockImplementationOnce(() => Promise.resolve({
        //         ok: true,
        //         json: () => Promise.resolve(newTask),
        //     }));
    
        // render(<CardToDo />);

        // await waitFor(() => {
        //     expect(screen.getByText('Task 1')).toBeInTheDocument();
        // });

        // const input = screen.getByTestId('todo') as HTMLInputElement;
        // fireEvent.change(input, { target: { value: 'New Task' } });

        // // directly simulate the Enter key press instead of form submission
        // fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // await waitFor(() => {
        //     expect(screen.getByText('New task added successfully!')).toBeInTheDocument();
        // });

        // expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    test('handles error when adding a task fails', async () => {
        // to-do: complete this
    });


    test('removes a task', async () => {
        jest.useFakeTimers();

        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1 }),
            })
        );

        const deleteButtons = screen.getAllByTitle(/Delete task/);
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/todo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1 }),
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Task deleted successfully!')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(screen.queryByText('Task deleted successfully!')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    test('handles error when removing a task fails', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to delete task' }),
            })
        );

        jest.useFakeTimers();

        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByTitle(/Delete task/);
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getByText('Failed to delete task.')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(screen.queryByText('Failed to delete task.')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    test('toggles task completion status', async () => {
        const updatedTask = {
            ...mockTasks[0],
            completed: true,
            updated_at: '2023-03-05T12:00:00Z',
        };

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(updatedTask),
            })
        );

        jest.useFakeTimers();

        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        const task = screen.getByText('Task 1');
        fireEvent.click(task);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/todo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 1,
                    title: 'Task 1',
                    completed: true,
                }),
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Task marked as completed!')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(task).toHaveClass('todoCompleted');
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(screen.queryByText('Task marked as completed!')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    test('handles error when toggling task fails', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Failed to update task' }),
            })
        );

        jest.useFakeTimers();

        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        const task = screen.getByText('Task 1');
        fireEvent.click(task);

        await waitFor(() => {
            expect(screen.getByText('Failed to update todo')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(screen.queryByText('Failed to update todo')).not.toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    test('shows correct title attribute for tasks', async () => {
        render(<CardToDo />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });

        const task1 = screen.getByText('Task 1');
        expect(task1).toHaveAttribute('title', `Created on ${moment('2023-03-01T12:00:00Z').format('MMM Do, YYYY h:mm:ss A')}`);

        const task2 = screen.getByText('Task 2');
        expect(task2).toHaveAttribute('title', `Completed on ${moment('2023-03-03T12:00:00Z').format('MMM Do, YYYY h:mm:ss A')}`);
    });
});