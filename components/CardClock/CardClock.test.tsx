import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import CardClock from './CardClock'


jest.useFakeTimers();

describe('CardClock', () => {
    test('renders correctly', () => {
        render(<CardClock />);
        expect(
            screen.getByText(/\d{1,2}:\d{2}:\d{2}/)
        ).toBeInTheDocument();
    });

    test('displays correct time, date, and weekday', () => {
        render(<CardClock />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const now = new Date();

        const time = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: process.env.NEXT_PUBLIC_TIMEZONE
        });

        const date = now.toLocaleDateString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const weekday = now.toLocaleDateString([], {
            weekday: 'long',
        });

        expect(screen.getByText(weekday)).toBeInTheDocument();
        expect(screen.getByText(date)).toBeInTheDocument();
        expect(screen.getByText(time)).toBeInTheDocument();
    });

    test('updates time every second', () => {
        render(<CardClock />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const initialTime = screen.getByRole('heading').textContent;

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const updatedTime = screen.getByRole('heading').textContent;

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const finalTime = screen.getByRole('heading').textContent;

        expect(initialTime).not.toEqual(updatedTime);
        expect(updatedTime).not.toEqual(finalTime);
    });

    test('displays time information when mounted', () => {
        render(<CardClock />);
        expect(screen.getByRole('heading')).toBeInTheDocument();
        const paragraphs = screen.getAllByText(/.+/);
        expect(paragraphs.length).toBeGreaterThan(1);
    });
});