"use client";

interface YouTubeEmbedProps {
    videoId: string;
}

export default function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
    return (
        <div className="youtube-embed-container my-4">
            <div className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-black/20" style={{ paddingBottom: "56.25%" }}>
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
