import React from 'react'
import '@testing-library/jest-dom'
import CardNews from './CardNews'
import {
    render,
    screen,
    waitFor,
    act
} from '@testing-library/react'


// mock data for testing
const mockData = {
    status: 'ok',
    totalResults: 1,
    articles: [
        {
            source: {
                id: '1',
                name: 'Test Source'
            },
            author: 'Test Author',
            title: 'Test Title - Test',
            description: 'Test Description',
            url: 'http://test.com',
            urlToImage: 'http://test.com/image.jpg',
            publishedAt: new Date().toISOString(),
            content: 'Test Content',
        },
    ],
}


// mock fetch API for testing
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockData),
    } as Response)
) as jest.Mock


describe('CardNews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('renders loading status initially', () => {
        render(<CardNews />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('fetches and displays news articles', async () => {
        await act(async () => {
            render(<CardNews />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Source - a few seconds ago')).toBeInTheDocument()
    })

    test('displays error message on fetch failure', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('API is down'))

        await act(async () => {
            render(<CardNews />)
        })

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        expect(screen.getByText('Failed to fetch news')).toBeInTheDocument()
    })
})