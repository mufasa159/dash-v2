import { SpotifyTimeRange, SpotifyTopItemsType } from "@/types";
import type {
    SpotifyPaginatedResponse,
    SpotifyTrack,
    SpotifyPlaylist,
    SpotifyUser
} from "@/types/CardSpotify";


/**
 * A general function to dynamically fetch data
 * from the Spotify API, used by the handler
 * functions to fetch specific type of data.
 * 
 * @param endpoint The Spotify API endpoint
 * @param accessToken The user's access token
 * @param params Query parameters
 * @returns The response from the Spotify API
 */
export async function spotifyFetch<T>(
    endpoint: string,
    accessToken: string,
    params: Record<string, string | number> = {}
): Promise<T> {
    const url = new URL(`https://api.spotify.com/v1${endpoint}`);

    // add query parameters
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || "Error fetching from Spotify API");
    }

    return response.json();
}


/**
 * Function to get the current user's profile
 * from the Spotify API.
 * 
 * @param accessToken The user's access token
 * @returns The user's profile
 */
export async function getCurrentUser(
    accessToken: string
): Promise<SpotifyUser> {
    return spotifyFetch<SpotifyUser>("/me", accessToken);
}


/**
 * Function to get the user's top tracks or artists
 * from the Spotify API.
 * 
 * @param accessToken The user's access token
 * @param timeRange The time range for the data
 * @param limit The number of items to return
 * @param offset The index of the first item to return
 * @param type The type of items to return
 * @returns The user's top tracks or artists
 */
export async function getTopItems(
    accessToken: string,
    timeRange: SpotifyTimeRange = SpotifyTimeRange.SHORT,
    limit: number = 10,
    offset: number = 0,
    type: SpotifyTopItemsType = SpotifyTopItemsType.TRACKS
): Promise<SpotifyPaginatedResponse<SpotifyTrack>> {

    return spotifyFetch<SpotifyPaginatedResponse<SpotifyTrack>>(
        `/me/top/${type}`,
        accessToken,
        {
            time_range: timeRange,
            limit,
            offset,
        }
    );
}


/**
 * Function to get the user's playlists
 * from the Spotify API.
 * 
 * @param accessToken The user's access token
 * @param limit The number of items to return
 * @param offset The index of the first item to return
 * @returns The user's playlists
 */
export async function getUserPlaylists(
    accessToken: string,
    limit: number = 20,
    offset: number = 0
): Promise<SpotifyPaginatedResponse<SpotifyPlaylist>> {
    return spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylist>>(
        "/me/playlists",
        accessToken,
        {
            limit,
            offset,
        }
    );
}


/**
 * Function to get the user's recently played
 * tracks from the Spotify API.
 * 
 * @param accessToken The user's access token
 * @param limit The number of items to return
 * @returns The user's recently played tracks
 */
export async function getRecentlyPlayed(
    accessToken: string,
    limit: number = 20
): Promise<SpotifyPaginatedResponse<{
    track: SpotifyTrack;
    played_at: string
}>> {
    return spotifyFetch<SpotifyPaginatedResponse<{
        track: SpotifyTrack;
        played_at: string
    }>>(
        "/me/player/recently-played",
        accessToken,
        { limit }
    );
}
