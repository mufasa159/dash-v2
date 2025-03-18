export async function GET() {
    return  Response.json([
        {
            "id": 1,
            "title": "Complete Dash V2",
            "completed": false,
            "created_at": "2025-03-20T12:00:00Z",
            "updated_at": "2025-03-20T12:00:00Z"
        }
    ])
}