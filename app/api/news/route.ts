import { dashConfig } from "@/lib/config";

export async function GET() {
    const k  = process.env.NEWS_API_KEY
    const e  = dashConfig.news.endpoint;
    const ca = dashConfig.news.options.category
    const co = dashConfig.news.options.country
    const ps = dashConfig.news.options.count

    try {
        const res = await fetch(`${e}?category=${ca}&pageSize=${ps}&country=${co}&apiKey=${k}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            },
            next: {
                revalidate: dashConfig.news.cache.minutes * 60
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