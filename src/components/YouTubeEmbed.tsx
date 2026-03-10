"use client";

interface YouTubeEmbedProps {
    url: string;
}

const YOUTUBE_REGEX =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:(?:watch\?(?:.*&)?v=)|(?:embed\/)|(?:v\/)|(?:shorts\/))|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/i;

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
    const match = url.match(YOUTUBE_REGEX);
    const videoId = match?.[1];

    if (!videoId) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm font-body"
            >
                {url}
            </a>
        );
    }

    return (
        <div className="youtube-embed-container my-4">
            <div
                className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-black/20"
                style={{ paddingBottom: "56.25%" }}
            >
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
