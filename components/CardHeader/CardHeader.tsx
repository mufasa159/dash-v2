'use client'

import styles from './CardHeader.module.css';
import React from 'react'


const CardHeader = (props: {
    title: string
    color?: string
}) => {

    return (
        <div className={styles.header}>
            <h3
                style={{color: `var(--${props.color || 'foreground'})`}}
            >
                {props.title}
            </h3>
        </div>
    )
}

export default CardHeader