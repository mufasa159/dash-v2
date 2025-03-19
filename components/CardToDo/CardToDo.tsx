'use client'

import React, { useEffect, useState } from 'react'
import styles from './CardToDo.module.css'
import Circle from '@/assets/circle.svg'
import Image from 'next/image'
import CardHeader from '@/components/CardHeader/CardHeader'
import moment from 'moment'
import type {
    FetchedTasks,
    Task
} from '@/types/CardToDo'


const CardToDo = () => {

    const [todos, setTodos] = useState<FetchedTasks>([])
    const [status, setStatus] = useState<string | null>(null)
    const [statusColor, setStatusColor] = useState<string>('var(--red)')

    useEffect(() => {
        const fetchTasks = async () => {
            setStatus("Loading...")
            try {
                const res = await fetch('/api/todo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
    
                if (!res.ok) {
                    throw new Error(data.error)
                }
    
                setTodos(data)
                setStatus(null)
    
            } catch (error) {
                console.error(error)
                setStatus("Failed to fetch tasks.")
            }
        }

        fetchTasks()
    }, [])


    async function addTask(title: string) {
        try {
            const res = await fetch('/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setTodos([...todos, data])
            setStatusColor('var(--green)')
            setStatus("New task added successfully!")

        } catch (error) {
            console.error(error)
            setStatus("Failed to add new task.")

        } finally {
            setTimeout(() => {
                setStatusColor('var(--red)')
                setStatus(null)
            }, 4000)
        }
    }


    async function removeTask(id: number) {
        try {
            const res = await fetch('/api/todo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setTodos(todos.filter(todo => todo.id !== id))
            setStatusColor('var(--green)')
            setStatus("Task deleted successfully!")

        } catch (error) {
            console.error(error)
            setStatus("Failed to delete task.")

        } finally {
            setTimeout(() => {
                setStatusColor('var(--red)')
                setStatus(null)
            }, 4000)
        }
    }


    async function toggleTaskComplete(task: Task) {
        try {
            const res = await fetch('/api/todo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: task.id,
                    title: task.title,
                    completed: !task.completed
                })
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setTodos(todos.map(item => {
                if (item.id === task.id) {
                    return data
                }
                return item
            }))

            setStatusColor('var(--green)')
            setStatus(`Task marked as ${task.completed ? 'incomplete' : 'completed'}!`)

        } catch (error) {
            console.error(error)
            setStatus("Failed to update todo")

        } finally {
            setTimeout(() => {
                setStatusColor('var(--red)')
                setStatus(null)
            }, 4000)
        }
    }


    async function handleFormSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()
        const form = e.currentTarget
        const title = form.todo.value as string
        if (title) {
            await addTask(title)
            form.reset()
        }
    }


    return (
        <div>
            <CardHeader
                title="Tasks To Do"
                color='red'
            />

            <div className={styles.todoDisplay}>
                <div>

                    {/* list of all the tasks in the database */}
                    {todos.reverse().map((item: Task, index: number) =>
                        <div className={styles.tasks} key={index}>
                            <div className={styles.task}>
                                <button
                                    className={styles.todoDelete}
                                    onClick={() => removeTask(item.id)}
                                    title={`Delete task #${item.id}`}
                                >
                                    <Image
                                        src={Circle}
                                        height={12}
                                        width={12}
                                        alt={`Red circle #${item.id}`}
                                    />
                                </button>
                                <button
                                    className={`${styles.todoTitle} ${item.completed ? styles.todoCompleted : ''}`}
                                    onClick={() => toggleTaskComplete(item)}
                                    title={
                                        item.completed ?
                                        `Completed on ${moment(item.updated_at).format('MMM Do, YYYY h:mm:ss A')}`:
                                        `Created on ${moment(item.created_at).format('MMM Do, YYYY h:mm:ss A')}`
                                    }
                                >
                                    {item.title}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* form to add a new task */}
                    <form onSubmit={handleFormSubmit} data-testid="todoForm">
                        <input
                            className={styles.cardInput}
                            type="text"
                            name="todo"
                            data-testid="todo"
                            autoCorrect='on'
                            autoComplete='off'
                            placeholder="Press enter after typing"
                        />
                    </form>

                    {/* success or error message */}
                    {status !== null && <p>
                        <small style={{color: statusColor}}>{status}</small>
                    </p>}
                </div>
            </div>
        </div>
    )
}

export default CardToDo