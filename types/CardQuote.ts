export type Quote = {
    quote: string
    length: number
    author: string
    tags: string[]
    category: string
    language: string
    date: Date
    permalink: URL
    id: string
    background: URL
    title: string
}

export type FetchedQuotes = {
    success: {
        total: number
    }
    contents: {
       quotes: Quote[]
    }
    baseurl: URL
    copyright: {
       year: number
       url: URL
    }
}