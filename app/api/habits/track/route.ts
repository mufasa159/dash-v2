import { NextRequest, NextResponse } from 'next/server'
import pool from "@/lib/database"
import { calculateStreak } from '../habits'


export async function POST(req: NextRequest) {
    const client = await pool.connect()
    try {
        const { id, completed } = await req.json()

        // get habit for calculating streak
        const q_get = `
            SELECT *
            FROM habits
            WHERE id = $1;
        `
        const habit = await client
            .query(q_get, [id])
            .then(res => res.rows[0])
            .catch(err => {
                throw err
            })
        
        if (!habit) {
            return NextResponse.json(
                { error: "Habit not found" },
                { status: 404 }
            )
        }

        const streak = calculateStreak(habit.last_completed, habit.streak)

        // update habit
        const q_update = `
            UPDATE habits
            SET
                last_completed = ${completed ? "CURRENT_TIMESTAMP" : "last_completed"},
                streak = ${completed ? streak : "streak"},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `
        const result = await client
            .query(q_update, [id])
            .then(res => res.rows[0])
            .catch(err => {
                throw err
            })
        return Response.json(result)

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: msg },
            { status: 500 }
        )

    } finally {
        client.release()
    }
}