"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { deletePost } from "@/actions/posts";
import CreatePostForm from "./CreatePostForm";
import InteractionLogs from "./InteractionLogs";
import {
    LogOut,
    Eye,
    Heart,
    ChevronRight,
    BarChart3,
    Trash2,
    LayoutDashboard,
} from "lucide-react";

interface Post {
    id: string;
    content: string;
    mediaUrl: string | null;
    mediaType: string | null;
    createdAt: string;
    _count: { views: number; likes: number };
}

function formatTimestamp(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

export default function Dashboard({ posts }: { posts: Post[] }) {
    const router = useRouter();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleLogout = async () => {
        await logout();
        router.refresh();
    };

    const handlePostCreated = () => {
        router.refresh();
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeletingId(postId);
        await deletePost(postId);
        router.refresh();
        setDeletingId(null);
    };

    const totalViews = posts.reduce((sum, p) => sum + p._count.views, 0);
    const totalLikes = posts.reduce((sum, p) => sum + p._count.likes, 0);

    return (
        <>
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary border border-border rounded-xl flex items-center justify-center shadow-sm">
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground font-display">Dashboard</h1>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest font-body">Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors bg-secondary/50 hover:bg-secondary px-4 py-2 rounded-xl border border-border shadow-sm font-body"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-5 text-center flex flex-col justify-center">
                        <p className="text-3xl font-bold tracking-tight text-foreground font-display">
                            {posts.length}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wider font-body">Posts</p>
                    </div>
                    <div className="glass-card rounded-2xl p-5 text-center flex flex-col justify-center">
                        <p className="text-3xl font-bold tracking-tight text-foreground font-display">
                            {totalViews}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wider font-body">Total Views</p>
                    </div>
                    <div className="glass-card rounded-2xl p-5 text-center flex flex-col justify-center">
                        <p className="text-3xl font-bold tracking-tight text-foreground font-display">
                            {totalLikes}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wider font-body">Total Likes</p>
                    </div>
                </div>

                <CreatePostForm onPostCreated={handlePostCreated} />

                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-xl font-semibold tracking-tight text-foreground font-display">All Posts</h2>
                    </div>

                    {posts.length === 0 ? (
                        <div className="glass-card rounded-xl p-8 text-center">
                            <p className="text-sm font-medium text-muted-foreground font-body">No posts yet. Create your first entry above!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="glass-card rounded-xl p-5 hover:border-border transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wide font-display">
                                                {formatTimestamp(post.createdAt)}
                                            </p>
                                            <p className="text-foreground text-sm line-clamp-3 leading-relaxed font-body font-light">
                                                {post.content}
                                            </p>

                                            <div className="flex items-center gap-5 mt-4">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 border border-border/50">
                                                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-[12px] font-medium text-muted-foreground font-body">
                                                        {post._count.views} <span className="hidden sm:inline">views</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 border border-border/50">
                                                    <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-[12px] font-medium text-muted-foreground font-body">
                                                        {post._count.likes} <span className="hidden sm:inline">likes</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => setSelectedPostId(post.id)}
                                                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium bg-secondary border border-border hover:bg-secondary/80 px-3 py-2 rounded-lg transition-all shadow-sm font-body"
                                            >
                                                Logs
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deletingId === post.id}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                                                title="Delete post"
                                            >
                                                {deletingId === post.id ? (
                                                    <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedPostId && (
                <InteractionLogs
                    postId={selectedPostId}
                    onClose={() => setSelectedPostId(null)}
                />
            )}
        </>
    );
}
