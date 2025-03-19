import React from 'react'
import '@testing-library/jest-dom'
import CardHeader from './CardHeader'
import { render, screen } from '@testing-library/react'


describe('CardHeader', () => {
    test('renders correct title', () => {
        render(<CardHeader title='Test Title' />)
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Title')).toHaveStyle('color: var(--foreground)')
    })

    test('renders correct color', () => {
        render(<CardHeader title='Test Title' color='yellow' />)
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Title')).toHaveStyle('color: var(--yellow)')
    })

    test('renders default color if invalid color provided', () => {
        render(<CardHeader title='Test Title' color='idontexist' />)
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Title')).toHaveStyle('color: var(--foreground)')
    })
})