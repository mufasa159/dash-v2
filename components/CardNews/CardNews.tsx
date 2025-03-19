'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import type { FetchedNews, News } from '@/types/CardNews'
import CardHeader from '@/components/CardHeader/CardHeader'
import styles from './CardNews.module.css'
import PlaceholderImage from '@/assets/placeholders/1c1c28.jpg'
import Image from 'next/image'
import moment from 'moment'


const CardNews = () => {

    const [news, setNews] = useState<FetchedNews | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        const fetchNews = async () => {
            setStatus("Loading...")
            try {
                const res = await fetch('/api/news', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                setNews(data)
                setStatus(null)

            } catch (error) {
                console.error(error)
                setStatus("Failed to fetch news")
            }
        }

        fetchNews()

        // fetch news every 30 minutes
        const intervalId = setInterval(fetchNews, 1800000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            <CardHeader
                title="Top Headlines"
                color='blue'
            />

            <div className={styles.newsDisplay}>
                {status !== null && <p>{status}</p>}
                {news !== null && news.articles.map((article: News, index: number) => (
                    <a href={article.url} target="_blank" key={index} rel="noreferrer">
                        <div className={styles.newsImage}>
                            <Image
                                className={styles.thumbnail}
                                src={article.urlToImage ? article.urlToImage : PlaceholderImage}
                                alt={article.title}
                                width={100}
                                height={100}
                            />
                        </div>

                        <div>
                            {article.title.indexOf("- ") > 90 ? (
                                <>
                                    <p>{article.title.substring(0,80)} ...</p>
                                    <small>{`${article.source.name} - ${moment(article.publishedAt).fromNow()}`}</small>
                                </>
                            ) : (
                                <>
                                    <p>{article.title.substring(0, article.title.indexOf("- "))}</p>
                                    <small>{`${article.source.name} - ${moment(article.publishedAt).fromNow()}`}</small>
                                </>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default CardNews