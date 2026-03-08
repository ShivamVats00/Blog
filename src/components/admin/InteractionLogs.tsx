"use client";

import { useState, useEffect } from "react";
import { getPostWithInteractions } from "@/actions/posts";
import { Eye, Heart, User, Clock, X } from "lucide-react";

interface InteractionLogsProps {
    postId: string;
    onClose: () => void;
}

interface ViewLog {
    id: string;
    viewedAt: string;
    guest: { id: string; username: string | null };
}

interface LikeLog {
    id: string;
    likedAt: string;
    guest: { id: string; username: string | null };
}

function formatDetailedTime(dateStr: string) {
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

export default function InteractionLogs({ postId, onClose }: InteractionLogsProps) {
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState<ViewLog[]>([]);
    const [likes, setLikes] = useState<LikeLog[]>([]);
    const [activeTab, setActiveTab] = useState<"views" | "likes">("views");
    const [postContent, setPostContent] = useState("");

    useEffect(() => {
        async function fetchData() {
            const post = await getPostWithInteractions(postId);
            if (post) {
                setPostContent(post.content.substring(0, 100) + (post.content.length > 100 ? "..." : ""));
                setViews(
                    post.views.map((v: any) => ({
                        ...v,
                        viewedAt: v.viewedAt.toISOString ? v.viewedAt.toISOString() : String(v.viewedAt),
                        guest: v.guest,
                    }))
                );
                setLikes(
                    post.likes.map((l: any) => ({
                        ...l,
                        likedAt: l.likedAt.toISOString ? l.likedAt.toISOString() : String(l.likedAt),
                        guest: l.guest,
                    }))
                );
            }
            setLoading(false);
        }
        fetchData();
    }, [postId]);

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div>
                        <h3 className="font-semibold tracking-tight text-foreground font-display text-lg">Interaction Logs</h3>
                        <p className="text-[13px] text-muted-foreground mt-1 line-clamp-1 font-body italic">{postContent}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab("views")}
                        className={`flex-1 py-3 text-[13px] font-medium flex items-center justify-center gap-2 transition-all font-body ${activeTab === "views"
                            ? "text-primary border-b-2 border-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            }`}
                    >
                        <Eye className="w-[15px] h-[15px]" />
                        Views ({views.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("likes")}
                        className={`flex-1 py-3 text-[13px] font-medium flex items-center justify-center gap-2 transition-all font-body ${activeTab === "likes"
                            ? "text-red-500 border-b-2 border-red-500 bg-red-500/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            }`}
                    >
                        <Heart className="w-[15px] h-[15px]" />
                        Likes ({likes.length})
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-background/50">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-6 h-6 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
                        </div>
                    ) : activeTab === "views" ? (
                        views.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8 text-sm font-body">No views yet</p>
                        ) : (
                            <div className="space-y-2">
                                {views.map((view) => (
                                    <div
                                        key={view.id}
                                        className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border/60 hover:border-border transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-secondary border border-border rounded-md flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate font-body">
                                                {view.guest.username || "Anonymous Guest"}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground/80 font-mono truncate bg-secondary/30 px-1 py-0.5 rounded w-fit mt-0.5">
                                                ID: {view.guest.id}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium font-body">{formatDetailedTime(view.viewedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : likes.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 text-sm font-body">No likes yet</p>
                    ) : (
                        <div className="space-y-2">
                            {likes.map((like) => (
                                <div
                                    key={like.id}
                                    className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border/60 hover:border-border transition-colors"
                                >
                                    <div className="w-8 h-8 bg-red-500/5 border border-red-500/20 rounded-md flex items-center justify-center flex-shrink-0">
                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate font-body">
                                            {like.guest.username || "Anonymous Guest"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground/80 font-mono truncate bg-secondary/30 px-1 py-0.5 rounded w-fit mt-0.5">
                                            ID: {like.guest.id}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium font-body">{formatDetailedTime(like.likedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
