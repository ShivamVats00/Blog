"use client";

import TwitterEmbed from "./TwitterEmbed";
import YouTubeEmbed from "./YouTubeEmbed";

interface PostContentProps {
    content: string;
}

const TWITTER_REGEX = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/\d+/;
const YOUTUBE_REGEX = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;

function extractYouTubeId(url: string): string | null {
    const match = url.match(YOUTUBE_REGEX);
    return match ? match[1] : null;
}

export default function PostContent({ content }: PostContentProps) {
    const lines = content.split("\n");

    return (
        <div className="text-foreground text-base md:text-[17px] leading-relaxed mb-6 font-body font-light">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                // Check for Twitter/X URL
                if (TWITTER_REGEX.test(trimmed)) {
                    const match = trimmed.match(TWITTER_REGEX);
                    if (match) {
                        return <TwitterEmbed key={i} tweetUrl={match[0]} />;
                    }
                }

                // Check for YouTube URL
                if (YOUTUBE_REGEX.test(trimmed)) {
                    const videoId = extractYouTubeId(trimmed);
                    if (videoId) {
                        return <YouTubeEmbed key={i} videoId={videoId} />;
                    }
                }

                // Regular text line
                return (
                    <span key={i}>
                        {line}
                        {i < lines.length - 1 && <br />}
                    </span>
                );
            })}
        </div>
    );
}
