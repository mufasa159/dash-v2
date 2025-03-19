import { NextRequest, NextResponse } from 'next/server'
import pool from "@/lib/database"


export async function GET() {
    const client = await pool.connect()
    try {
        const q = "SELECT * FROM habits;"
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

export async function POST(req: NextRequest) {
    const client = await pool.connect()
    try {
        const { name, description } = await req.json()
        const q = `
            INSERT INTO habits (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `
        const result = await client
            .query(q, [name, description])
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

export async function PUT(req: NextRequest) {
    const client = await pool.connect()
    try {
        const { id, name, description } = await req.json()
        const q = `
            UPDATE habits
            SET
                name = $2,
                description = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `
        const result = await client
            .query(q, [id, name, description])
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

export async function DELETE(req: NextRequest) {
    const client = await pool.connect()
    try {
        const { id } = await req.json()
        const q = `
            DELETE FROM habits
            WHERE id = $1;
        `
        const result = await client
            .query(q, [id])
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