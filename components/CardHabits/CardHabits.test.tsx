import CardHabits from './CardHabits'
import {
    render,
    screen,
    fireEvent,
    waitFor
} from '@testing-library/react'


jest.mock('../CardHeader/CardHeader', () => {
    const MockedCardHeader = () => <div>Mocked CardHeader</div>
    MockedCardHeader.displayName = 'MockedCardHeader'
    return MockedCardHeader
})
jest.mock('moment', () => {
    const moment = jest.requireActual('moment')
    return jest.fn(() => moment())
})

const mockHabits = [
    { id: 1, name: 'Habit 1', last_completed: null, streak: 0 },
    { id: 2, name: 'Habit 2', last_completed: '2023-01-01', streak: 5 }
]


describe('CardHabits Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders the CardHeader and habits display', () => {
        render(<CardHabits />)
        expect(screen.getByText('Mocked CardHeader')).toBeInTheDocument()
        expect(screen.getByText('Edit Habits ->')).toBeInTheDocument()
    })

    it('displays loading status while fetching habits', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        })

        render(<CardHabits />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())
    })

    it('displays fetched habits', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockHabits
        })

        render(<CardHabits />)

        await waitFor(() => {
            expect(screen.getByText('Habit 1')).toBeInTheDocument()
            expect(screen.getByText('Habit 2')).toBeInTheDocument()
        })
    })

    it('handles fetch error gracefully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Failed to fetch' })
        })

        render(<CardHabits />)

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch habits.')).toBeInTheDocument()
        })
    })

    it('marks a habit as completed', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockHabits
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1, name: 'Habit 1', last_completed: '2023-01-01', streak: 1 })
            })

        render(<CardHabits />)

        await waitFor(() => {
            expect(screen.getByText('Habit 1')).toBeInTheDocument()
        })

        const markAsDoneButton = screen.getByText('Mark as Done')
        fireEvent.click(markAsDoneButton)

        await waitFor(() => {
            expect(screen.getByText('Completed')).toBeInTheDocument()
        })
    })

    it('handles error when marking a habit as completed', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockHabits
            })
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Failed to mark as completed' })
            })

        render(<CardHabits />)

        await waitFor(() => {
            expect(screen.getByText('Habit 1')).toBeInTheDocument()
        })

        const markAsDoneButton = screen.getByText('Mark as Done')
        fireEvent.click(markAsDoneButton)

        await waitFor(() => {
            expect(screen.getByText('Failed to complete habit.')).toBeInTheDocument()
        })
    })

    it('handles hover effect on habit items', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockHabits
        })

        render(<CardHabits />)

        await waitFor(() => {
            expect(screen.getByText('Habit 1')).toBeInTheDocument()
        })

        const habitItem = screen.getByText('Habit 1')
        fireEvent.mouseEnter(habitItem)

        expect(habitItem).toHaveStyle('color: var(--orange)')
        fireEvent.mouseLeave(habitItem)
        expect(habitItem).toHaveStyle('color: var(--white)')
    })
})