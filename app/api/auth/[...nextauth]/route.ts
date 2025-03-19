import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { SpotifyTokenResponse } from "@/types/CardSpotify";

const scopes = [
    "user-library-read",
    "user-top-read",
    "user-read-recently-played",
].join(" ");


async function refreshAccessToken(
    token: {
        accessToken: string;
        refreshToken: string;
        expiresAt: number
    }
) {
    try {
        const url = "https://accounts.spotify.com/api/token";

        const basicAuth = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
            cache: "no-store",
        });

        const refreshedTokens: SpotifyTokenResponse = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                params: { scope: scopes }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {

            // initial sign in
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                return token;
            }

            // return the previous token if the access token has not expired
            if (Date.now() < (token.expiresAt as number) * 1000) {
                return token;
            }

            // access token has expired, refresh it
            return await refreshAccessToken({
                accessToken: token.accessToken as string,
                refreshToken: token.refreshToken as string,
                expiresAt: token.expiresAt as number,
            });
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };