import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getTopItems } from "../spotify";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyTimeRange, SpotifyTopItemsType } from "@/types";


export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const timeRange = searchParams.get("timeRange") as SpotifyTimeRange || SpotifyTimeRange.SHORT;
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");

        const topArtists = await getTopItems(
            session.accessToken,
            timeRange,
            limit,
            offset,
            SpotifyTopItemsType.ARTISTS
        );

        return NextResponse.json(topArtists);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching top tracks:", error);
            return NextResponse.json(
                { error: error.message || "Error fetching top tracks" },
                { status: 500 }
            );
        } else {
            console.error("Unknown error:", error);
            return NextResponse.json(
                { error: "An unknown error occurred" },
                { status: 500 }
            );
        }
    }
}