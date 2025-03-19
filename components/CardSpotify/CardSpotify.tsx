"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SpotifyArtist, SpotifyTrack } from "@/types/CardSpotify";
import styles from './CardSpotify.module.css'
import { dashConfig } from "@/lib/config";
import CardHeader from "../CardHeader/CardHeader";
import { SpotifyTopItemsType, SpotifyWidgetDefaultView } from "@/types";
import Image from "next/image";


const { widget, options } = dashConfig.spotify;

const CardSpotify = () => {
    const { data: session } = useSession();

    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [artists, setArtists] = useState<SpotifyArtist[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopItems(type: SpotifyTopItemsType) {
            if (!session?.accessToken) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/spotify/top-${type}?limit=${options.topItemsLimit}&time_range=${options.topItemsTimeRange}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch top tracks");
                }

                const data = await response.json();

                if (type === SpotifyTopItemsType.TRACKS) setTracks(data.items || []);
                if (type === SpotifyTopItemsType.ARTISTS) setArtists(data.items || []);

            } catch (err) {
                console.error("Error fetching top tracks:", err);
                setError("Failed to load top tracks");

            } finally {
                setLoading(false);
            }
        }


        if (
            widget.view === SpotifyWidgetDefaultView.TOP_ITEMS &&
            options.topItemsType === SpotifyTopItemsType.TRACKS
        ) {
            fetchTopItems(SpotifyTopItemsType.TRACKS);

        } else if (
            widget.view === SpotifyWidgetDefaultView.TOP_ITEMS &&
            options.topItemsType === SpotifyTopItemsType.ARTISTS
        ) {
            fetchTopItems(SpotifyTopItemsType.ARTISTS);
        }
    }, [session]);


    function formatMultipleArtists(artists: SpotifyArtist[]): string {
        return artists.map((artist) => artist.name).join(", ");
    }

    function truncateText(
        text: string,
        length: number = 20
    ): string {
        return text.length > length ? `${text.substring(0, length)}...` : text;
    }

    return (
        <div>
            <CardHeader
                title={widget.title}
                color="green"
            />

            <div className={styles.spotifyDisplay}>

                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'var(--red)'}}>Something went wrong.</p>}

                {/* display user's top tracks */}        
                {
                    widget.view === SpotifyWidgetDefaultView.TOP_ITEMS &&
                    options.topItemsType === SpotifyTopItemsType.TRACKS &&
                (
                    <>
                        {tracks.length === 0 && !loading && !error && <p>No tracks found.</p>}
                        {tracks.map((track, index) => (
                            <div className={styles.track} key={index}>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://open.spotify.com/track/${track.id}`}
                                    key={index}
                                >
                                    <Image
                                        className={styles.coverArt}
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        width={50}
                                        height={50}
                                    />
                                </a>

                                <div className={styles.text}>
                                    <div className={styles.title}>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`https://open.spotify.com/track/${track.id}`}
                                            key={index}
                                        >
                                            {truncateText(track.name)}
                                        </a>
                                    </div>

                                    {track.artists.length > 1 ? (
                                        <small>{truncateText(formatMultipleArtists(track.artists))}</small>
                                    ):(
                                        <small>{truncateText(track.artists[0].name)}</small>
                                    )}
                                
                                </div>
                            </div>
                        ))}
                    </>
                )}


                {/* display user's top artists */}
                {
                    widget.view === SpotifyWidgetDefaultView.TOP_ITEMS &&
                    options.topItemsType === SpotifyTopItemsType.ARTISTS &&
                (
                    <>
                        {artists.length === 0 && !loading && !error && <p>No artists found.</p>}
                        {artists.map((artist, index) => (
                            <div className={styles.track} key={index}>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={artist.external_urls.spotify}
                                    key={index}
                                >
                                    <Image
                                        className={styles.coverArt}
                                        src={artist.images[1].url}
                                        alt={artist.name}
                                        width={50}
                                        height={50}
                                    />
                                </a>

                                <div className={styles.text}>
                                    <div className={styles.title}>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={artist.external_urls.spotify}
                                            key={index}
                                        >
                                            {truncateText(artist.name)}
                                        </a>
                                    </div>

                                    <small>#{artist.popularity}</small>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default CardSpotify