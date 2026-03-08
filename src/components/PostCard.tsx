"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Heart, Eye } from "lucide-react";
import { recordView, toggleLike } from "@/actions/interactions";

interface PostCardProps {
    post: {
        id: string;
        content: string;
        mediaUrl: string | null;
        mediaType: string | null;
        createdAt: string;
        _count: { views: number; likes: number };
    };
    guestId: string | null;
    initiallyLiked: boolean;
}

function formatTimestamp(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

export default function PostCard({ post, guestId, initiallyLiked }: PostCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const viewRecorded = useRef(false);
    const [liked, setLiked] = useState(initiallyLiked);
    const [likeCount, setLikeCount] = useState(post._count.likes);
    const [viewCount, setViewCount] = useState(post._count.views);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!guestId || viewRecorded.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !viewRecorded.current) {
                        viewRecorded.current = true;
                        recordView(post.id, guestId).then(() => {
                            setViewCount((prev) => prev + 1);
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [guestId, post.id]);

    const handleLike = useCallback(async () => {
        if (!guestId) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount((prev) => prev + (newLiked ? 1 : -1));

        const result = await toggleLike(post.id, guestId);
        setLiked(result.liked);
        setLikeCount(result.count);
    }, [guestId, liked, post.id]);

    return (
        <div
            ref={cardRef}
            className="group relative glass-card rounded-xl p-6 md:p-8 transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:-translate-y-[2px]"
        >

            <div className="relative z-10">
                <p className="text-[11px] font-bold text-muted-foreground mb-4 tracking-wider uppercase font-display">
                    {formatTimestamp(post.createdAt)}
                </p>

                <p className="text-foreground text-base md:text-[17px] leading-relaxed whitespace-pre-wrap mb-6 font-body font-light">
                    {post.content}
                </p>

                {post.mediaUrl && (
                    <div className="mb-5 rounded-xl overflow-hidden border border-border/50">
                        {post.mediaType?.startsWith("video") ? (
                            <video
                                src={post.mediaUrl}
                                controls
                                className="w-full max-h-[500px] object-cover"
                            />
                        ) : (
                            <img
                                src={post.mediaUrl}
                                alt="Post media"
                                className="w-full max-h-[500px] object-cover"
                            />
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-5 mt-6 border-t border-border/50">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2.5 group/like transition-all duration-200"
                            aria-label={liked ? "Unlike post" : "Like post"}
                        >
                            <Heart
                                className={`w-[18px] h-[18px] transition-all duration-300 ${isAnimating ? "scale-125" : "scale-100"
                                    } ${liked
                                        ? "fill-red-500 text-red-500 drop-shadow-sm"
                                        : "text-muted-foreground group-hover/like:text-foreground"
                                    }`}
                            />
                            <span
                                className={`text-sm font-medium transition-colors ${liked ? "text-red-500" : "text-muted-foreground group-hover/like:text-foreground"
                                    }`}
                            >
                                {likeCount}
                            </span>
                        </button>

                        <div className="flex items-center gap-2.5">
                            <Eye className="w-[18px] h-[18px] text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{viewCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
