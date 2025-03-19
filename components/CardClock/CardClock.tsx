'use client'

import React, { useState, useEffect } from 'react'
import styles from './CardClock.module.css'

const CardClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime?.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: process.env.NEXT_PUBLIC_TIMEZONE
    });

    const formattedDate = currentTime?.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedWeekday = currentTime?.toLocaleDateString([], {
        weekday: 'long',
    });

    if (!mounted) {
        return (
            <div className="CardClock_container">
                <p>-</p>
                <p>-</p>
                <h1>-</h1>
            </div>
        );
    }

    return (
        <div className={`${styles.cardClock}`}>
            <p>{formattedWeekday}</p>
            <p>{formattedDate}</p>
            <h1>{formattedTime}</h1>
        </div>
    );
};

export default CardClock;