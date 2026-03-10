"use client";

import { useEffect, useRef, useState } from "react";

interface TwitterEmbedProps {
    tweetUrl: string;
}

declare global {
    interface Window {
        twttr?: {
            widgets: {
                load: (element?: HTMLElement) => void;
                createTweet: (
                    tweetId: string,
                    container: HTMLElement,
                    options?: Record<string, unknown>
                ) => Promise<HTMLElement>;
            };
        };
    }
}

function extractTweetId(url: string): string | null {
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
    return match ? match[1] : null;
}

export default function TwitterEmbed({ tweetUrl }: TwitterEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(false);
    const rendered = useRef(false);

    useEffect(() => {
        if (rendered.current || !containerRef.current) return;

        const tweetId = extractTweetId(tweetUrl);
        if (!tweetId) {
            setFailed(true);
            return;
        }

        const tryRender = (retries = 0) => {
            if (window.twttr?.widgets && containerRef.current) {
                rendered.current = true;
                window.twttr.widgets
                    .createTweet(tweetId, containerRef.current, {
                        theme: "dark",
                        dnt: true,
                        align: "center",
                    })
                    .then((el) => {
                        if (!el) setFailed(true);
                    })
                    .catch(() => setFailed(true));
            } else if (retries < 20) {
                setTimeout(() => tryRender(retries + 1), 300);
            } else {
                setFailed(true);
            }
        };

        tryRender();
    }, [tweetUrl]);

    if (failed) {
        return (
            <div className="my-4">
                <a
                    href={tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-secondary/30 text-foreground hover:bg-secondary/60 transition-all text-sm font-body"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    View post on X
                </a>
            </div>
        );
    }

    return (
        <div className="twitter-embed-container my-4 flex justify-center">
            <div ref={containerRef} className="w-full max-w-[550px]" />
        </div>
    );
}
