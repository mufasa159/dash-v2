'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import CardHeader from '@/components/CardHeader/CardHeader'
import type { Quote, FetchedQuotes } from '@/types/CardQuote'
import styles from './CardQuote.module.css'


const CardQuote = () => {

    const [quotes, setQuotes] = useState<FetchedQuotes | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuotes = async () => {
            setStatus("Loading...")

            try {
                const res = await fetch('/api/quotes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                setQuotes(data)
                setStatus(null)

            } catch (error) {
                console.error(error)
                setStatus("Failed to fetch today's quote")
            }
        }

        const scheduleNextUpdate = () => {
            const now = new Date()
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)

            const timeUntilMidnight = tomorrow.getTime() - now.getTime()

            return setTimeout(() => {
                fetchQuotes()
                // set up the next day's timer after fetching
                const nextTimer = scheduleNextUpdate()
                return () => clearTimeout(nextTimer)
            }, timeUntilMidnight)
        }

        fetchQuotes()
        const timerId = scheduleNextUpdate()
        return () => clearTimeout(timerId)
    }, [])

    return (
        <div>
            <CardHeader
                title="Quote of The Day"
                color='yellow'
            />

            <div className={styles.quotesDisplay}>
                {status !== null && <p>{status}</p>}
                {quotes !== null && quotes.contents.quotes.map((quote: Quote, index: number) => (
                    <div key={index}>
                        <p>{quote.quote}</p>
                        <small className={styles.author}>~ {quote.author}</small>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CardQuote