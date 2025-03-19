export type Habit = {
    id: number
    name: string
    description: string
    last_completed: string
    created_at: string
    updated_at: string
    streak: number
}

export type FetchedHabits = Habit[]