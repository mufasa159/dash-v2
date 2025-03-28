import { NextResponse } from 'next/server'
import pool from "@/lib/database"


export async function GET() {
    const client = await pool.connect()
    try {
        const q = "SELECT * FROM todo;"
        const result = await client
            .query(q)
            .then(res => res.rows)
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

export async function POST(req: Request) {
    const client = await pool.connect()
    try {
        const { title } = await req.json()
        const q = `
            INSERT INTO todo (title)
            VALUES ($1)
            RETURNING *;
        `
        const result = await client
            .query(q, [title])
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

export async function DELETE(req: Request) {
    const client = await pool.connect()
    try {
        const { id } = await req.json()
        const q = `
            DELETE FROM todo
            WHERE id = $1
            RETURNING *;
        `
        const result = await client
            .query(q, [id])
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

export async function PUT(req: Request) {
    const client = await pool.connect()
    try {
        const { id, title, completed } = await req.json()
        const q = `
            UPDATE todo
            SET
                title = $2,
                completed = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `
        const result = await client
            .query(q, [id, title, completed])
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