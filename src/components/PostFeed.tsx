"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import GuestBanner from "./GuestBanner";
import { useGuestId } from "@/hooks/useGuestId";

interface Post {
    id: string;
    content: string;
    mediaUrl: string | null;
    mediaType: string | null;
    createdAt: string;
    _count: { views: number; likes: number };
}

interface PostFeedProps {
    posts: Post[];
    likedPostIds: string[];
}

export default function PostFeed({ posts, likedPostIds }: PostFeedProps) {
    const { guestId, username, updateUsername } = useGuestId();
    const [likedSet] = useState<Set<string>>(new Set(likedPostIds));

    if (posts.length === 0) {
        return (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm">
                    <span className="text-2xl">📝</span>
                </div>
                <p className="text-muted-foreground text-lg font-display">No journal entries yet.</p>
                <p className="text-muted-foreground/60 text-sm mt-2 font-body">Check back soon...</p>
            </div>
        );
    }

    return (
        <>
            <GuestBanner username={username} updateUsername={updateUsername} />
            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        guestId={guestId}
                        initiallyLiked={likedSet.has(post.id)}
                    />
                ))}
            </div>
        </>
    );
}
