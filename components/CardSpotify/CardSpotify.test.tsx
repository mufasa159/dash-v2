import { render, screen, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import CardSpotify from "./CardSpotify";
import { dashConfig } from "@/lib/config";
import { SpotifyTopItemsType } from "@/types";


jest.mock("next-auth/react");
jest.mock('next/image', () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        return <img {...props} />;
    },
}));


describe("CardSpotify", () => {
    const mockSession = { accessToken: "mockAccessToken" };

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({ data: mockSession });
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state", () => {
        (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
        render(<CardSpotify />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders error state when fetch fails", async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));
        render(<CardSpotify />);
        await waitFor(() => expect(screen.getByText("Something went wrong.")).toBeInTheDocument());
    });

    it("renders 'No tracks found.' when no tracks are returned", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ items: [] }),
        });
        render(<CardSpotify />);
        await waitFor(() => expect(screen.getByText("No tracks found.")).toBeInTheDocument());
    });

    it("renders top tracks correctly", async () => {
        const mockTracks = [
            {
                id: "1",
                name: "Track 1",
                album: { images: [{ url: "track1.jpg" }] },
                artists: [{ name: "Artist 1" }],
            },
            {
                id: "2",
                name: "Track 2",
                album: { images: [{ url: "track2.jpg" }] },
                artists: [{ name: "Artist 2" }],
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ items: mockTracks }),
        });
        render(<CardSpotify />);
        await waitFor(() => {
            expect(screen.getByText("Track 1")).toBeInTheDocument();
            expect(screen.getByText("Track 2")).toBeInTheDocument();
            expect(screen.getByAltText("Track 1")).toHaveAttribute("src", "track1.jpg");
            expect(screen.getByAltText("Track 2")).toHaveAttribute("src", "track2.jpg");
        });
    });

    it("renders 'No artists found.' when no artists are returned", async () => {
        dashConfig.spotify.options.topItemsType = SpotifyTopItemsType.ARTISTS;
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ items: [] }),
        });
        render(<CardSpotify />);
        await waitFor(() => expect(screen.getByText("No artists found.")).toBeInTheDocument());
    });

    it("renders top artists correctly", async () => {
        dashConfig.spotify.options.topItemsType = SpotifyTopItemsType.ARTISTS;
        const mockArtists = [
            {
                name: "Artist 1",
                images: [{}, { url: "artist1.jpg" }],
                external_urls: { spotify: "https://spotify.com/artist1" },
                popularity: 80,
            },
            {
                name: "Artist 2",
                images: [{}, { url: "artist2.jpg" }],
                external_urls: { spotify: "https://spotify.com/artist2" },
                popularity: 70,
            },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ items: mockArtists }),
        });
        render(<CardSpotify />);
        await waitFor(() => {
            expect(screen.getByText("Artist 1")).toBeInTheDocument();
            expect(screen.getByText("Artist 2")).toBeInTheDocument();
            expect(screen.getByAltText("Artist 1")).toHaveAttribute("src", "artist1.jpg");
            expect(screen.getByAltText("Artist 2")).toHaveAttribute("src", "artist2.jpg");
            expect(screen.getByText("#80")).toBeInTheDocument();
            expect(screen.getByText("#70")).toBeInTheDocument();
        });
    });
});