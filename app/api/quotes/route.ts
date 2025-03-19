import { dashConfig } from "@/lib/config";

export async function GET() {
    const endpoint = dashConfig.quotes.endpoint
    const lang = dashConfig.quotes.options.language
    const apiKey = process.env.TSS_QUOTE_API_KEY

    try {
        const res = await fetch(`${endpoint}?language=${lang}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Access-Control-Allow-Origin': '*'
            },
            next: {
                revalidate: dashConfig.quotes.cache.minutes * 60
            }
        })
        const data = await res.json()
        return Response.json(data)

    } catch (error) {
        console.error(error)
        return new Response("Failed to fetch news", {
            status: 500
        })
    }
}