import React from 'react'
import '@testing-library/jest-dom'
import CardQuote from './CardQuote'
import {
    render,
    screen,
    waitFor,
    act
} from '@testing-library/react'


// mock data for testing
const mockData = {
    success: {
        total: 1
    },
    contents: {
        quotes: [
            {
                id: "abcdefgh",
                quote: "It's not artificial intelligence, artificial stupidity.",
                length: 80,
                author: "Dr. Christopher Hoople @ RIT",
                language: "en",
                tags: ["logic", "confidence"],
                sfw: "sfw",
                permalink: "https://example.com/quote/example",
                title: "Logical Quote of the day",
                category: "inspire",
                background: "https://example.com/assets/images/qod/qod-inspire.jpg",
                date: "2025-03-18"
            },
            {
                id: "12345678",
                quote: "Can we inflict this much pain and agony on students?",
                length: 52,
                author: "Dr. Charles Lusignan @ RIT",
                language: "en",
                tags: ["education"],
                sfw: "sfw",
                permalink: "https://example.com/quote/example",
                title: "Concerning Quote of the day",
                category: "inspire",
                background: "https://example.com/assets/images/qod/qod-inspire.jpg",
                date: "2025-03-17"
            }
        ]
    },
    copyright: {
        url: "https://example.com",
        year: "2025"
    }
}


// mock fetch API for testing
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockData),
    } as Response)
) as jest.Mock


describe('CardQuote', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('displays loading status initially', () => {
        render(<CardQuote />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('fetches and displays quotes', async () => {
        await act(async () => {
            render(<CardQuote />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()

        expect(screen.getByText(
            'It\'s not artificial intelligence, artificial stupidity.'
        )).toBeInTheDocument()

        expect(screen.getByText(
            '~ Dr. Christopher Hoople @ RIT'
        )).toBeInTheDocument()

        expect(screen.getByText(
            'Can we inflict this much pain and agony on students?'
        )).toBeInTheDocument()

        expect(screen.getByText(
            '~ Dr. Charles Lusignan @ RIT'
        )).toBeInTheDocument()
    })

    test('displays error message on fetch failure', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('API is down'))

        await act(async () => {
            render(<CardQuote />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        expect(screen.getByText("Failed to fetch today's quote")).toBeInTheDocument()
    })

    test('displays correct number of quotes', async () => {
        await act(async () => {
            render(<CardQuote />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryAllByText(/~ Dr./).length).toBe(2)
    })
})

// mock fetch API for testing
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockData),
    } as Response)
) as jest.Mock


describe('CardQuote Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('displays loading status initially', () => {
        render(<CardQuote />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('fetches and displays quotes', async () => {
        await act(async () => {
            render(<CardQuote />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()

        expect(screen.getByText(
            'It\'s not artificial intelligence, artificial stupidity.'
        )).toBeInTheDocument()

        expect(screen.getByText(
            '~ Dr. Christopher Hoople @ RIT'
        )).toBeInTheDocument()

        expect(screen.getByText(
            'Can we inflict this much pain and agony on students?'
        )).toBeInTheDocument()

        expect(screen.getByText(
            '~ Dr. Charles Lusignan @ RIT'
        )).toBeInTheDocument()
    })

    test('displays error message on fetch failure', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('API is down'))

        await act(async () => {
            render(<CardQuote />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        expect(screen.getByText("Failed to fetch today's quote")).toBeInTheDocument()
    })
})