import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Habits from './page'
import '@testing-library/jest-dom'


const mockFetch = jest.fn() as jest.Mock
global.fetch = mockFetch

const mockHabits = [
    { id: 1, name: 'Exercise', description: 'Daily workout' },
    { id: 2, name: 'Reading', description: 'Read for 30 minutes' }
]

describe('Habits Page', () => {

    test('displays loading state and clears it after fetch', async () => {
        render(<Habits />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })
    })

    test('handles empty habits list', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        })

        render(<Habits />)

        await waitFor(() => {
            expect(screen.getByText('Manage Habits')).toBeInTheDocument()
            expect(screen.queryByText('No habits found.')).toBeInTheDocument()
        })
    })

    test('displays error message when update fails', async () => {
        mockFetch.mockImplementation((url, options) => {
            if (options.method === 'PUT') {
                return Promise.resolve({
                    ok: false,
                    json: async () => ({ error: 'Failed to update' })
                })
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockHabits
            })
        })

        render(<Habits />)

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        const updateSelect = screen.getAllByRole('combobox')[0]
        fireEvent.change(updateSelect, { target: { value: '1' } })

        const updateButton = screen.getByText('UPDATE')
        fireEvent.click(updateButton)

        await waitFor(() => {
            expect(screen.getByText('Failed to update habit.')).toBeInTheDocument()
        })
    })

    test('displays error message when delete fails', async () => {
        mockFetch.mockImplementation((url, options) => {
            if (options.method === 'DELETE') {
                return Promise.resolve({
                    ok: false,
                    json: async () => ({ error: 'Failed to delete' })
                })
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockHabits
            })
        })

        render(<Habits />)

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        const deleteSelect = screen.getAllByRole('combobox')[1]
        fireEvent.change(deleteSelect, { target: { value: '2' } })

        const deleteButton = screen.getByText('DELETE')
        fireEvent.click(deleteButton)

        await waitFor(() => {
            expect(screen.getByText('Failed to delete habit.')).toBeInTheDocument()
        })
    })
})