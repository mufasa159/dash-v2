'use client'

import { useEffect, useState } from 'react'
import type { Habit } from '@/types'
import styles from './habits.module.css'
import Link from 'next/link'

const Habits = () => {

    const [habits, setHabits] = useState<Habit[]>([])
    const [status, setStatus] = useState<string | null>(null)
    const [statusColor, setStatusColor] = useState<string>('var(--red)')

    const [formDataCreate, setFormDataCreate] = useState({
        name: '',
        description: ''
    })

    const [formDataUpdate, setFormDataUpdate] = useState({
        id: 0,
        name: '',
        description: ''
    })

    const [formDataDelete, setFormDataDelete] = useState({
        id: 0
    })


    useEffect(() => {
        const fetchHabits = async () => {
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

        fetchHabits()
    }, [])


    async function updateHabit(
        id: number,
        name: string,
        description: string
    ) {
        if (!id) {
            setStatusColor('var(--red)')
            setStatus("Please select a habit to update.")
            return
        }

        try {
            const res = await fetch('/api/habits', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    description: description
                })
            })

            if (!res.ok) {
                throw new Error((await res.json()).error)
            }

            const updatedHabits = habits.map(habit => {
                if (habit.id === id) {
                    habit.name = name
                    habit.description = description
                }
                return habit
            })

            setHabits(updatedHabits)
            setStatusColor('var(--green)')
            setStatus("Habit updated successfully.")

        } catch (error) {
            console.error(error)
            setStatusColor('var(--red)')
            setStatus("Failed to update habit.")
        }
    }


    async function createHabit(
        name: string,
        description: string
    ) {
        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            })

            if (!res.ok) {
                throw new Error((await res.json()).error)
            }

            const newHabit = await res.json()
            setHabits([...habits, newHabit])
            setStatusColor('var(--green)')
            setStatus("Habit created successfully.")
            setFormDataCreate({
                name: '',
                description: ''
            })

        } catch (error) {
            console.error(error)
            setStatusColor('var(--red)')
            setStatus("Failed to create habit.")
        }
    }


    async function deleteHabit(id: number) {
        if (!id) {
            setStatusColor('var(--red)')
            setStatus("Please select a habit to delete.")
            return
        }
        try {
            const res = await fetch('/api/habits', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            })

            if (!res.ok) {
                throw new Error((await res.json()).error)
            }

            const updatedHabits = habits.filter(habit => habit.id !== id)
            setHabits(updatedHabits)
            setStatusColor('var(--green)')
            setStatus("Habit deleted successfully.")

        } catch (error) {
            console.error(error)
            setStatusColor('var(--red)')
            setStatus("Failed to delete habit.")
        }
    }


    function handleFormSubmit(
        e: React.FormEvent<HTMLFormElement>,
        type: string
    ) {
        e.preventDefault()
        if (type === 'create') {
            createHabit(
                formDataCreate.name,
                formDataCreate.description
            )

        } else if (type === 'update') {
            updateHabit(
                formDataUpdate.id,
                formDataUpdate.name,
                formDataUpdate.description
            )

        } else if (type === 'delete') {
            deleteHabit(formDataDelete.id)
        }
    }

    return (
        <div className={styles.habitsPage}>
            <nav className={styles.navLink}>
                <Link href={'/'}>&lt;- Back Home</Link>
            </nav>

            <h1 style={{ marginTop: 40 }} >
                Manage Habits
            </h1>

            {/* success or error message */}
            {habits.length === 0 && <p>No habits found.</p>}
            {status !== null && <p>
                <small style={{color: statusColor}}>{status}</small>
            </p>}

            <div className={styles.habitsFormContainer}>

                {/* create form */}
                <form
                    className={styles.habitForm}
                    onSubmit={e => handleFormSubmit(e, 'create')}
                >
                    <h2 style={{ color: 'var(--green)' }}>Create</h2>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Title'
                        maxLength={40}
                        value={formDataCreate.name}
                        onChange={e => setFormDataCreate({
                            ...formDataCreate,
                            name: e.target.value
                        })}
                    />
                    <textarea
                        name='description'
                        id='description'
                        placeholder='Short Description'
                        maxLength={255}
                        value={formDataCreate.description}
                        onChange={e => setFormDataCreate({
                            ...formDataCreate,
                            description: e.target.value
                        })}
                    />

                    <button
                        style={{ backgroundColor: 'var(--green)'}}
                        type='submit'
                    >
                        CREATE
                    </button>
                </form>

                {/* update form */}
                {habits.length !== 0 && (
                    <form
                        className={styles.habitForm}
                        onSubmit={e => handleFormSubmit(e, 'update')}
                    >
                        <h2 style={{ color: 'var(--yellow)' }}>Update</h2>

                        <select onChange={e => setFormDataUpdate({
                            id: parseInt(e.target.value),
                            name: habits.find(
                                habit => habit.id === parseInt(e.target.value)
                            )?.name || '',
                            description: habits.find(
                                habit => habit.id === parseInt(e.target.value)
                            )?.description || ''
                        })}>
                            <option value=''>Select Habit</option>
                            {habits.map(habit => (
                                <option key={habit.id} value={habit.id}>{habit.name}</option>
                            ))}
                        </select>

                        <input
                            type='text'
                            name='name'
                            id='name'
                            placeholder='Title'
                            maxLength={40}
                            value={formDataUpdate.name}
                            onChange={e => setFormDataUpdate({
                                ...formDataUpdate,
                                name: e.target.value
                            })}
                        />

                        <textarea
                            name='description'
                            id='description'
                            placeholder='Short Description'
                            maxLength={255}
                            value={formDataUpdate.description}
                            onChange={e => setFormDataUpdate({
                                ...formDataUpdate,
                                description: e.target.value
                            })}
                        />

                        <button
                            style={{ backgroundColor: 'var(--yellow)'}}
                            type='submit'
                        >
                            UPDATE
                        </button>
                    </form>
                )}

                {/* delete form */}
                {habits.length !== 0 && (
                    <form
                        className={styles.habitForm}
                        onSubmit={e => handleFormSubmit(e, 'delete')}
                    >
                        <h2 style={{ color: 'var(--red)' }}>Delete</h2>

                        <select onChange={e => setFormDataDelete({
                            id: parseInt(e.target.value)
                        })}>
                            <option value=''>Select Habit</option>
                            {habits.map(habit => (
                                <option key={habit.id} value={habit.id}>{habit.name}</option>
                            ))}
                        </select>

                        <button
                            style={{ backgroundColor: 'var(--red)'}}
                            type='submit'
                        >
                            DELETE
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Habits