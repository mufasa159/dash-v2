'use client'

import { useState, useEffect } from 'react'
import CardHeader from '../CardHeader/CardHeader'
import type { Habit, FetchedHabits } from '@/types/CardHabits'
import styles from './CardHabits.module.css'
import moment from 'moment'
import Link from 'next/link'


const CardHabits = () => {

    const [habits, setHabits] = useState<FetchedHabits>([])
    const [status, setStatus] = useState<string | null>(null)
    const [statusColor, setStatusColor] = useState<string>('var(--red)')

    // for hovering effect
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)

    useEffect(() => {
        const fetchhabits = async () => {
            setStatus("Loading...")
            try {
                const res = await fetch('/api/habits', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error)
                }

                setHabits(data)
                setStatus(null)

            } catch (error) {
                console.error(error)
                setStatus("Failed to fetch habits.")
            }
        }

        

        fetchhabits()
    }, [])

    async function markComplete(id: number) {
        try {
            const res = await fetch('/api/habits/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    completed: true
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setHabits(habits.map(habit => {
                if (habit.id === id) {
                    return data
                }
                return habit
            }))

            // setStatus("Habit marked completed!")
            // setStatusColor('var(--green)')

        } catch (error) {
            console.error(error)
            setStatus("Failed to complete habit.")

        } finally {
            setTimeout(() => {
                setStatusColor('var(--red)')
                setStatus(null)
            }, 4000)
        }
    }

    return (
        <div>
            <CardHeader
                title="Habit Tracker"
                color="orange"
            />

            <div className={styles.habitsDisplay}>

                {habits.map((habit: Habit, index: number) => (
                    <div key={index} className={styles.habits}>

                        <div className={styles.left}>
                            <p style={{
                                color: hoveredItemId === habit.id ? 'var(--orange)' : 'var(--white)',
                                fontWeight: hoveredItemId === habit.id ? '500' : '400'
                            }}>
                                {habit.name}

                                <span style={{ color: 'var(--gray)', marginLeft: 4 }}>
                                    ({moment().isSame(moment(habit.last_completed), 'day') ? habit.streak || 0 : 0})
                                </span>
                            </p>
                            {/* <small>{habit.description}</small> */}
                        </div>

                        <div className={styles.right}>
                            {habit.last_completed === null || moment(habit.last_completed).isBefore(moment(), 'day') ? (
                                <button
                                    onClick={() => {markComplete(habit.id); setHoveredItemId(null)}}
                                    onMouseEnter={() => setHoveredItemId(habit.id)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                >
                                    Mark as Done
                                </button>
                            ) : (
                                <button className={styles.completed} disabled>
                                    Completed
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <br />

                <small><Link href='/habits'>Edit Habits -&gt;</Link></small>

                {/* success or error message */}
                {status !== null && <p>
                    <small style={{ color: statusColor }}>{status}</small>
                </p>}
            </div>
        </div>
    )
}

export default CardHabits