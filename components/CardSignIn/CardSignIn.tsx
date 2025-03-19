"use client";

import { signIn } from "next-auth/react";
import styles from './CardSignIn.module.css';

export default function SignInButton() {
    return (
        <div className={styles.signIn}>
            <button
                onClick={() => signIn("spotify", { callbackUrl: "/" })}
            >
                Sign in with Spotify
            </button>
        </div>
    );
}